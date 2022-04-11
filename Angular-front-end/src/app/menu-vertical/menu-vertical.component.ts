import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-menu-vertical',
  templateUrl: './menu-vertical.component.html',
  styleUrls: ['./menu-vertical.component.css']
})
export class MenuVerticalComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
    this.init();
  }

  init() {
    const itemsMenuPrincipal = document.querySelectorAll('.items');
    const allSousMenu = document.querySelectorAll('.sous-menu');

    itemsMenuPrincipal.forEach(item => {

        item.addEventListener('mouseenter', () => {

            for(var i = 0; i < allSousMenu.length; i++){

                if(allSousMenu[i].getAttribute('data-anim') === item.getAttribute('data-anim')) {
                    allSousMenu[i].classList.toggle('active');
                }

            }

        })

    })

    itemsMenuPrincipal.forEach(item => {

        item.addEventListener('mouseleave', () => {

            for(var i = 0; i < allSousMenu.length; i++){

                if(allSousMenu[i].getAttribute('data-anim') === item.getAttribute('data-anim')) {
                    allSousMenu[i].classList.toggle('active');
                }

            }

        })

    })

    allSousMenu.forEach(item => {

        item.addEventListener('mouseover', () => {
            item.classList.add('active');
        })

    })
    allSousMenu.forEach(item => {

        item.addEventListener('mouseleave', () => {
            item.classList.remove('active');
        })

    })
  }

}
