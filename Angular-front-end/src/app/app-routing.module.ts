import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {LoginComponent} from './login/login.component';
import {LoaderComponent} from './loader/loader.component';
import {SigninComponent} from './signin/signin.component';
import { AcceuilComponent } from './acceuil/acceuil.component';
import { HeaderComponent } from './header/header.component';
import { MenuComponent } from './menu/menu.component';
import { ListeCommandeComponent } from './liste-commande/liste-commande.component';
import { ProfilComponent} from  './profil/profil.component' ;
import { ListeRestaurantComponent } from './liste-restaurant/liste-restaurant.component';

const routes: Routes = [
  { path: '', component: AcceuilComponent },
  { path: 'login', component: LoginComponent },
  { path: 'loader', component: LoaderComponent },
  { path: 'signin', component: SigninComponent },
  { path: 'Acceuil', component: AcceuilComponent },
  { path: 'header' , component: HeaderComponent },
  { path: 'menu' , component: MenuComponent },
  { path: 'commande' , component: ListeCommandeComponent},
  { path:'profil' ,component : ProfilComponent},
  { path:'profil/restaurant', component : ListeRestaurantComponent}

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})

export class AppRoutingModule { }
