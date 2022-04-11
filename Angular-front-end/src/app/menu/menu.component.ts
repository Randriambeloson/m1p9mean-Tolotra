import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ComponentService } from '../service/component.service';
import { PopupService } from '../service/popup.service';
import { RestaurantService } from '../service/restaurant.service';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit {
  text_welcome : any = "Notre Menu"; 
  restaurant_tab : any = [];
  current_restaurant : any;
  plat_tab : any = [];
  constructor(private componentService : ComponentService , private restaurantService : RestaurantService ,private router :Router,private popupService : PopupService) { }

  ngOnInit(): void {
    this.init();
  }

  init() {
    this.componentService.show_header();
    this.componentService.show_loader();
    this.componentService.addClassActive('menu');
    this.get_all_restaurent();
    document.getElementById("text-welcome").innerHTML = this.text_welcome
  }

  get_all_restaurent() {
    this.restaurantService.getAllRestaurant().subscribe((data : any)=>{
      switch(data.metadata.code) {
        case (200) : {
          this.restaurant_tab = data.data;
          break;
        }
      }
      console.log(data);
      this.componentService.hide_loader();
    })
  }

  get_all_plat_by_id_restaurant(restaurant) {
    this.current_restaurant = restaurant ;
    this.restaurantService.getAllPlatByIdRestaurant(restaurant._id).subscribe((data : any)=>{
      switch(data.metadata.code) {
        case (200) : {
          this.plat_tab = data.data;
          break;
        }
      }
      console.log(data.data);
    })
  }

  commanderPlat(plat) {
    if(localStorage.getItem('token')!=undefined) {
      this.popupService.showConfirm("Voulez-vous vraiment commander ce plat" , ()=>{this.commanderPlatDirect(plat)});
    } else {
      this.popupService.showConfirm("Vous devez dabord vous connectez" , ()=>{this.router.navigate(['/login'])});
    }
    
  }

  commanderPlatDirect(plat) {
    console.log(plat);
    console.log(this.current_restaurant);
    this.restaurantService.commanderPlat(plat , this.current_restaurant).subscribe((data : any)=> {
      switch(data.metadata.code) {
        case (200) : {
          this.popupService.showSuccess("Plat Commander avec succes");
          break;
        }
        case (500) : {
          this.popupService.showError(data.errorMessage);
        }
      }
    })
  }

}
