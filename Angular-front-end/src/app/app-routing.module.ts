import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {LoginComponent} from './login/login.component';
import {LoaderComponent} from './loader/loader.component';
import {SigninComponent} from './signin/signin.component';
import { AcceuilComponent } from './acceuil/acceuil.component';
import { HeaderComponent } from './header/header.component';

const routes: Routes = [
  { path: '', component: LoginComponent },
  { path: 'login', component: LoginComponent },
  { path: 'loader', component: LoaderComponent },
  { path: 'signin', component: SigninComponent },
  { path: 'Acceuil', component: AcceuilComponent },
  { path: 'header' , component: HeaderComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})

export class AppRoutingModule { }
