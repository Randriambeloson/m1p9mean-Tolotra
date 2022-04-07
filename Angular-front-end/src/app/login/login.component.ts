import { Component, OnInit } from '@angular/core';
import { ComponentService } from '../service/component.service';
import { UtilisateurService } from '../service/utilisateur.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor(private componentService : ComponentService , private utilisateurService : UtilisateurService) { }

  async ngOnInit(): Promise<void> {
    await this.get_all_user();
    
  }

  async get_all_user() {
     return await this.utilisateurService.getAllUser().subscribe(async (data : any) => {
        console.log(data);
        setTimeout(()=> {this.componentService.hide_loader()} , 1000)
      } , (err) => {
        console.log(err);
      })
  }

}
