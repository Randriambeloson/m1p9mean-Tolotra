module.exports.statut_utilisateur = {
    attente_validation : 0,
    valide : 1,
    supprime : -1
};
module.exports.statutaffaire = {
    en_traitement : '1',
    exporte : '2',
    revalidation : '3'
};
module.exports.statutimagesource = {
    libre : '1',
    pris : '2',
    termine : '3',
    indisponible : '4',
    revalidation : '5'
};
module.exports.tousTypeActe = "1";
// Constant configuration

module.exports.statut_conge = {
    attente_validation :1 ,
    valide : 2,
    refuser : -1 
};

module.exports.poste_utilisateur = {
    operateur : 1,
    preparateur : 2 , 
    administrateur : 3 , 
    developpeur : 4 , 
    Directeur : 5 , 
}

module.exports.service_poste = {
    production : 1,
    ressource_humaine : 2,
    informatique : 3,
    direction : 4 
}

