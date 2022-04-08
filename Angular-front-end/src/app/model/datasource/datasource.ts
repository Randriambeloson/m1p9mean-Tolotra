import { ThrowStmt } from "@angular/compiler";
import { FormError } from "../error/form-error";
import { AmabisService } from "src/app/service/AMABIS/amabis.service";
import { AcceuilComponent } from "src/app/acceuil/acceuil.component";
import { trim } from "jquery";
import { DatePipe } from "@angular/common";

export class Datasource {
    private _id_datasource:any = null; 
    private _id_source:any=null;                                                                                        
    private _id_etape : any =null;                                                                               
    private _id_employe:any=null;          
    private _num_lot:any=null;          
    private _num_dans_lot:any=null;         
    private _date_saisie:any=this.reformat_date_saisie(new Date());           
    private _code_prestataire:any="DACO";         
    private _num_carte:any=null;            
    private _num_temp_carte:any=null;           
    private _num_remp_carte:any=null;           
    private _num_ratt_carte : any =null;           
    private _num_chgt_addr : any =null;            
    private _code_magasin : any =null;                 
    private _initiales_vend : any =null;           
    private _date_creation : any =null;            
    private _mail : any =null;         
    private _mobile : any =null;           
    private _civilite : any =null;         
    private _nom_client : any =null;          
    private _prenom_client : any =null;           
    private _date_naissance : any =null;           
    private _adresse1 : any =null;         
    private _adresse2 : any =null;         
    private _adresse3 : any =null;         
    private _adresse3_num : any ="";         
    private _adresse3_type: any="";            
    private _adresse3_libelle : any ="";         
    private _adresse4 : any =null;         
    private _cp : any =null;                   
    private _ville : any =null;                
    private _pays : any =null;                 
    private _code_rnvp : any =null;                
    private _logement : any ="0";                 
    private _statut_occupation: any="0";            
    private _habitat : any ="0";                  
    public  _accessoire_logement : String = "0";             
    private _animal: String = "0";                       
    private _date_install :any =null;                     
    private _mois_install :any =null;                         
    private _annee_install:any=null;                        
    private _venue : String = "0";                       
    private _niveau : String = "0";                          
    private _pourquoi : String = "0";                        
    private _optin_email:any="1";                              
    private _optin_sms:any="1";                                
    private _optin_courrier:any="1";                           
    private _signature_client:any="0";                          
    private _version_quest:any="Q-WEL-v9";   
    private _nom_image:any = null;                     
    private tab_error : any =[];               
    private tab_dont_check : any =[];                                   
    public statut_rnvp : any = [];                                                  
    
    constructor(private amabis_service:AmabisService , public datasource : any = null){
        this.set_statut_rnvp();
        if(this.datasource!=null) {
            this.id_datasource = this.datasource[0].id_data_source;
            this.id_source = this.datasource[0].id_source;
            this.id_etape = parseInt(this.datasource[0].id_etape) + 1;
            this.datasource[0].id_etape = parseInt(this.datasource[0].id_etape) + 1;
            this.id_employe = this.datasource[0].id_utilisateur;
            this.num_lot = this.datasource[0].num_lot;
            this.num_dans_lot = this.datasource[0].num_dans_lot;
            this.date_saisie = this.reformat_date_saisie(new Date()); 
            this.num_carte = this.datasource[0].num_carte;
            this.num_remp_carte = this.datasource[0].num_remp_carte;
            this.num_ratt_carte = this.datasource[0].num_ratt_carte;
            this.code_magasin = this.datasource[0].code_magasin;
            this.initiales_vend = this.datasource[0].initiales_vend;
            this.date_creation = this.datasource[0].date_creation;
            this.mail = this.datasource[0].mail;
            this.mobile = this.datasource[0].mobile;
            this.civilite = this.datasource[0].civilite;
            this.nom_client = this.datasource[0].nom_client;
            this.prenom_client = this.datasource[0].prenom_client;
            this.date_naissance = this.datasource[0].date_naissance;
            this.adresse1 = this.datasource[0].adresse1;
            this.adresse2 = this.datasource[0].adresse2;
            this.adresse3_num = this.datasource[0].adresse3_num
            this.adresse3_type = this.datasource[0].adresse3_type;
            this.adresse3_libelle = this.datasource[0].adresse3_libelle;
            this.get_adresse3();
            this.adresse4 = this.datasource[0].adresse4;
            this.cp = this.datasource[0].cp;
            this.ville = this.datasource[0].ville;
            this.pays = this.datasource[0].pays;
            this.code_rnvp = this.datasource[0].code_rnvp;
            this.logement = this.datasource[0].logement;
            this.statut_occupation = this.datasource[0].statut_occupation;
            this.habitat = this.datasource[0].habitat;
            this.accessoire_logement = this.datasource[0].accessoires_logement;
            this.animal = this.datasource[0].animal;
            if((this.datasource[0].mois_install != null && this.datasource[0].mois_install!=0) || (this.datasource[0].annee_install!=null && this.datasource[0].annee_install!=0)) {
                this.date_install = this.datasource[0].mois_install +"/"+this.datasource[0].annee_install ;
            }
            this.mois_install = this.datasource[0].mois_install;
            this.venue = this.datasource[0].venue;
            this.niveau = this.datasource[0].niveau;
            this.pourquoi = this.datasource[0].pourquoi;
            this.optin_email = this.datasource[0].optin_email;
            this.optin_sms = this.datasource[0].optin_sms;
            this.optin_courrier = this.datasource[0].optin_courrier;
            this.signature_client = this.datasource[0].signature_client;
            this.version_quest = this.datasource[0].version_quest;
            this.nom_image = this.datasource[0].path_image; 
        }
    }; 
    

