import { Component, inject } from '@angular/core';
import { FormGroup, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Products } from '../../services/products';
import { Product } from '../../interfaces/product';
import { ProductModel } from '../../../models/productmodels';


@Component({
  selector: 'app-product-form',
  imports: [ReactiveFormsModule],
  templateUrl: './product-form.html',
  styleUrl: './product-form.scss',
})
export class ProductForm {
  router = inject(Router)
  productService = inject(Products)

  productForm = new FormGroup({
    name: new FormControl('n/a', {nonNullable:true,validators: [Validators.required, Validators.minLength(3)]}),
    description: new FormControl('n/a', {nonNullable:true}),
    stock: new FormControl(0, {nonNullable:true, validators: [Validators.required, Validators.min(0)]}),
    price: new FormControl(0.00, {nonNullable:true, validators: [Validators.required, Validators.min(0)]}),
  });

  onSubmit() {
    // TODO: Use output() with form value
    if (this.productForm.valid) {
    console.warn(this.productForm.value);

    let product = new ProductModel(this.productForm.value)

    this.productService.addProduct(product)
    this.router.navigate([""])
    }
  }
}

