import { Component, OnInit } from '@angular/core';
import { ComponentService } from '../service/component.service';
import { PopupService } from '../service/popup.service';
import { UtilisateurService } from '../service/utilisateur.service';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.css']
})
export class SigninComponent implements OnInit {
  utilisateur : any = {};
  constructor(private componentService : ComponentService, private utilisateurService : UtilisateurService, private popupService : PopupService) { }

  ngOnInit(): void {
    setTimeout(()=> {this.componentService.hide_loader()}, 1000)
  }

  async signin() {
    console.log(this.utilisateur);
    this.utilisateurService.signin(this.utilisateur).subscribe(async (data : any) => {
      switch(data.metadata.code) {
        case 200 : {
          this.popupService.showSuccess('Inscription effectuer avec success');
          break;
        }
        case 500 : {
          this.popupService.showError(data.errorMessage);
          break;
        }
      }
    } , (err) => {
      console.log(err);
    })
  }
}