    public set_statut_rnvp() {
        this.statut_rnvp[0] = [];
        this.statut_rnvp[0][0] = "OKIO" ;
        this.statut_rnvp[0][1] = "OKIOR";
        this.statut_rnvp[0][2] = "OKIXG";
        this.statut_rnvp[0][3] = "OKIBA";
        this.statut_rnvp[0][4] = "AVIN3";
        this.statut_rnvp[0][5] = "AVIV3";
        this.statut_rnvp[0][6] = "AVIW3";

        this.statut_rnvp[1] = [];
        this.statut_rnvp[1][0] = "OKMO" ;
        this.statut_rnvp[1][1] = "OKMOR";
        this.statut_rnvp[1][2] = "OKMXG";
        this.statut_rnvp[1][3] = "OKMBA";
        this.statut_rnvp[1][4] = "AVMN3";
        this.statut_rnvp[1][5] = "AVMV3";
        this.statut_rnvp[1][6] = "AVMW3";

        this.statut_rnvp[2] = [];
        this.statut_rnvp[2][0] = "OKMCI" ;
        this.statut_rnvp[2][1] = "OKMCM";
        this.statut_rnvp[2][2] = "AVIN9";
        this.statut_rnvp[2][3] = "AVMN9";
        this.statut_rnvp[2][4] = "AVIV9";
        this.statut_rnvp[2][5] = "AVMV9";
        this.statut_rnvp[2][6] = "AVIW9";
        this.statut_rnvp[2][7] = "AVMW9";

        this.statut_rnvp[3] = [];
        this.statut_rnvp[3][0] = "AVIN1" ;
        this.statut_rnvp[3][1] = "AVMN1";
        this.statut_rnvp[3][2] = "AVIN2";
        this.statut_rnvp[3][3] = "AVMN2";
        this.statut_rnvp[3][4] = "AVIV2";
        this.statut_rnvp[3][5] = "AVMV2";
        this.statut_rnvp[3][6] = "AVIW1";
        this.statut_rnvp[3][7] = "AVMW2";
        this.statut_rnvp[3][8] = "AVISC";
        this.statut_rnvp[3][9] = "AVMSC";
        this.statut_rnvp[3][10] = "AVIBA";
        this.statut_rnvp[3][11] = "AVMBA";
        this.statut_rnvp[3][12] = "RE G";

        this.statut_rnvp[4] = [];
        this.statut_rnvp[4][0] = "OK HR" ;
    }
    


    public set id_datasource(id) {
        this._id_datasource = id;
    }
    public get id_datasource() {
        return this._id_datasource;
    }

    public set id_source(id) {
        this._id_source = id;
    }
    public get id_source() {
        return this._id_source;
    }

    public set id_employe(id) {
        this._id_employe = id;
    }
    public get id_employe() {
        return this._id_employe;
    }
    public set id_etape(args) {
        this._id_etape = args;
    }
    public get id_etape() {
        return this._id_etape;
    }

    public set num_lot(numero) {
        this._num_lot = numero;
    }
    public get num_lot() {
        return this._num_lot;
    }

    public set num_dans_lot(num) {
        this._num_dans_lot = num;
    }
    public get num_dans_lot() {
        return this._num_dans_lot;
    }

    public set date_saisie(date : any)  {

        this._date_saisie = date;
    }
    public get date_saisie() {
        return this._date_saisie;
    }

    public set code_prestataire(code) {
        this._code_prestataire = code;
    }
    public get code_prestataire() {
        return this._code_prestataire;
    }

