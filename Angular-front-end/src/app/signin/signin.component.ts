import { Component, OnInit } from '@angular/core';
import { UtilisateurService } from '../service/utilisateur.service';
import { Utilisateur } from '../model/utilisateur/utilisateur';
import { image } from '../../environments/environment';
import {PopupService} from '../service/popup.service';
import { ComponentService } from '../service/component.service';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.css']
})
export class SigninComponent implements OnInit {
  logo_proprietaire = image.logo_proprietaire;
  image_login = image.image_login;
  utilisateur : any = new Utilisateur();
  popup_service = new PopupService();
  nom_utilisateur : string="" ;
  prenom_utilisateur : string="";
  adresse_email:string="";
  poste_utilisateur:any;
  prestataire_utilisateur:string ="";
  pseudo_utilisateur : string="";
  mot_de_passe : string="";
  confirmation_mot_de_passe : string="" ;

  tableau_de_poste : any = [];
  constructor(private utilisateurService: UtilisateurService , private componentService : ComponentService) { }

  ngOnInit(): void {
    this.componentService.show_loader();
    this.avoir_tout_les_poste();
  }

  gerer_erreur_utilisateur() {
    try {
        this.reinitialiser_erreur();
        this.utilisateur.nom_utilisateur = this.nom_utilisateur;
        this.utilisateur.prenom_utilisateur = this.prenom_utilisateur;
        this.utilisateur.adresse_email = this.adresse_email;
        this.utilisateur.poste_utilisateur = this.poste_utilisateur;
        this.utilisateur.pseudo_utilisateur = this.pseudo_utilisateur;
        this.utilisateur.mot_de_passe = this.mot_de_passe;
        this.utilisateur.confirmation_mot_de_passe = this.confirmation_mot_de_passe;
        return true;
    } catch(err : any) {
      console.log(err);
      this.utilisateur.setError(err);
      this.utilisateur.setError_signin(err);
      document.getElementById(err.idChamp)
      return false;
    }

  }
  s_inscrire() {
    console.log(this.gerer_erreur_utilisateur());
    if(this.gerer_erreur_utilisateur()) {
      this.utilisateurService.signin(this.utilisateur).subscribe((data:any)=> {
        switch(data.metadata.code) {
          case 200 :  {
            this.reinitialiser_champ();
            this.reinitialiser_erreur();
            this.popup_service.showSuccess("Inscription effectuer avec succès");
            break;
          }
          case 500 : {
            this.popup_service.showError(data.errorMessage);
            break;
          }
        }
        
      });
    }
    
  }

  avoir_tout_les_poste() {
    this.utilisateurService.getAllPoste().subscribe(async (data:any)=> {
        switch (data.metadata.code) {
          case 200 : {
            console.log(data.data);
            this.tableau_de_poste = data.data;
            this.componentService.hide_loader();
            break;
          }
          case 500 :{
            break;
          }
        }
    })
  }

  change(data) {
    this.poste_utilisateur = data;
  }

  verifierChamp(event : any) {
    let id : string = event.target.id;
    try{
      this.utilisateur[id] = event.target.value;
      this.utilisateur.removeError(id);
      this.utilisateur.removeError_signin(id);
    }
    catch(err) {
      this.utilisateur.setError(err);
      this.utilisateur.setError_signin(err);
    }
  }

  reinitialiser_erreur() {
      this.utilisateur.removeError("nom_utilisateur");
      this.utilisateur.removeError_signin("nom_utilisateur");

      this.utilisateur.removeError("prenom_utilisateur");
      this.utilisateur.removeError_signin("prenom_utilisateur");

      this.utilisateur.removeError("adresse_email");
      this.utilisateur.removeError_signin("adresse_email");

      this.utilisateur.removeError("poste_utilisateur");
      this.utilisateur.removeError_signin("poste_utilisateur");

      this.utilisateur.removeError("prestataire_utilisateur");
      this.utilisateur.removeError_signin("prestataire_utilisateur");

      this.utilisateur.removeError("pseudo_utilisateur");
      this.utilisateur.removeError_signin("pseudo_utilisateur");

      this.utilisateur.removeError("mot_de_passe");
      this.utilisateur.removeError_signin("mot_de_passe");

      this.utilisateur.removeError("confirmation_mot_de_passe");
      this.utilisateur.removeError_signin("confirmation_mot_de_passe");

  }

  reinitialiser_champ() {
    this.nom_utilisateur ="" ;
    this.prenom_utilisateur ="";
    this.adresse_email ="";
    this.poste_utilisateur = "";
    this.prestataire_utilisateur ="";
    this.pseudo_utilisateur ="";
    this.mot_de_passe  ="";
    this.confirmation_mot_de_passe="" ;

  }

}
