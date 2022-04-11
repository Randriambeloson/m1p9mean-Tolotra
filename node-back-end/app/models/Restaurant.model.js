'use strict';

const { dbconnect } = require('../services/DBConnection.service');
const TokenHelper = require('../services/TokenHelper');

module.exports = class RestaurantModel{

     async get_all_restaurant() {
        let con = null;
        let db = null;
        try{
           con= await dbconnect();
           await con.connect();
           db = await con.db("ekalydb");
           // Tester l'authentification de l'utilisateur effectuant la requête
           
            var result = await this.get_all_restaurant_with_connexion(db);

            return result;
           
       }catch(err){
           console.log(err);
          throw err;
       } finally {
        //   if(con!=null) con.close();
       }
     }

     async get_all_restaurant_with_connexion(db) {
        var result = await  db.collection("Restaurant").find().toArray()
        
        return result;
     }

     async get_all_plat_by_id_restaurant(id) {
         let con = null;
         let db = null;
         try{
            con= await dbconnect();
            await con.connect();
            db = await con.db("ekalydb");
            // Tester l'authentification de l'utilisateur effectuant la requête
            
            var result = await this.get_all_plat_by_id_restaurant_with_connexion(db , id);

            return result;
            
      }catch(err){
            console.log(err);
         throw err;
      } finally {
         //   if(con!=null) con.close();
      }
   
   }

   async get_all_commande_en_cour_by_restaurant(restaurant) {
      let con = null;
      let db = null;
      try{
         restaurant = JSON.parse(restaurant);
         con= await dbconnect();
         await con.connect();
         db = await con.db("ekalydb");
         // Tester l'authentification de l'utilisateur effectuant la requête
         
         var result = await this.get_all_commande_en_cour_by_restaurant_with_connexion(db , restaurant);

         return result;
         
   }catch(err){
         console.log(err);
      throw err;
   } finally {
      //   if(con!=null) con.close();
   }

}

   

   async commanderPlat(authorization,plat,restaurant) {
        let con = null;
        let db = null;
        let tokenHelper = new TokenHelper();
        plat = JSON.parse(plat);
        restaurant = JSON.parse(restaurant);
        try{
         con= await dbconnect();
         await con.connect();
         db = await con.db("ekalydb");
         let token = await tokenHelper.getTokenFromBearerToken(authorization);
         let user = await tokenHelper.getUserByToken(db, token);
         console.log(user);
         let query = {plat : plat , restaurant : restaurant , utilisateur : user , etatCommande : {id_etat : 0 , nom_etat : "Commander"}};
         return db.collection("Commande").insertOne(query);
           
       }catch(err){
           console.log(err);
          throw err;
       } finally {
        //   if(con!=null) con.close();
       }
   }

   async get_all_commande_by_user(authorization) {
      let con = null;
      let db = null;
      let tokenHelper = new TokenHelper();
      try{
       con= await dbconnect();
       await con.connect();
       db = await con.db("ekalydb");
       let token = await tokenHelper.getTokenFromBearerToken(authorization);
       let user = await tokenHelper.getUserByToken(db, token);
       let query = {utilisateur : user};
       console.log(query);
       let result = db.collection("Commande").find(query);
       return result.toArray();
         
     }catch(err){
         console.log(err);
        throw err;
     } finally {
      //   if(con!=null) con.close();
     }
   }

   async get_all_restaurant_by_utilisateur(authorization) {
      let con = null;
      let db = null;
      let tokenHelper = new TokenHelper();
      try{
       con= await dbconnect();
       await con.connect();
       db = await con.db("ekalydb");
       let token = await tokenHelper.getTokenFromBearerToken(authorization);
       let user = await tokenHelper.getUserByToken(db, token);
       user._id = await  new String(user._id).toString();
       let query = {id_utilisateur : user._id};
       console.log(query);
       let result = db.collection("Restaurant").find(query);
       return result.toArray();
         
     }catch(err){
         console.log(err);
        throw err;
     } finally {
      //   if(con!=null) con.close();
     }
   }

   

   async get_all_plat_by_id_restaurant_with_connexion(db , id) {
      var query = {"id_restaurant" : id}
      console.log(query);
      var result = await  db.collection("plat").find(query).toArray()
   
      return result;
   }

   
   async get_all_commande_en_cour_by_restaurant_with_connexion(db , restaurant) {
      var query = {"restaurant" : restaurant}
      console.log(query);
      var result = await  db.collection("Commande").find(query).toArray()
   
      return result;
   }
   //   async get_restaurant_by_id(data) {
   //      let con = null;
   //      let db = null;0
   //      let tokenHelper = new TokenHelper();
   //      try{
   //         con= await dbconnect();
   //         await con.connect();
   //         db = await con.db("ekalydb");
   //         // Tester l'authentification de l'utilisateur effectuant la requête
           
   //          var result = await this.get_utilisateur_with_connexion(db , data);
   //          if(result == null || result.length==0) {
   //              throw new Error("Mot de passe ou identifiant incorrecte");
   //          }

   //          let user = result;
   //          let token = await tokenHelper.insertToken(db, user);
   //          return {
   //              token : token,
   //              user : user   
   //          };
           
   //     }catch(err){
   //         console.log(err);
   //        throw err;
   //     } finally {
   //      //   if(con!=null) con.close();
   //     }
   //   }


   //   async get_all_poste() {
   //      let con = null;
   //      let db = null;
   //      let tokenHelper = new TokenHelper();
   //      try{
   //         con= await dbconnect();
   //         await con.connect();
   //         db = await con.db("ekalydb");
   //         // Tester l'authentification de l'utilisateur effectuant la requête
           
   //          var result = await this.get_all_poste_with_connexion(db);

            
   //          return result
           
   //     }catch(err){
   //         console.log(err);
   //        throw err;
   //     } finally {
   //      //   if(con!=null) con.close();
   //     }
   //   }

   //   async get_utilisateur_with_connexion(db , data) {
   //      var query = data;
   //      var result = await  db.collection("Utilisateur").findOne(query);
        
   //      return result;
   //   }

   //   async get_all_poste_with_connexion(db) {
   //      var result = await  db.collection("poste").find({}).toArray();
   //      return result;
   //   }

     

   //   async delete_utilisateur_by_id(id) {
   //      let con = null;
   //      let db = null;
   //      try{
   //         con= await dbconnect();
   //         await con.connect();
   //         db = await con.db("ekalydb");
   //         // Tester l'authentification de l'utilisateur effectuant la requête
           
   //          var result = await this.delete_utilisateur_by_id_with_connexion(db , id);

   //          return result;
           
   //     }catch(err){
   //         console.log(err);
   //        throw err;
   //     } finally {
   //      //   if(con!=null) con.close();
   //     }
   //   }

   //   async delete_utilisateur_by_id_with_connexion(db , id) {
   //      var query = { id:id};
   //      var result = await  db.collection("Utilisateur").deleteOne(query);
        
   //      return result;
   //   }

   //   async insert_utilisateur(data) {
   //      let con = null;
   //      let db = null;
   //      try{
   //         con= await dbconnect();
   //         await con.connect();
   //         db = await con.db("ekalydb");
   //         // Tester l'authentification de l'utilisateur effectuant la requête
           
   //          var result = await this.insert_Utilisateur_with_connexion(db , data);

   //          return result;
           
   //     }catch(err){
   //         console.log(err);
   //        throw err;
   //     } finally {
   //      //   if(con!=null) con.close();
   //     }
   //   }

      
   //    async  test_api_model_with_connexion(db){
   //      // var query = { id:'2', nom: "Ran", prenom:'Kan' , poste : { id : '1' , nomPoste : 'Livreur'}, mdp:"123456"};
   //      var result = await  db.collection("Utilisateur").find().toArray()
        
   //      return result;
   //    };

   //    async insert_Utilisateur_with_connexion(db , data) {
   //      var query = await data;
   //      var result = await  db.collection("Utilisateur").insertOne(query)
        
   //      return result;
   //    }
}