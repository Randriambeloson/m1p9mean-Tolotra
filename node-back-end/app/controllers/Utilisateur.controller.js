'use strict';
const UtilisateurModel = require("../models/Utilisateur.model");
const requestMetadata = require("../../config/app_config/metadataRequest_config");



/* Declaration du controller en question */
const UtilisateurController = function(app){

    app.get('/test_api',async function(req,res){
        let response = {};
        let authorization = req.headers ["authorization"];
        let utilisateur = new UtilisateurModel();
        try{
            response ["metadata"] = requestMetadata.requestMetadata.successMetadata;
            response ["data"] = await utilisateur.test_api_model();
        }
        catch(e){
            response ["metadata"] = requestMetadata.requestMetadata.errorMetadata;
            response ["errorMessage"] = e.message;
        }finally{
            res.send(JSON.stringify(response));
        }
    });

    app.post('/insert_utilisateur',async function(req,res){
            let response = {};
            let authorization = req.headers ["authorization"];
            let utilisateur = new UtilisateurModel();
        try{
            if(req.body.nom == "undefined" || req.body.nom == "" || req.body.prenom == "undefined" || req.body.prenom == ""  || req.body.identifiant == "undefined" || req.body.identifiant == "" || req.body.mdp == "undefined" || req.body.mdp == "") throw new Error("Parametre invalide")
            let data = {
                nom : req.body.nom,
                prenom : req.body.prenom,
                identifiant : req.body.identifiant,
                mdp : req.body.mdp
            }
            response ["metadata"] = requestMetadata.requestMetadata.successMetadata;
            response ["data"] = await utilisateur.insert_utilisateur(data);
        }
        catch(e){
            response ["metadata"] = requestMetadata.requestMetadata.errorMetadata;
            response ["errorMessage"] = e.message;
        }finally{
            res.send(JSON.stringify(response));
        }
    });

    app.post('/get_all_utilisateur',async function(req,res){
        let response = {};
        let authorization = req.headers ["authorization"];
        let utilisateur = new UtilisateurModel();
        try{
            response ["metadata"] = requestMetadata.requestMetadata.successMetadata;
            response ["data"] = await utilisateur.get_all_utilisateur();
        }
        catch(e){
            response ["metadata"] = requestMetadata.requestMetadata.errorMetadata;
            response ["errorMessage"] = e.message;
        }finally{
            res.send(JSON.stringify(response));
        }
    });

    app.post('/login' , async function(req,res) {
        let response = {};
        let authorization = req.headers ["authorization"];
        let utilisateur = new UtilisateurModel();
        try{
            response ["metadata"] = requestMetadata.requestMetadata.successMetadata;
            response ["data"] = await utilisateur.get_utilisateur();
        }
        catch(e){
            response ["metadata"] = requestMetadata.requestMetadata.errorMetadata;
            response ["errorMessage"] = e.message;
        }finally{
            res.send(JSON.stringify(response));
        }
    })
 
    app.post('/delete_utilisateur',async function(req,res){
        let response = {};
        let authorization = req.headers ["authorization"];
        let id = req.body.id ;
        let utilisateur = new UtilisateurModel();
        try{
            response ["metadata"] = requestMetadata.requestMetadata.successMetadata;
            response ["data"] = await utilisateur.delete_utilisateur_by_id(id);
        }
        catch(e){
            response ["metadata"] = requestMetadata.requestMetadata.errorMetadata;
            response ["errorMessage"] = e.message;
        }finally{
            res.send(JSON.stringify(response));
        }
    });
    


}

module.exports = UtilisateurController;