import { Injectable } from '@angular/core';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class PopupService {

  constructor() { }

    async showSuccess (text : string, cb : any = new Function()){
        await Swal.fire({
            icon: 'success',
            title: "Succès",
            html : text
        }).then(()=>{
            if(cb !=null) { cb() }
        });
    }

    async showError (text : string , cb : any = new Function() ){

        await Swal.fire({
            icon: 'error',
            title: "Erreur",
            html : text,
            showCloseButton : true,
        }).then(()=>{
            if(cb!=null) { cb() }
        });
    }

    showWarning = function(text : string, cb : any = null ){
        Swal.fire({
            icon: 'warning',
            title: "Avertissement",
            text: text
        }).then(()=>{
            if(cb!=null) { cb() };
        });
    }
    showConfirm = function(text : string , cb_ok : any = null  , cb_ko : any = null) {
        Swal.fire({
            icon: 'info',
            title: "Confirmation",
            text: text,
            showCancelButton: true,
            confirmButtonText: 'Oui',
            cancelButtonText: 'Non'
        }).then((result) => {

            if (result.value) {
                if(cb_ok!=null) { cb_ok() };
                    

            } else if (result.dismiss === Swal.DismissReason.cancel) {
                if(cb_ko!=null) { cb_ko() };

            }
        });
    }
}


