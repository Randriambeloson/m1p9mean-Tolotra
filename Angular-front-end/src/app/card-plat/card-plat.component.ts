import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-card-plat',
  templateUrl: './card-plat.component.html',
  styleUrls: ['./card-plat.component.css']
})
export class CardPlatComponent implements OnInit {
  @Input() nom: any;
  @Input() details: any;
  @Input() image: any;
  @Input() prix: any;
  constructor(public router :Router) { }

  ngOnInit(): void {
  }

}