    public set num_carte(num : any) {
        try {
            if(new String(num).toString().includes("$")) {
                this.num_carte = "<?>";
            }
            else {
                if(num!="<?>" && num!=null && num!=undefined && num!="") {      
                    var check : any = this.check_code_barre_ean13(num);
                    if(isNaN(num) && num!=null && num!=undefined) {
                        throw new FormError("Chiffres uniquement" , 500 , "num_carte")
                    }
                    else if(num.length!=13) {
                        throw new FormError("Numero carte doit etre 13 chifres" , 500 , "num_carte");
                    }
                    else if(!check["statut"]) {
                        throw new FormError("numero incorrecte . Suggestion : "+check["check_number"] , 500 , "num_carte") ;
                    }
                    
                }
                this._num_carte = num;
            }
            
            this.remove_Error("num_carte");
            delete this.tab_error["num_carte"];
        }
        catch(err) {
            this.set_Error(err);
            this.tab_error["num_carte"] = err;
        }   
        
    }
    public get num_carte() {
        return this._num_carte;
    }  
    public set num_remp_carte(args : any) {
        try{
            if(new String(args).toString().includes("$")) {
                this.num_remp_carte = "<?>";
            }
            else {
                if(new String(args).toString().localeCompare("true")==0) {
                    if(args==true || args == false) {
                        args = !args
                    }
                    else {
                        args=null;
                    }
                }
                else if(args!="<?>") {
                    if(args!=null && args!=undefined && args!="") {
                        var check : any = this.check_code_barre_ean13(args);
                        if(isNaN(args) && args!=null && args!=undefined) {
                            throw new FormError("Chiffres uniquement" , 500 , "num_remp_carte")
                        }
                        else if(args.length!=13 && args.length!=0 && args!=null && args!=undefined) {
                            throw new FormError("Numero carte doit avoir 13 chiffres exactement" , 500 , "num_remp_carte");
                        }
                        
                        else if(!check["statut"] && args.length!=0 && args!=null && args!=undefined ) {
                            throw new FormError("Numero incorrecte . Suggestion : "+check["check_number"] , 500 , "num_remp_carte") ;
                        }
                    }
                }
                this._num_remp_carte = args;
                this.remove_Error("num_remp_carte");
                delete this.tab_error["num_remp_carte"];
            }
        }
        catch(err) {
            this.set_Error(err);
            this.tab_error["num_remp_carte"] = err;
        }
        
        
    }
    public get num_remp_carte() {
        return this._num_remp_carte;
    }
    public set num_temp_carte(args : any) {
        try{
            if(new String(args).toString().includes("$")) {
                this._num_temp_carte = "<?>" 
            }
            else {
                if(args!="<?>") {
                    var check : any = this.check_code_barre_ean13(args);
                    if(isNaN(args) && args!=null && args!=undefined) {
                        throw new FormError("Numero carte n'accepte strictement que des chiffres" , 500 , "num_temp_carte")
                    }
                    else if(args.length!=13 && args.length!=0 && args!=null && args!=undefined) {
                        throw new FormError("Numero carte doit avoir exactement 13 chiffres" , 500 , "num_temp_carte");
                    }
                    
                    else if(!check["statut"] && args.length!=0  && args!=null && args!=undefined) {
                        throw new FormError("Numero incorrecte . Suggestion : "+check["check_number"] , 500 , "num_temp_carte") ;
                    }
                }
                
                this._num_temp_carte = args;
                this.remove_Error("num_temp_carte");
                if(this._num_ratt_carte != false && this._num_ratt_carte != null) {
                    if(this._num_temp_carte!=null) {
                        this._num_ratt_carte = this._num_temp_carte;
                    }
                    else {
                        this._num_ratt_carte = null;
                    }
                    
                }
                if(this._num_chgt_addr != false && this._num_chgt_addr !=  null ) {
                    if(this._num_temp_carte!=null) {
                        this._num_chgt_addr = this.num_temp_carte;
                    }
                    else {
                        this._num_chgt_addr = null;
                    }
                    
                }
                delete this.tab_error["num_temp_carte"];
            }
            
        }
        catch(err) {
            this.set_Error(err);
            this.tab_error["num_temp_carte"] = err;
        }
    }
    public get num_temp_carte() {
        return this._num_temp_carte;
    }
    public set num_ratt_carte(args) {
        if(new String(args).toString().includes("$")) {
            this.num_ratt_carte = "<?>";
        }
        else {
            if(args) {
                if(this._num_temp_carte != undefined && this._num_temp_carte!=null) {
                    this._num_ratt_carte = this._num_temp_carte;
                }
                else {
                    if(this._num_ratt_carte != new Boolean(args)) {
                        
                        this._num_ratt_carte = true;
                    }
                    else {
                        this._num_ratt_carte = null;
                    }
                    
                }
                
            }
            else {
                this._num_ratt_carte = null;
            }
        }
        
        
    }
    public get num_ratt_carte() {
        return this._num_ratt_carte;
    }
    public set num_chgt_addr(args) {
        if(new String(args).toString().includes("$")){
            this.num_chgt_addr = "<?>";
        }
        else {
            if(args) {
                if(this._num_temp_carte != undefined && this._num_temp_carte!=null) {
                    this._num_chgt_addr = this.num_temp_carte
                }
                else {
                    if(this._num_chgt_addr != new Boolean(args)) {
                        
                        this._num_chgt_addr = true;
                    }
                    else {
                        this._num_chgt_addr = null;
                    }
                }
                
            }
            else {
                this._num_chgt_addr = "NULL";
            }
        }
        
        
    }
    public get num_chgt_addr() {
        return this._num_chgt_addr;
    }
    public set code_magasin(code) {
        try{
            
            if(new String(code).toString().includes("$")) {
                this.code_magasin = "<?>"
            }
            else{
                if(code!="<?>" && code!=null && code!=undefined && code!="") {
                    if(code.length>6)  {
                        for(var i=0 ; i<code.length-6 ; i++) {
                            if(code[0]=="0") {
                                code = code.substring(1);
                            }
                        }
                    }
                    else {
                        code = code.padStart(6 , "0");
                    }
                    if(code.length==6) {
                        if(isNaN(code) && code!=null && code!=undefined && code!="") {
                            throw new FormError(this.addslashes("Format incorecte , mettre &lt;?&gt; si illisible") , 500 , "code_magasin");
                        }
                        this._code_magasin = code;
                        this.remove_Error("code_magasin");
                        
                    } else {
                        throw new FormError(this.addslashes("Format incorecte , mettre &lt;?&gt; si illisible") , 500 , "code_magasin");
                    }
                } else {
                    
                    this.remove_Error("code_magasin");
                    delete this.tab_error["code_magasin"];
                }
            }
                
                
        }
        catch(err) {
            this.set_Error(err);
            this.tab_error["code_magasin"] = err;
        }
        
    }
    public get code_magasin() {
        return this._code_magasin;
    }
    public set initiales_vend(initiale) {
        try {
            if(new String(initiale).toString().includes("$")) {
                this.initiales_vend = "<?>";
            }
            else {
                if( (initiale!=null && initiale!=undefined && initiale != "" && initiale!="<?>" && initiale.length>3) ) {
                    throw new FormError("Format incorrecte , mettre &lt;?&gt; si illisible" , 500 , "initiales_vend");

                }
                else {
                    if(initiale!=null) {
                        this._initiales_vend = initiale.toUpperCase();
                    }
                    this.remove_Error("initiales_vend");
                    delete this.tab_error["initiales_vend"];
                }
            }
                
                
            
        }
        catch (err) {
            this.set_Error(err);
            this.tab_error["initiales_vend"] = err;
        }
        
        
    }
    public get initiales_vend() {
        return this._initiales_vend;
    }
    public  reformat_date_saisie(today : any) {
        var dd = today.getDate();
        var mm = today.getMonth() + 1;
  
        var yyyy = today.getFullYear();
        if (dd < 10) {
            dd = '0' + dd;
        }
        if (mm < 10) {
            mm = '0' + mm;
        }
        var format = dd + '/' + mm + '/' + yyyy;
        return format;
    }
    public reformat_date(date :any , id : any) {
        var datetab =[];
        if(date!="" && date!="<?>" && date!=null) {
            datetab = date.split("/");
            if(datetab.length!=3 ){
                if(datetab.length!=1) {
                    throw new FormError("Format incorrecte" , 500 , id);
                }
                else {
                    if(date.length==8) {
                        date = date[0]+date[1]+"/"+date[2]+date[3]+"/"+date.substring(4,8);
                        this.reformat_date(date,id);
                        return date;  
                    }
                    else {
                        throw new FormError("Format incorrecte , mettre &lt;?&gt;" , 500 , id);
                    }
                } 
            } 
            else {
                try{
                    if(datetab[0].length!=0 && !isNaN(datetab[0]) && datetab[1].length!=0 && !isNaN(datetab[1]) && datetab[2].length==4 && !isNaN(datetab[2])){
                        if(datetab[0].length==1) {
                            datetab[0] = "0"+datetab[0];
                        }
                        if(datetab[1].length==1) {
                            datetab[1] = "0"+datetab[1];
                        }
                        date=datetab[0]+"/"+datetab[1]+"/"+datetab[2];
                        return date;
                    }
                    else {
                         throw new FormError("Format incorrecte" , 500 , id);
                    }
                    
                }
                catch(err){
                    throw new FormError("Format incorrecte" , 500 , id);
                }   
            }
        }
        else {
            if(date=="") {
                date = null;
            }
            return date;
            
        }
        
    }
    public set date_creation(date) {
        try{
            if(new String(date).toString().includes("$")) {
                this.date_creation = "<?>";
            }
            else {
                if(date!="<?>") {
                    this._date_creation = this.reformat_date(date , "date_creation");
                    if(date!= null && date!="" && (parseInt(date.substring(date.length-4 , date.length)) > new Date().getFullYear()  || parseInt(date.substring(date.length-4 , date.length)) < new Date().getFullYear()-2 )) {
                        throw new FormError("Année invalide , doit etre compris entre "+(new Date().getFullYear()-2)+" - "+(new Date().getFullYear()) , 500 , "date_creation");
                    }
                    this.remove_Error("date_creation");
                    delete this.tab_error["date_creation"];
                }
                else {
                    this._date_creation = date;
                    this.remove_Error("date_creation");
                    delete this.tab_error["date_creation"];
                }
            }
        }
        catch(err) {
            this.set_Error(err);
            this.tab_error["date_creation"] = err;
        }
    }
    public get date_creation() {
        return this._date_creation;
    }
    public set mail(mail) {
        try{
            if(new String(mail).toString().includes("$")) {
                this.mail = "<?>";
            }
            else {
                if(mail != "<?>" && mail != "" && mail!=null && mail!=undefined) {
                    if(!this.validate_email(mail) && mail!=null && mail != undefined && mail != "") {
                        throw new FormError("email non valide" , 500 , "mail");
                    }
                    this._mail = mail.toLowerCase();
                    this.remove_Error("mail");
                    delete this.tab_error["mail"];
                }
                else {
                    if(mail!=null) {
                        this._mail = mail;
                    }
                    this.remove_Error("mail");
                    delete this.tab_error["mail"];
                }
            }
            
        }
        catch(err) {
            this.set_Error(err); 
            this.tab_error["mail"] = err;
        }

    }
    public get mail() {
        return this._mail;
    }
    public set mobile(numero) {
        try {
            if(new String(numero).toString().includes("$")) {
                this.mobile = "<?>";
            }
            else {
                if(numero!=null && numero != undefined && numero!="" && numero != "<?>") {
                    if(isNaN(numero) ){
                        throw new FormError("chiffre uniquement" , 500 , "mobile")
                    }
                    else if(numero.length>16){
                        throw new FormError("16 chiffres maximum" , 500 , "mobile")
                    }
                }
                if(numero=="") {
                    this._mobile = null;
                }
                
                this._mobile = numero;
                this.remove_Error("mobile");
                delete this.tab_error["mobile"];
            }
            
            
        }
        catch(err) {
            this.set_Error(err);
            this.tab_error["mobile"] = err;
        }
        
    }
    public get mobile() {
        return this._mobile;
    }
    public set civilite(civilite) {
        try{
            if(civilite==this._civilite){
                this._civilite = 0
            }
            else {
                this._civilite = civilite;
            }
            this.remove_Error("civilite");
            delete this.tab_error["civilite"];
            
        }
        catch(err) {
            this.set_Error("civilite");
            this.tab_error["civilite"] = err;
        }
    }
    public get civilite() {
        return this._civilite;
    }
    public set nom_client(args) {
        try{
            if(new String(args).toString().includes("$")) {
                this.nom_client = "<?>"
            }
            else {
                if(args!=undefined && args!=null && args!="") {
                    this._nom_client = args.toUpperCase();
                }
                this.remove_Error("nom_client");
                delete this.tab_error["nom_client"] ;
            }
            
        }
        catch(err) {
            this.set_Error("nom_client");
            this.tab_error["nom_client"] = err;
        }
        
    }
    public get nom_client() {
        return this._nom_client;
    }
    public set prenom_client(args) {
        try{
            if(new String(args).toString().includes("$")) {
                this.prenom_client = "<?>"
            }
            else {
                if(args!=null) {
                    this._prenom_client = args.toUpperCase();
                    this.remove_Error("prenom_client");
                    delete this.tab_error["prenom_client"];
                }
            }
            
        }
        catch(err) {
            this.set_Error("prenom_client");
            this.tab_error["prenom_client"] = err;
        }
    }
    public get prenom_client() {
        return this._prenom_client;
    }
    public set date_naissance(date) {
        try{
            if(new String(date).toString().includes("$")) {
                this.date_naissance = "<?>";
            }
            else {
                if(date!="<?>" && date!=null && date!=undefined) {
                    this._date_naissance = this.reformat_date(date , "date_naissance");
                    if(date!= null && date!="" && (new Date().getFullYear()-18 < parseInt(date.substring(date.length-4 , date.length)) || parseInt(date.substring(date.length-4 , date.length)) < new Date().getFullYear()-120) ) {
                        throw new FormError("Année invalide , doit etre compris entre "+(new Date().getFullYear()-120)+" - "+(new Date().getFullYear()-18) , 500 , "date_naissance");
                    }
                    this.remove_Error("date_naissance");
                    delete this.tab_error["date_naissance"]
                }
                else {
                    this._date_naissance = date;
                    this.remove_Error("date_naissance");
                    delete this.tab_error["date_naissance"];
                }
            }
            
            
        }
        catch(err) {
            this.set_Error(err);
            this.tab_error["date_naissance"] = err;
        }

    }
    public get date_naissance() {
        return this._date_naissance;
    }
    public set adresse1(args) {
        if(new String(args).toString().includes("$")) {
            this.adresse1 = "<?>"
        }
        else {
            this._adresse1 = args;
            this.remove_Error("adresse1");
        }
        
    }
    public get adresse1() {
        return this._adresse1;
    }
    public set adresse2(args) {
        if(new String(args).toString().includes("$")) {
            this.adresse2 = "<?>"
        }
        else {
            this._adresse2 = args;
            this.remove_Error("adresse1");
        }
    }
    public get adresse2() {
        return this._adresse2;
    }
    public set adresse3(args) {
        args = args.replace("'" , " ");
        if(new String(args).toString().includes("$")) {
            this._adresse3="<?>";
            this._adresse3_libelle = "<?>";
        }
        else {
            if(args!=null){
                this.adresse3_libelle="";
                let adresse3 = args.toUpperCase().split(" ");
                if(adresse3.length>0) {
                    this.adresse3_type = adresse3[0]; 
                    for(var i =1 ; i<adresse3.length ; i++) {
                        this.adresse3_libelle = this.adresse3_libelle.toUpperCase() +" "+ adresse3[i];
                    }
                }
                this._adresse3 = args.toUpperCase();
                this.remove_Error("adresse3")
            }
        }
        
        
        
    }
    public get adresse3() {
        return this._adresse3;
    }
    public set adresse3_num(args) {
        if(args!=null) {
            if(new String(args).toString().includes("$")) {
                this._adresse3_num = "<?>";
            }
            else {
                this._adresse3_num = args.trim();
            }
            this.remove_Error("adresse3_num");
        }
        
    }

