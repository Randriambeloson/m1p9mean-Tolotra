'use strict';

const { dbconnect } = require('../services/DBConnection.service');

module.exports = class UtilisateurModel{

    async test_api_model() {
        let con = null;
        let db = null;
        try{
           con= await dbconnect();
           await con.connect();
           db = await con.db("ekalydb");
           // Tester l'authentification de l'utilisateur effectuant la requête
           
            var result = await this.test_api_model_with_connexion(db);

            return result;
           
       }catch(err){
           console.log(err);
          throw err;
       } finally {
        //   if(con!=null) con.close();
       }
     }

     async get_all_utilisateur() {
        let con = null;
        let db = null;
        try{
           con= await dbconnect();
           await con.connect();
           db = await con.db("ekalydb");
           // Tester l'authentification de l'utilisateur effectuant la requête
           
            var result = await this.get_all_utilisateur_with_connexion(db);

            return result;
           
       }catch(err){
           console.log(err);
          throw err;
       } finally {
        //   if(con!=null) con.close();
       }
     }

     async get_all_utilisateur_with_connexion(db) {
        var result = await  db.collection("Utilisateur").find().toArray()
        
        return result;
     }

     async delete_utilisateur_by_id(id) {
        let con = null;
        let db = null;
        try{
           con= await dbconnect();
           await con.connect();
           db = await con.db("ekalydb");
           // Tester l'authentification de l'utilisateur effectuant la requête
           
            var result = await this.delete_utilisateur_by_id_with_connexion(db , id);

            return result;
           
       }catch(err){
           console.log(err);
          throw err;
       } finally {
        //   if(con!=null) con.close();
       }
     }

     async delete_utilisateur_by_id_with_connexion(db , id) {
        var query = { id:id};
        var result = await  db.collection("Utilisateur").deleteOne(query)
        
        return result;
     }

     async insert_utilisateur(data) {
        let con = null;
        let db = null;
        try{
           con= await dbconnect();
           await con.connect();
           db = await con.db("ekalydb");
           // Tester l'authentification de l'utilisateur effectuant la requête
           
            var result = await this.insert_Utilisateur_with_connexion(db , data);

            return result;
           
       }catch(err){
           console.log(err);
          throw err;
       } finally {
        //   if(con!=null) con.close();
       }
     }

      
      async  test_api_model_with_connexion(db){
        // var query = { id:'2', nom: "Ran", prenom:'Kan' , poste : { id : '1' , nomPoste : 'Livreur'}, mdp:"123456"};
        var result = await  db.collection("Utilisateur").find().toArray()
        
        return result;
      };

      async insert_Utilisateur_with_connexion(db , data) {
        var query = await data;
        console.log(query);
        var result = await  db.collection("Utilisateur").insertOne(query)
        
        return result;
      }
}