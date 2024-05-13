import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './Pages/home/home.component';
import { InscriptionComponent } from './Authentication/inscription/inscription.component';
import { ConnexionComponent } from './Authentication/connexion/connexion.component';
import { CartComponent } from './Pages/cart/cart.component';
import { CategoryComponent } from './Pages/category/category.component';
import { SubcategoryComponent } from './Pages/subcategory/subcategory.component';
import { ProduitsComponent } from './Pages/produits/produits.component';
import { ThankYouComponent } from './Pages/thank-you/thank-you.component';
import { PaiementComponent } from './Pages/paiement/paiement.component';
import { OrderComponent } from './Pages/order/order.component';


const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'Inscription', component: InscriptionComponent },
  { path: 'Connexion', component: ConnexionComponent },
  { path: 'Cart', component: CartComponent },
  { path: 'Order', component: OrderComponent },
  { path: 'Paiement', component: PaiementComponent },
  { path: 'Category/:id', component: CategoryComponent },
  {  path: 'Category/:categoryId/Subcategory/:subcategoryId', component: SubcategoryComponent },
  { path: 'product/:id', component: ProduitsComponent },
  { path: 'thank-you', component: ThankYouComponent },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
