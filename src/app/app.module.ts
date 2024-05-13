import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { InscriptionComponent } from './Authentication/inscription/inscription.component';
import { ConnexionComponent } from './Authentication/connexion/connexion.component';
import { SubcategoryComponent } from './Pages/subcategory/subcategory.component';
import { ProduitsComponent } from './Pages/produits/produits.component';
import { CheckoutComponent } from './Pages/checkout/checkout.component';
import { CartComponent } from './Pages/cart/cart.component';
import { HttpClientModule } from '@angular/common/http';
import { HomeComponent } from './Pages/home/home.component';
import { FormsModule } from '@angular/forms';
import { CategoryComponent } from './Pages/category/category.component';
import { CartService } from './Services/cart.service';
import { PaiementComponent } from './Pages/paiement/paiement.component';
import { ThankYouComponent } from './Pages/thank-you/thank-you.component';
import { NgxPayPalModule } from 'ngx-paypal';
import { OrderComponent } from './Pages/order/order.component';


@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    InscriptionComponent,
    ConnexionComponent,
    SubcategoryComponent,
    ProduitsComponent,
    CheckoutComponent,
    CartComponent,
    CategoryComponent,
    PaiementComponent,
    ThankYouComponent,
    OrderComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    NgxPayPalModule
  ],
  providers: [CartService],
  bootstrap: [AppComponent]
})
export class AppModule { }
