import { Component, OnInit } from '@angular/core';
import { ComponentService } from '../service/component.service';
@Component({
  selector: 'app-profil',
  templateUrl: './profil.component.html',
  styleUrls: ['./profil.component.css']
})
export class ProfilComponent implements OnInit {

  constructor(private componentService : ComponentService) { }

  ngOnInit(): void { 
    this.init();
  }

  init() {
    this.componentService.addClassActive('profil');
    this.componentService.hide_loader();
    this.componentService.hide_banniere();
    this.componentService.hide_footer();

  }

}
