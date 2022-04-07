import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { base_url, ws_url} from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class RequestService {

  public static successCode : number = 200;
  public static errorCode : number = 500;
  ;
  
  public baseUrl : string = base_url;
  public wsUrl : string = ws_url;
  constructor() { }
  
  getOptions() : any{
    let options : any = {};
    options ["headers"] = this.getHeaders();
    return options;
  }


  getOpt() {
    let option : any ={};
    let token : any = localStorage.getItem("token");
    option = {"Authorization" : `Bearer ${token}`}
    return option;
  }

  getHeaders() : HttpHeaders{
    let token : any = localStorage.getItem("token");
    if(token != null) {
      let header = new HttpHeaders({
      "authorization" :  `Bearer ${token}`,
      "Access-Control-Allow-Origin":"*",
      });
      return header;
    }
    return new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded')
  }
  
}
