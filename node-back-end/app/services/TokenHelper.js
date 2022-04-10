'use strict';

const md5 = require('md5');
const { expirationToken } = require('../../config/app_config/token');
const DateHelper = require('../services/DateHelper');

module.exports = class TokenHelper{
    constructor(){
        this.expirationToken = expirationToken;
        this.errorMessage = {
            utilisateur_introuvable : "Le token ne correspond à aucun utilisateur",
            auth_different_bearer : "Le token envoyé n'est pas de type Bearer"
        }
    }
    getTokenFromBearerToken(authorization){
        if(!authorization){
            throw new Error("Accès non autorisé, veuillez vous connecter");
        }
        let tokenSplited = authorization.split(" ");
        if(tokenSplited [0] != "Bearer" || tokenSplited.length != 2){
            throw new Error(this.errorMessage.auth_different_bearer);
        }
        return tokenSplited [1];
    }
    async insertToken(con, user){
        let id_user = user._id;
        let insertionDate = new Date();
        let dateHelper = new DateHelper();
        let insertionDateToken = dateHelper.addDate(
            insertionDate, 
            this.expirationToken, 
            dateHelper.equivalenceMilliseconde.jour
        );
        // let token = md5(insertionDate  + id_user + insertionDateToken);
        let token = TokenHelper.generateToken(id_user + insertionDateToken);
        
        let query = {id_utilisateur:id_user, token_utilisateur:token, date_validation:insertionDateToken};
        con.collection('token_utilisateur').insert(query);
        return token;
    }
    async deleteToken(con, token){
        let sql = "DELETE FROM token_utilisateur WHERE token_utilisateur = $1::text";
        await con.query(sql, [token]);
    }
    async getUserByToken(con, token){
        console.log(token);
        let query = {token_utilisateur : token};
        let token_utilisateur = await con.collection('token_utilisateur').find(query).toArray();
        let id_utilisateur = token_utilisateur[0].id_utilisateur;
        let query_utlisateur = {_id : id_utilisateur};
        let user = await con.collection('Utilisateur').find(query_utlisateur).toArray();
        return user[0];
    }
    static generateToken(id){
        let date = new Date();
        let token = md5(date  + id + date);
        return token;
    }
}