    public get adresse3_num() {
        return this._adresse3_num;
    }
    public get_adresse3() {
        if(this.adresse3_type!=null && this.adresse3_type!=undefined) {
            this._adresse3 = this._adresse3_type;
        }
        if(this.adresse3_libelle!=null && this._adresse3_libelle!=undefined) {
            this._adresse3 = this.adresse3 + " " + this.adresse3_libelle;
        }
        
    }
    public set adresse3_type(args) {
        try{
            if(args!=null) {
                this._adresse3_type = args;
                this.remove_Error("adresse3_type")
            }   
        }
        catch (err) {
            console.log(err);
        }
        
    }
    public get adresse3_type() {
        return this._adresse3_type;
    }
    public set adresse3_libelle(args) {
        this._adresse3_libelle = args;
        this.remove_Error("adresse3_libelle")
    }
    public get adresse3_libelle() {
        return this._adresse3_libelle;
    }
    public set adresse4(args) {
        if(new String(args).toString().includes("$")) {
            this._adresse4 = "<?>";
        }
        else {
            this._adresse4 = args;
        }
        
        this.remove_Error("adresse4")
    }
    public get adresse4() {
        return this._adresse4;
    }
    public set cp(args) {
        if(new String(args).toString().includes('$')) {
            this._cp = "<?>";
        }
        else {
            this._cp = args;
        }
        
        this.remove_Error("cp");
    }
    public get cp() {
        return this._cp;
    }
    public set ville(args) {
        if(new String(args).toString().includes('$')) {
            this._ville = "<?>";
        }
        else {
            if(args!=null) {
                this._ville = args.toUpperCase();
            }
        }
        
        this.remove_Error("ville");
    }
    public get ville() {
        return this._ville;
    }
    public set pays(args) {
        if(new String(args).toString().includes('$')) {
            this._pays="<?>";
        }
        else {
            if(args==""){
                this._pays = null
            }
            else if(args=="FRANCE") {
                this.pays = null;
            }
            else {
                this._pays = args;
            }
        }
        
        this.remove_Error("pays");
    }
    public get pays() {
        return this._pays;
    }
    public set code_rnvp(args) {
        try{
            if(args==null || args==undefined || args=="") {
                this._code_rnvp = null;
                throw new FormError("Champ obligatoire" , 500 , "code_rnvp");
            }
            else if(isNaN(args)){
                for(var i=0 ; i<this.statut_rnvp.length ; i++) {
                    for(var j=0 ; j<this.statut_rnvp[i].length ; j++) {
                        if(args.trim().toUpperCase().localeCompare(this.statut_rnvp[i][j].trim().toUpperCase())==0) {
                            this._code_rnvp = i;
                        }
                    }
                }
            }
            else{
                this._code_rnvp = args;
            }
            this.remove_Error("code_rnvp");
            delete this.tab_error["code_rnvp"]
        } catch(err) {
            this.set_Error(err);
            this.tab_error["code_rnvp"]=err;
        }
        
    }
    public get code_rnvp() {
        return this._code_rnvp;
    }
    public set logement(args) {
        if(this._logement!=args) {
            this._logement = args;
        }
        else {
            this._logement = "0";
        }
        
    }
    public get logement() {
        return this._logement;
    }
    public set statut_occupation(args) {
        try{
            if(args==this._statut_occupation){
                this._statut_occupation=0;
            }
            else{
                this._statut_occupation = args;
            }
            this.remove_Error("statut_occupation");
            delete this.tab_error["statut_occupation"]
        }
        catch(err){
            throw err;
        }
    }
    public get statut_occupation() {
        return this._statut_occupation;
    }
    public set habitat(args) {
        if(this._habitat != args ){
            this._habitat = args;
        }
        else {
            this._habitat = "0";
        }
        
    }
    public get habitat() {
        return this._habitat;
    }
    public set accessoire_logement(args) {

        this._accessoire_logement = this.set_checkbox(this._accessoire_logement , args);
        this._accessoire_logement = this.trie_checkbox(this._accessoire_logement);

        if(this._accessoire_logement=="" || args==null){
            this._accessoire_logement = '0';
        }
       
        
    }
    public get accessoire_logement() {
        return this._accessoire_logement;
    }

