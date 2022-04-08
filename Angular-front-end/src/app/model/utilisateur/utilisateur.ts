import { FormError } from "../error/form-error";

export class Utilisateur {
    private _nom_utilisateur : string = "";
    private _prenom_utilisateur : string = "";
    private _adresse_email : string = "";
    private _pseudo_utilisateur : string = "";
    private _mot_de_passe : string = "";
    private _confirmation_mot_de_passe : string = "";
    private _poste_utilisateur : string = "";
    private _validation_utilisateur : string = "";


    public set nom_utilisateur(nom : string)
    {
        if(nom.localeCompare("")==0) {
            throw new FormError("renseigner ce champ" , 501 , "nom_utilisateur");
        }
        this._nom_utilisateur = nom;
    }
    public get nom(){
        return this._nom_utilisateur;
    }


    public set prenom_utilisateur(prenom : string){
        if(prenom.localeCompare("")==0) {
            throw new FormError("renseigner ce champ" , 502 , "prenom_utilisateur");
        }
        this._prenom_utilisateur = prenom;
    }
    public get prenom(){
        return this._prenom_utilisateur;
    }

    public set adresse_email(adresseMail : string){
        if(adresseMail.localeCompare("")==0) {
            throw new FormError("renseigner ce champ" , 503 , "adresse_email");
        }
        if (!this.checkEmail(adresseMail)) {
            throw new FormError("Adresse e-mail non valide" , 503 , "adresse_email");
        }
        this._adresse_email = adresseMail;
    }
    public get adresseMail(){
        return this._adresse_email;
    }

    public set pseudo_utilisateur(pseudo : string){
        if(pseudo.localeCompare("")==0) {
            throw new FormError("renseigner ce champ" , 504 , "pseudo_utilisateur");
        }
        this._pseudo_utilisateur = pseudo;
    }
    public get pseudo(){
        return this._pseudo_utilisateur;
    }

    public set mot_de_passe_signin(password : string){
        if(password.localeCompare("")==0) {
            throw new FormError("renseigner ce champ" , 505 , "mot_de_passe_signin");
        }
        if(password.length<8) {
            throw new FormError("Votre mot de passe doit comprendre plus de 8 caractere" , 505 , "mot_de_passe_signin");
        }
        this._mot_de_passe = password;
    }
    public set mot_de_passe(password : string){
        if(password.localeCompare("")==0) {
            throw new FormError("renseigner ce champ" , 505 , "mot_de_passe");
        }
        this._mot_de_passe = password;
    }
    public get password(){
        return this._mot_de_passe;
    }


    public set confirmation_mot_de_passe(confirmationMdp : string){
        if(this.password != confirmationMdp){
            throw new FormError("Les mots de passe ne sont pas cohérents" , 506 , "confirmation_mot_de_passe");
        }
        this._confirmation_mot_de_passe = confirmationMdp;
    }
    public get confirmationMdp(){
        return this._confirmation_mot_de_passe;
    }

    public set poste_utilisateur(posteUtilisateur : string){
        if(JSON.stringify(posteUtilisateur).localeCompare("")==0) {
            throw new FormError("renseigner ce champ" , 505 , "poste_utiiisateur");
        }
        this._poste_utilisateur = posteUtilisateur;
    }
    public get poste_utilisateur(){
        return this._poste_utilisateur;
    }

    public set validation_utilisateur(idstatut_utilisateur : string){
        this._validation_utilisateur = idstatut_utilisateur;
    }
    public get idstatut_utilisateur(){
        return this._validation_utilisateur;
    }

    public setError(err : FormError) {
        var doc = document.getElementById("erreur_"+err.idChamp) ;
        if(doc!=null) { doc.innerHTML = "<a>"+err.message+"</a>"; } 
    }
    
    public setError_signin(err : FormError) {
        var doc = document.getElementById(err.idChamp) ;
        if(doc!=null) doc.classList.add("erreur-input-signin");

        
    }

    public set_error_login(err : FormError) {
        var doc = document.getElementById(err.idChamp) ;
        if(doc!=null) doc.classList.add("erreur-input-login");
    }


    public removeError(id : string) {
        var doc = document.getElementById("erreur_"+id);
        if(doc!=null) { doc.innerHTML = "";} 
    }

    public removeError_signin(id : string) {
        var doc = document.getElementById(id) ;
        doc?.classList.remove("erreur-input-signin");
    }
    
    checkEmail(email : any) {
        var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(email);
    }

    
}
