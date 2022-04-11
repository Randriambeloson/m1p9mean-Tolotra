import { Component, OnInit } from '@angular/core';
import { ComponentService } from '../service/component.service';
import { RestaurantService } from '../service/restaurant.service';

@Component({
  selector: 'app-liste-restaurant',
  templateUrl: './liste-restaurant.component.html',
  styleUrls: ['./liste-restaurant.component.css' , '../menu/menu.component.css']
})
export class ListeRestaurantComponent implements OnInit {
 restaurant_tab : any = [];
 restaurant_en_cour : any;
 commande_tab : any  = [];
 plat_tab : any  = [];
  constructor(private componentService : ComponentService , private restaurantService : RestaurantService) { }

  ngOnInit(): void {
    this.init();
  }

  init() {
    this.componentService.show_loader();
    this.componentService.addClassActive('profil');
    this.componentService.hide_banniere();
    this.componentService.hide_footer();
    this.getAllRestaurantByUtilisateur();
  }
  
  getAllRestaurantByUtilisateur() {
    this.restaurantService.getAllRestaurantByUtilisateur().subscribe(async (data : any)=> {
      switch(data.metadata.code) {
        case (200) : {
          this.restaurant_tab = data.data;
        }
      console.log(data);
      this.componentService.hide_loader();
      }
    });
  }

  voirListeCommandeEnCour(restaurant) {
    this.restaurant_en_cour = restaurant;
    this.restaurantService.getAllCommandeEnCourByRestaurant(restaurant).subscribe(async (data : any)=>   {
      switch(data.metadata.code) {
        case 200 : {
          this.commande_tab = data.data;
        }
      }
    })
  }

 voirListePlat(restaurant) {
   this.restaurantService.getAllPlatByIdRestaurant(restaurant._id).subscribe(async (data : any)=>   {
    switch(data.metadata.code) {
        case 200 : {
          this.plat_tab = data.data;
        }
      }
    })
  }
}
