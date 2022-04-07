import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {LoginComponent} from './login/login.component';
import {LoaderComponent} from './loader/loader.component';
import {SigninComponent} from './signin/signin.component';

const routes: Routes = [
  { path: '', component: LoginComponent },
  { path: 'loader', component: LoaderComponent },
  { path: 'signin', component: SigninComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
