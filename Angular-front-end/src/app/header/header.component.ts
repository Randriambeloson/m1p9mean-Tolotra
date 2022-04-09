import { Component, OnInit } from '@angular/core';
import { ComponentService } from '../service/component.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  text_banniere : any = 'E-kaly est un site en ligne <span class="gold-text"> regroupant tout vos restaurant preferee</span>.Ce projet a été crée dans le cadre d un exament de Master l IT university.Projet de <span class="gold-text"> Tolotra Randriambeloson </span>. Ayant le nummero ETU <span class="gold-text"> 1026 </span>'
  text_welcome : any ="Welcome"
  constructor(private componentService : ComponentService) { }

  ngOnInit(): void {
    document.getElementById("text-banniere").innerHTML=this.text_banniere;
    document.getElementById("text-welcome").innerHTML = this.text_welcome
  }

}
