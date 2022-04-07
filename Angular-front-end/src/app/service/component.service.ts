import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ComponentService {

  constructor() { }

  async  hide_loader() {
    await this.show_or_hide_header(false);
  }

  async show_loader() {
    await this.show_or_hide_header(true);
  }

  async show_or_hide_header(boolean : boolean) {
    document.getElementById("loader").hidden = !boolean;
    document.getElementById("router-outlet").hidden = boolean;
  }
}
