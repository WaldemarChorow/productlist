import { Routes } from '@angular/router';
import { ProductDetail } from './shared/components/product-detail/product-detail';
import { ProductList } from './shared/components/product-list/product-list';
import { Page404 } from './page-404/page-404';

export const routes: Routes = [
    {path:"", component:ProductList},
    {path:"detail/:name", component:ProductDetail},
    {path:"404", component:Page404},
    { path: '**', component: Page404 }
];
