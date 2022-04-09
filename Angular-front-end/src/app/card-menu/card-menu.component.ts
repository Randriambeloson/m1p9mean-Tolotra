import { Component, OnInit,Input } from '@angular/core';

@Component({
  selector: 'app-card-menu',
  templateUrl: './card-menu.component.html',
  styleUrls: ['./card-menu.component.css']
})
export class CardMenuComponent implements OnInit {
  @Input() nom: any;
  @Input() details: any;
  @Input() image: any;
  initial_nom : any;
  reste_nom : any;
  conestructor() { }

  ngOnInit(): void {
    this.initial_nom = this.nom[0];
    this.reste_nom = this.nom.substring(1);
  }

}
