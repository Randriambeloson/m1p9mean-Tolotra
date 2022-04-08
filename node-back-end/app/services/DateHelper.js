'use strict';

module.exports = class DateHelper{
    constructor(){
        this.equivalenceMilliseconde = {
            second : 1000,
            minute : 60000,
            heure : 360000,
            jour : 8.64e+7
        };  
    }
    addDate(date, ajout, equivalenceMilli){
        return new Date(date.getTime() + ajout * equivalenceMilli);
    }
}