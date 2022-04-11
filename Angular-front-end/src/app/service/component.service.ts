import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class ComponentService {

  constructor(private router : Router) { }

  async  hide_loader() {
    await this.show_or_hide_loader(false);
  }

  async show_loader() {
    await this.show_or_hide_loader(true);
  }

  async  hide_header() {
    await this.show_or_hide_header(false);
    this.hide_banniere();
  }

  async show_header() {
    await this.show_or_hide_header(true);
    this.show_banniere();
  }

  async hide_banniere() {
    document.getElementById("banniere").hidden = true;
  }
  async show_banniere() {
    document.getElementById("banniere").hidden = false;
  }

  async hide_footer() {
    document.getElementById("footer").hidden = true;
  }

  async show_or_hide_loader(boolean : boolean) {
    document.getElementById("loader").hidden = !boolean;
    document.getElementById("router-outlet").hidden = boolean;
  }

  async show_or_hide_header(boolean : boolean) {
    document.getElementById("header").hidden = !boolean;
    document.getElementById("footer").hidden = !boolean;
  }

  async redirect_si_non_authentifier() {
    if(!localStorage.getItem("token") && !localStorage.getItem("DefaultPage") ) {
      this.router.navigate(["/login"]);
    }
  }

  addClassActive(id) {
    this.removeAllClasseActive();
    document.getElementById(id).classList.add('active');
  }

  removeAllClasseActive() {
    var allClassActive = document.getElementsByClassName("active");
    for(var i=0; i<allClassActive.length ; i++) {
      allClassActive[i].classList.remove("active");
    }
  }

}
