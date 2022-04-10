'use strict';
const UtilisateurModel = require("../models/Utilisateur.model");
const RestaurantModel = require("../models/Restaurant.model");
const requestMetadata = require("../../config/app_config/metadataRequest_config");



/* Declaration du controller en question */
const RestaurantController = function(app){

    // app.post('/insert_restaurant',async function(req,res){
    //         let response = {};
    //         let authorization = req.headers ["authorization"];
    //         let utilisateur = new UtilisateurModel();
    //     try{
    //         if(req.body.nom == "undefined" || req.body.nom == "" || req.body.prenom == "undefined" || req.body.prenom == ""  || req.body.identifiant == "undefined" || req.body.identifiant == "" || req.body.mdp == "undefined" || req.body.mdp == "") throw new Error("Parametre invalide")
    //         var data = {
    //             nom : req.body.nom,
    //             prenom : req.body.prenom,
    //             mail : req.body.mail,
    //             poste : req.body.poste,
    //             identifiant : req.body.identifiant,
    //             mdp : req.body.mdp,

    //         }
    //         console.log(req.body.poste);
    //         console.log(data);
    //         response ["metadata"] = requestMetadata.requestMetadata.successMetadata;
    //         response ["data"] = await utilisateur.insert_utilisateur(data);
    //     }
    //     catch(e){
    //         response ["metadata"] = requestMetadata.requestMetadata.errorMetadata;
    //         response ["errorMessage"] = e.message;
    //     }finally{
    //         res.send(JSON.stringify(response));
    //     }
    // });

    app.get('/get_all_restaurant',async function(req,res){
        let response = {};
        let authorization = req.headers ["authorization"];
        let restaurant = new RestaurantModel();
        try{
            response ["metadata"] = requestMetadata.requestMetadata.successMetadata;
            response ["data"] = await restaurant.get_all_restaurant();
        }
        catch(e){
            response ["metadata"] = requestMetadata.requestMetadata.errorMetadata;
            response ["errorMessage"] = e.message;
        }finally{
            res.send(JSON.stringify(response));
        }
    });

    app.get('/get_all_commande_by_user',async function(req,res){
        let response = {};
        let authorization = req.headers ["authorization"];
        let restaurant = new RestaurantModel();
        try{
            response ["metadata"] = requestMetadata.requestMetadata.successMetadata;
            response ["data"] = await restaurant.get_all_commande_by_user(authorization);
        }
        catch(e){
            response ["metadata"] = requestMetadata.requestMetadata.errorMetadata;
            response ["errorMessage"] = e.message;
        }finally{
            res.send(JSON.stringify(response));
        }
    });

    
    app.post('/get_all_plat_by_id_restaurant',async function(req,res){
        let response = {};
        let authorization = req.headers ["authorization"];
        let restaurant = new RestaurantModel();
        let id = req.body.id ;
        console.log(id);
        try{
            response ["metadata"] = requestMetadata.requestMetadata.successMetadata;
            response ["data"] = await restaurant.get_all_plat_by_id_restaurant(id);
        }
        catch(e){
            response ["metadata"] = requestMetadata.requestMetadata.errorMetadata;
            response ["errorMessage"] = e.message;
        }finally{
            res.send(JSON.stringify(response));
        }
    });

    app.post('/commanderPlat',async function(req,res){
        let response = {};
        let authorization = req.headers ["authorization"];
        let restaurantM = new RestaurantModel();
        let plat = req.body.plat ;
        let restaurant = req.body.restaurant
        try{
            response ["metadata"] = requestMetadata.requestMetadata.successMetadata;
            response ["data"] = await restaurantM.commanderPlat(authorization ,plat , restaurant);
        }
        catch(e){
            console.log(e);
            response ["metadata"] = requestMetadata.requestMetadata.errorMetadata;
            response ["errorMessage"] = e.message;
        }finally{
            res.send(JSON.stringify(response));
        }
    });

 
    // app.post('/delete_restaurant',async function(req,res){
    //     let response = {};
    //     let authorization = req.headers ["authorization"];
    //     let id = req.body.id ;
    //     let utilisateur = new UtilisateurModel();
    //     try{
    //         response ["metadata"] = requestMetadata.requestMetadata.successMetadata;
    //         response ["data"] = await utilisateur.delete_utilisateur_by_id(id);
    //     }
    //     catch(e){
    //         response ["metadata"] = requestMetadata.requestMetadata.errorMetadata;
    //         response ["errorMessage"] = e.message;
    //     }finally{
    //         res.send(JSON.stringify(response));
    //     }
    // });

    // app.get('/get_plat_by_id_restaurant',async function(req,res){
    //     let response = {};
    //     let authorization = req.headers ["authorization"];
    //     let utilisateur = new UtilisateurModel();
    //     try{
    //         response ["metadata"] = requestMetadata.requestMetadata.successMetadata;
    //         response ["data"] = await utilisateur.get_all_poste();
    //     }
    //     catch(e){
    //         response ["metadata"] = requestMetadata.requestMetadata.errorMetadata;
    //         response ["errorMessage"] = e.message;
    //     }finally{
    //         res.send(JSON.stringify(response));
    //     }
    // });
    


}

module.exports = RestaurantController;