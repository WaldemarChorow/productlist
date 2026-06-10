import { Injectable, signal } from '@angular/core';
import { Product } from '../interfaces/product';
import { createClient } from '@supabase/supabase-js';
import { ProductModel } from '../../models/productmodels';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class Products {
  supabase = createClient(environment.supabaseUrl, environment.supabaseKey);

  productlistInsertChannel;
  productlistDeleteChannel;

  productlist = signal<Product[]>([]);

  productdetail = signal<Product>({
    id: 0,
    name: 'n/a',
    description: 'n/a',
    specs: 'n/a',
    stock: 0,
    price: 0,
  });

  constructor() {
    this.getAllProducts();

    this.productlistInsertChannel = this.supabase
      .channel('custom-insert-channel')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'product' },
        (payload) => {
          let tmpProduct = new ProductModel(payload.new);
          this.productlist.update((list) => [...list, tmpProduct]);
        },
      )
      .subscribe();

    this.productlistDeleteChannel = this.supabase
      .channel('custom-delete-channel')
      .on(
        'postgres_changes',
        { event: 'DELETE', schema: 'public', table: 'product' },
        (payload) => {
          this.productlist.update((list) => list.filter(product => product.id !== payload.old['id']));
        },
      )
      .subscribe();
  }

  ngOnDestroy() {
    this.supabase.removeChannel(this.productlistInsertChannel);
    this.supabase.removeChannel(this.productlistDeleteChannel);
  }

  async addProduct(product: ProductModel) {
    // console.log(product.getCleanAddJson())
    const product_data = product.getCleanAddJson();
    const { data, error } = await this.supabase.from('product').insert([product_data]).select();
  }

  async deleteProduct(id:number){
     const response = await this.supabase
  .from('product')
  .delete()
  .eq('id', id)
  }

  setProductDetailByName(name: string) {
    let tmpProduct = this.productlist().find((product) => product.name == name);
    if (tmpProduct) this.productdetail.set(tmpProduct);
  }

  setProductDetailById(id: number) {
    let tmpProduct = this.productlist().find((product) => product.id == id);
    if (tmpProduct) this.productdetail.set(tmpProduct);
  }

  async getAllProducts() {
    let response = await this.supabase.from('product').select('*');
    console.log(response.data);
    this.productlist.set((response.data ?? []) as Product[]);
  }
}
