import { HttpClient , HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { RequestService } from './request/request.service';
import {stringify} from 'flatted';

@Injectable({
  providedIn: 'root'
})
export class UtilisateurService extends RequestService {

  constructor(private router : Router , private httpClient : HttpClient, public requestService : RequestService) {
    super();
   }

  login(user:any) {
    let options : any = this.getOptions();
    let body = new FormData();
    user = JSON.stringify(user);
    body.append("user", user);

    const params = new HttpParams({
      fromObject: {
        grant_type: 'password',
        prenom: 'noom',
        nom: "password",
        scope: 'if no scope just delete this line',
      }
    });
    
    return this.httpClient.post(this.baseUrl + "/login", body, options);
  }

  signin(utilisateur : any) {
    let options : any = this.getOptions();
    console.log(options);
    const body = new HttpParams()
    .set('nom', utilisateur.nom)
    .set('prenom', utilisateur.prenom)
    .set('identifiant', utilisateur.identifiant)
    .set('mdp', utilisateur.mdp);
    return this.httpClient.post(this.baseUrl + "/insert_utilisateur", body.toString(),options);
  }
  

  getAllUser() {
    let options : any = this.getOptions();
    let body = new FormData();
    return this.httpClient.post(this.baseUrl+"/get_all_utilisateur" ,  body, options);
  }
}
