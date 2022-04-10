import { Injectable } from '@angular/core';
import { HttpClient , HttpParams } from '@angular/common/http';
import { Router } from '@angular/router';
import { RequestService } from './request/request.service';

@Injectable({
  providedIn: 'root'
})
export class RestaurantService extends RequestService {

  constructor(private router : Router , private httpClient : HttpClient, public requestService : RequestService) {
    super();
   }

  getAllRestaurant() {
    let options : any = this.getOptions();
    return this.httpClient.get(this.baseUrl+"/get_all_restaurant" , options);
  }

  
  getAllPlatByIdRestaurant(id) {
    let options : any = this.getOptions();
    const body = new HttpParams()
    .set('id', id)
    return this.httpClient.post(this.baseUrl+"/get_all_plat_by_id_restaurant" , body , options);
  }

  
  commanderPlat(plat , restaurant) {
    let options : any = this.getOptions();
    const body = new HttpParams()
    .set('plat', JSON.stringify(plat))
    .set('restaurant' , JSON.stringify(restaurant))
    return this.httpClient.post(this.baseUrl+"/commanderPlat" , body , options);
  }

  getAllCommandeByUser() {
    let options : any = this.getOptions();
    return this.httpClient.get(this.baseUrl+"/get_all_commande_by_user" , options);
  }

}
