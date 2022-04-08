export class FormError extends Error {
    code : number = 500 ;
    idChamp : string = "";

    constructor(messageError : string , code : number , idChamp : string)  {
        super(messageError);
        this.code = code;
        this.idChamp = idChamp; 
    }
}
