import { Component, OnInit } from '@angular/core';
import { ComponentService } from '../service/component.service';
import * as $ from 'jquery';
import { Router } from '@angular/router';
import { UtilisateurService } from '../service/utilisateur.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  text_banniere : any = 'E-kaly est un site en ligne <span class="gold-text"> regroupant tout vos restaurant preferee</span>.Ce projet a été crée dans le cadre d un exament de Master l IT university.Projet de <span class="gold-text"> Tolotra Randriambeloson </span>. Ayant le nummero ETU <span class="gold-text"> 1026 </span>'
  text_welcome : any ="Welcome"
  isConnected : any;
  constructor(private componentService : ComponentService, private utilisateurService : UtilisateurService, public router:Router) { }

  ngOnInit(): void {
    this.isConnectedFunction();
    document.getElementById("text-banniere").innerHTML=this.text_banniere;
    document.getElementById("text-welcome").innerHTML = this.text_welcome
    $('.mobile-menu-icon').click(function(){
      $('.tm-nav').slideToggle();
    });
  }

  addClassActive($event) {
    this.removeAllClasseActive();
    $event.target.classList.add('active');
  }

  removeAllClasseActive() {
    var allClassActive = document.getElementsByClassName("active");
    for(var i=0; i<allClassActive.length ; i++) {
      allClassActive[i].classList.remove("active");
    }
  }
  
  allerVersElement(id): void {
    var $element = document.getElementById(id); 
    $element.scrollIntoView({behavior: "smooth", block: "start", inline: "nearest"});
  }
  isConnectedFunction() {
    if(localStorage.getItem("token")!=undefined && localStorage.getItem("default_page")!=undefined) {
      this.isConnected =  true;
    } else {
      this.isConnected =  false;
    }
    console.log(this.isConnected);
  }

  deconnexion() {
    this.componentService.show_loader();
    this.utilisateurService.deconnexion().subscribe(async (data)=> {
      await localStorage.clear();
      await this.isConnectedFunction();
      this.componentService.hide_loader();
    })

  }
 
}
