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

  login(utilisateur:any) {
  let options : any = this.getOptions();
    
    const body = new HttpParams()
    .set('identifiant', utilisateur.identifiant)
    .set('mdp', utilisateur.mdp);

    console.log(body.toString());
    return this.httpClient.post(this.baseUrl + "/login", body.toString(), options);
  }

  signin(utilisateur : any) {
    let options : any = this.getOptions();
    console.log(utilisateur._poste_utilisateur);
    const body = new HttpParams()
    .set('nom', utilisateur._nom_utilisateur)
    .set('prenom', utilisateur._prenom_utilisateur)
    .set('mail',utilisateur._adresse_email)
    .set('poste',JSON.stringify(utilisateur._poste_utilisateur))
    .set('identifiant', utilisateur._pseudo_utilisateur)
    .set('mdp', utilisateur._mot_de_passe)
    .set('validation', '0');
    return this.httpClient.post(this.baseUrl + "/insert_utilisateur", body.toString(),options);
  }
  

  getAllUser() {
    let options : any = this.getOptions();
    let body = new FormData();
    return this.httpClient.post(this.baseUrl+"/get_all_utllisateur" ,  body, options);
  }

  getAllPoste() {
    let options : any = this.getOptions();
    return this.httpClient.get(this.baseUrl+"/get_all_poste" , options);
  }

  deconnexion() {
    let options : any = this.getOptions();
    return this.httpClient.get(this.baseUrl+"/deconnexion" , options);
  }
}
