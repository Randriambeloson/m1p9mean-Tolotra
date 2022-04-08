import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ComponentService } from '../service/component.service';
import { PopupService } from '../service/popup.service';
import { UtilisateurService } from '../service/utilisateur.service';
import { image } from '../../environments/environment';
import * as $ from 'jquery';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  utilisateur : any = {}
  image_login = image.image_login;
  constructor(private componentService : ComponentService , private utilisateurService : UtilisateurService , private popupService:PopupService, private router: Router) { }

  async ngOnInit(): Promise<void> {
    await this.initLogin();
    setTimeout(()=> {this.componentService.hide_loader()} , 1000);
    
  }

  async login() {
    this.showSpinner();
     return await this.utilisateurService.login(this.utilisateur).subscribe(async (data : any) => {
       switch(data.metadata.code) {
         case 200 : {
           console.log(data);
           this.router.navigate(['/signin']);
           this.popupService.showSuccess('Connected');
           break;
         }
         case 500 : {
           this.popupService.showError(data.errorMessage);
         }
       }
       this.hideSpinner();
        console.log(data);
      } , (err) => {
        console.log(err);
      })
  }

  showSpinner() {
    document.getElementById("spinner").hidden = false;
    document.getElementById("btn-login").setAttribute("disabled","disabled");
  }

  hideSpinner() {
    document.getElementById("spinner").hidden = true;
    document.getElementById("btn-login").removeAttribute("disabled");
  }


  async initLogin() {
    $('.input100').each(function(){
        $(this).on('blur', function(){
            if($(this).val().trim() != "") {
                $(this).addClass('has-val');
            }
            else {
                $(this).removeClass('has-val');
            }
        })    
    })
  
  
    /*==================================================================
    [ Validate ]*/
    var input = $('.validate-input .input100');

    $('.validate-form').on('submit',function(){
        var check = true;

        for(var i=0; i<input.length; i++) {
            if(validate(input[i]) == false){
                showValidate(input[i]);
                check=false;
            }
        }

        return check;
    });


    $('.validate-form .input100').each(function(){
        $(this).focus(function(){
           hideValidate(this);
        });
    });

    function validate (input) {
        if($(input).attr('type') == 'email' || $(input).attr('name') == 'email') {
            if($(input).val().trim().match(/^([a-zA-Z0-9_\-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([a-zA-Z0-9\-]+\.)+))([a-zA-Z]{1,5}|[0-9]{1,3})(\]?)$/) == null) {
                return false;
            }
        }
        else {
            if($(input).val().trim() == ''){
                return false;
            }
        }
    }

    function showValidate(input) {
        var thisAlert = $(input).parent();

        $(thisAlert).addClass('alert-validate');
    }

    function hideValidate(input) {
        var thisAlert = $(input).parent();

        $(thisAlert).removeClass('alert-validate');
    }
    
    /*==================================================================
    [ Show pass ]*/
    var showPass = 0;
    $('.btn-show-pass').on('click', function(){
        if(showPass == 0) {
            $(this).next('input').attr('type','text');
            $(this).find('i').removeClass('fa fa-eye');
            $(this).find('i').addClass('fas fa-eye-slash');
            showPass = 1;
        }
        else {
            $(this).next('input').attr('type','password');
            $(this).find('i').addClass('fa fa-eye');
            $(this).find('i').removeClass('fas fa-eye-slash');
            showPass = 0;
        }
        
    });
  }

}