    public set animal(args : any) {
        if(args==4) {
            this._animal = args;
        }
        else {
            if(this._animal != "4" || (this._animal=="4" && args=="4")) {
                this._animal = this.set_checkbox(this._animal , args);
                this._animal = this.trie_checkbox(this._animal);
            }
            
        }

        if(this.animal=="" || args==null){
            this._animal = '0';
        }
    }
    public get animal() {
        return this._animal;
    }
    public set date_install(args) {
        try{
            if(new String(args).toString().includes('$')) {
                this._date_install = "<?>";
                this._mois_install = "";  
                this._annee_install = "";
            }
            else {
                let date = this.reformat_date_install(args , "date_install");
                let date_tab = date.split("/");
                if(date_tab[0]>12) {
                    throw new FormError("Format incorrecte" , 500 , "date_install");
                }
                if(date_tab.length==0) {
                    throw new FormError("Format incorrecte" , 500 , "date_install");

                }

                this.mois_install = date_tab[0];
                this.annee_install = date_tab[1];
                this._date_install = date;
            }   
            
            this.remove_Error("date_install");
            delete this.tab_error["date_install"];
        } catch(err) {
            this.set_Error(err);
            this.tab_error["date_install"] = err;
        }
        
    }
    public reformat_date_install(date : any = '' , id : any){
        let date_tab = date.split("/");
        if(date_tab.length!=2) {
            if(date_tab.length==1) {
                if(date.length==6) {
                    date = date[0] + date[1] +"/" + date[2]+date[3]+date[4]+date[5];    
                }
               
            }
            else {
                throw new FormError("date invalide , doit etre de la forme mm/YYYY" , 500 , id)
            }
        } 
        return date;
     }
    
