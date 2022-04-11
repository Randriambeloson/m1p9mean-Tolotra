import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListeRestaurantComponent } from './liste-restaurant.component';

describe('ListeRestaurantComponent', () => {
  let component: ListeRestaurantComponent;
  let fixture: ComponentFixture<ListeRestaurantComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListeRestaurantComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListeRestaurantComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
