import { Component, OnInit } from '@angular/core';
import { ComponentService } from '../service/component.service';
import { RestaurantService } from '../service/restaurant.service';

@Component({
  selector: 'app-liste-commande',
  templateUrl: './liste-commande.component.html',
  styleUrls: ['./liste-commande.component.css','../menu/menu.component.css']
})
export class ListeCommandeComponent implements OnInit {
  text_welcome : any = "Vos Commandes"; 
  commande_tab : any = [];

  constructor(private componentService : ComponentService , private restaurantService :RestaurantService) { }

  ngOnInit(): void {
    this.componentService.show_loader();
    this.getAllCommande();
    document.getElementById("text-welcome").innerHTML = this.text_welcome
  }

  getAllCommande() {
    this.restaurantService.getAllCommandeByUser().subscribe(async(data : any)=> {
      switch(data.metadata.code) {
        case (200) : {
          this.commande_tab = data.data;
          break;
        }
      }
      this.componentService.hide_loader();
      console.log(data);
    }) 
  }
  

}