    public get date_install() {
        return this._date_install;
    }
    public set mois_install(args) {
        if(args==0){
            this._mois_install=null;
        }
        else{
            this._mois_install = args;
        }   
        

    }
    public get mois_install() {
        return this._mois_install;
    }
    public set annee_install(args) {
        if(args==0){
            this._annee_install=null;
        }
        else{
            this._annee_install = args;
        }   
        
    }
    public get annee_install() {
        return this._annee_install;
    }
    public set venue(args) {
        
        this._venue = this.set_checkbox(this._venue , args);
        this._venue = this.trie_checkbox(this._venue);
        if(this._venue=="" || args==null){
            this._venue='0';
        }
    }
    public get venue() {
        return this._venue;
    }
    public set niveau(args) {
        if(args!=this._niveau)  {
            this._niveau = args;
        }
        else {
            this._niveau = "0";
        }
        
    }
    public get niveau() {
        return this._niveau;
    }
    public set pourquoi(args) {
        this._pourquoi = this.set_checkbox(this._pourquoi , args);
        this._pourquoi = this.trie_checkbox(this._pourquoi);
        if(this._pourquoi == "" || args==null) {
            this._pourquoi = '0';
        }
    }
    public get pourquoi() {
        return this._pourquoi;
    }
    public set optin_email(args) {
        this._optin_email = args;
    }
    public get optin_email() {
        return this._optin_email;
    }
    public set optin_sms(args) {
        this._optin_sms = args;
    }
    public get optin_sms() {
        return this._optin_sms;
    }
    public set optin_courrier(args) {
        this._optin_courrier = args;
    }
    public get optin_courrier() {
        return this._optin_courrier;
    }
    public set signature_client(args) {
        if(args==this._signature_client){
            this._signature_client=0;
        }
        else{
            this._signature_client = args;
        }
    }
    public get signature_client() {
        return this._signature_client;
    }
    public set nom_image(args) {
        this._nom_image = args;
    }
    public get nom_image() {
        return this._nom_image;
    }
    
