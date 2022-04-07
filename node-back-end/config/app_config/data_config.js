const { app_dirname } = require("../../app_dirname");
const dossier = app_dirname + "/data";
const dossierDepot = dossier + "/depot";
const dossierExport = dossier + "/export";
const export_dossierImage = "/img";
const export_dossierIndex = "/depot";
const export_dossierExport = "/export";
const filename_mentions = "MENTIONS.TXT";
const dossier_weldom_v9 = "./weldom_v9";

module.exports.data_config = {
    dirname : app_dirname,
    dossier : dossier,
    depot : dossierDepot,
    export : dossierExport,
    dossierImage : export_dossierImage,
    dossierIndex : export_dossierIndex,
    dossierExport : export_dossierExport,
    mentions : filename_mentions,
    dossier_weldom : dossier_weldom_v9
}
module.exports.image_supportedExtension = [
    ".png",
    ".jpg",
    ".jpeg",
    ".tif",
    ".tiff",
    ".TIF",
    ".TIFF"
]

module.exports.decoupe_config = {
    // Marge en cm
    margin: { side: 2, top: 5 }
}

module.exports.linked_app = {
    // qa: 'https://quickact-dev.herokuapp.com'
    qa: 'http://localhost:8080'
}

module.exports.sftp_accounts = {
    import: {
        host: 'ftp.loyaltyhosting.fr',
        port: 22,
        username: 'amabis',
        password: 'e3OUdak'
    },
    export: {
        host: 'ftp.loyaltyhosting.fr',
        port: 22,
        username: 'amabis',
        password: 'e3OUdak'
    }
    // import: {
    //     host: 'ssh-quickactdev.alwaysdata.net',
    //     port: 22,
    //     username: 'quickactdev_import_decoupe',
    //     password: 'decoupeimage123456*'
    // },
    // export: {
    //     host: 'ssh-quickactdev.alwaysdata.net',
    //     port: 22,
    //     username: 'quickactdev_export_decoupe',
    //     password: 'decoupeimage123456*'
    // }
    // import: {
    //     host: 'ssh-quickactdev.alwaysdata.net',
    //     port: 22,
    //     username: 'quickactdev_import_decoupe',
    //     password: 'decoupeimage123456*'
    // },
    // export: {
    //     host: 'ssh-quickactdev.alwaysdata.net',
    //     port: 22,ss
    //     username: 'quickactdev_ssh',
    //     password: 'quickactdevmada123456*'
    // }
}