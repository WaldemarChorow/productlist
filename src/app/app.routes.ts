import { Routes } from '@angular/router';
import { ProductDetail } from './shared/components/product-detail/product-detail';
import { ProductList } from './shared/components/product-list/product-list';
import { Page404 } from './page-404/page-404';
import { ProductForm } from './shared/components/product-form/product-form';

export const routes: Routes = [
    {path:"", component:ProductList},
    {path:"detail/:id", component:ProductDetail},
    {path:"404", component:Page404},
    {path:"productform", component:ProductForm},
    {path: '**', component: Page404 }
];