    public set version_quest(args) {
        this._version_quest = args;
    }
    public get version_quest() {
        return this._version_quest;
    }

    
    
    public  set_checkbox(attr :any , args :any) {
        var identique = false;
        for(var i=0 ; i<attr.length ; i++) {
            if(attr[i] == args && args!="") {
                attr = attr.replace(args , "");
                identique = true;
            }
        }
        if(!identique) {
                attr += args;

            
        }

        attr =  attr.replace("0" , "");
        if(attr=="" && attr=="null") {
            attr = "0";
        }
        attr = attr.replace("null" , "");
        return attr;
    }

    public trie_checkbox(attr : any){
        var retour :any = [];
        var stringretour = "";
        for (var i=0 ; i<attr.length ; i++) {
            var max = true;
            if(retour.length==0) {
                retour[0] = attr[i];
            }
            else {
                for(var index=0 ; index<retour.length ; index++) {
                    if(new Number(attr[i]).valueOf() < new Number(retour[index]).valueOf()) {
                        retour[index] = attr[i] + retour[index]; 
                        max = false;
                        break;
                    }
                }
                if(max) {
                    retour[index] = attr[i];
                }
            }
            
        }
        for(var i=0 ; i<retour.length ; i++) {
            stringretour += retour[i];
        }
        return stringretour;
    }

