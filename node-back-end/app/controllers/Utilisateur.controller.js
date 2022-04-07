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
        let data = {
            nom : await req.body.nom ,
            prenom : await req.body.prenom ,
            mdp : await req.body.mdp 
        }
        console.log(req.body);
        try{
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