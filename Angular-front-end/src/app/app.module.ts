import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { LoaderComponent } from './loader/loader.component';
import { SigninComponent } from './signin/signin.component';
import { AcceuilComponent } from './acceuil/acceuil.component';
import { HeaderComponent } from './header/header.component';
import { CardMenuComponent } from './card-menu/card-menu.component';
import { FooterComponent } from './footer/footer.component';
import { MenuComponent } from './menu/menu.component';
import { CardPlatComponent } from './card-plat/card-plat.component';
import { ListeCommandeComponent } from './liste-commande/liste-commande.component';
import { ProfilComponent } from './profil/profil.component';
import { MenuVerticalComponent } from './menu-vertical/menu-vertical.component';
import { ListeRestaurantComponent } from './liste-restaurant/liste-restaurant.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    LoaderComponent,
    SigninComponent,
    AcceuilComponent,
    HeaderComponent,
    CardMenuComponent,
    FooterComponent,
    MenuComponent,
    CardPlatComponent,
    ListeCommandeComponent,
    ProfilComponent,
    MenuVerticalComponent,
    ListeRestaurantComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    CommonModule ,
    HttpClientModule,
    FormsModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