    public set_Error(err : any) {
        this.tab_error[err.idChamp]=err;
        document.getElementById(err.idChamp)?.classList.add("error-skinny");
        let element = document.getElementById(err.idChamp+"_error");
        if(element!=null) {
            element.innerHTML = err.message;
            element.hidden = false;
        }
        
    }

    public remove_Error(idChamp : any) {
        delete this.tab_error[idChamp];
        let element = document.getElementById(idChamp+"_error");
        document.getElementById(idChamp)?.classList.remove("error-skinny");
        if(element!=null) element.hidden = true;
        
    }

    public check_code_barre_ean13(codebarre : any) {
        var check_number : number = this.get_check_number_ean13(codebarre);
        var retour : any = [];
        retour["check_number"]=check_number;
        if(check_number == codebarre[12]) {
            retour["statut"]=true;
            return retour;
        }
        else{
            retour["statut"]=false;
            return retour;
        }
    }

    public get_check_number_ean13(codebarre : any) {
        var check_number : number = 0;
        if(codebarre.length!=13) {
            return -1;
        }
        for(var i=0 ; i<12 ; i++) {
            if(i%2==0) {
               check_number = check_number + (parseInt(codebarre[i]) * 1);
            }
            else {
                check_number = check_number + (parseInt(codebarre[i]) * 3);
            }
        }
        check_number = 10 - (check_number%10);
        if(check_number==10) {
            check_number=0;
        }
        return check_number;
    }

    public validate_email(email : string) {
        const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase());
    }

    
    // private test_existance_email(mail : string) {
    //     this.amabis_service.test_courriel(mail).subscribe(async (data:any)=> {
    //         try{
    //                 if(data.result.statut == "MAILBOX_FULL") {
    //                     throw new FormError("adresse exitant mais boite au lettre n'acceptant pas message" , 500 , "mail");
    //                 }
    //                 else if(data.result.statut == "BAD_DOMAIN") {
    //                     throw new FormError("domaine non identifie" , 500 , "mail");
    //                 }
    //                 else if(data.result.statut == "BAD_USERNAME") {
    //                     throw new FormError("email non existant" , 500 , "mail");
    //                 }
    //                 else if(data.result.statut=="BAD_SYNTAX") {
    //                     throw new FormError("Syntaxe incorrecte" , 500 , "mail");
    //                 }
    //                 else if(data.result.statut=="BLACKLISTED") {
    //                     throw new FormError("email black liste" , 500 , "mail");
    //                 }
    //                 else if(data.result.statut=="TRASH_MAIL") {
    //                     throw new FormError("email jetable" , 500 , "mail");
    //                 }
    //                 this.remove_Error("mail");
    //             }
    //             catch(err) {
    //                 this.set_Error(err);
    //             }
    
    //   } , (error)=> {
    //   });
    //   }

    // public ama_mobil_check(numero : number) {
    //     this.amabis_service.ama_mobil_check(numero).subscribe(async(data:any)=> {
    //         try{
    //             if(data.result.status=="KO") {
    //                 throw new FormError("Numero invalide" , 500 , "mobile");
    //             }
    //             else if(data.result.status=="FAILED") {
    //                 throw new FormError("numero non attribuer" , 500 , "mobile");
    //             }
    //             this.remove_Error("mobile");
    //         }
    //         catch(err) {
    //             this.set_Error(err)
    //         }
    //     })
    // }

    public insert_datasource() {
        
    }

    public async check_all_item() {
        try{
                var error_number=0;
                for(var element in this.tab_error) {
                    this.set_Error(this.tab_error[element]);
                    await document.getElementById(this.tab_error[element].idChamp)?.scrollIntoView({behavior: "smooth"});
                    setTimeout(()=> {document.getElementById(this.tab_error[element].idChamp)?.focus()} , 200);        
                    error_number++;
                }
                if(error_number==0) {
                    return true;
                } 
                else {
                 return false;
                }
            }   
        catch(err) {
            return false;
        }
    }

    public addslashes( str : string ) {
        return (str + '').replace(/[\\"']/g, '\\$&').replace(/\u0000/g, '\\0');
    }

    public getNomImage(){
        this._nom_image = "WELD"+this.num_lot+"000"+this.num_dans_lot;
    }

    get_current_date() {
        var today = new Date();
        var dd = String(today.getDate()).padStart(2, '0');
        var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
        var yyyy = today.getFullYear();
        var retour = mm + '/' + dd + '/' + yyyy;
        return retour;
      }

    
}



