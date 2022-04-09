import { Component, OnInit } from '@angular/core';
import { ComponentService } from '../service/component.service';

@Component({
  selector: 'app-acceuil',
  templateUrl: './acceuil.component.html',
  styleUrls: ['./acceuil.component.css']
})
export class AcceuilComponent implements OnInit {

  constructor(private componentService : ComponentService) { }
  text_banniere = "miova";
  ngOnInit(): void {
    this.init();
    
  }

  init() {
    this.init_banniere();
    this.componentService.show_loader();
    this.componentService.redirect_si_non_authentifier();
    setTimeout(()=> {this.componentService.hide_loader()},2000);   
  }
  init_banniere() {
    document.getElementById('text-banniere').innerHTML  = "Test text banniere ty oh; sa aona zala ah milay sa tsia Test text banniere ty oh; sa aona zala ah milay sa tsia Test text banniere ty oh; sa aona zala ah milay sa tsia Test text banniere ty oh; sa aona zala ah milay sa tsia"
    document.getElementById('text-welcome').innerHTML  = "Bienvenue"
  }

}
