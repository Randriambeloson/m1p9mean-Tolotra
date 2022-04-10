import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListeCommandeComponent } from './liste-commande.component';

describe('ListeCommandeComponent', () => {
  let component: ListeCommandeComponent;
  let fixture: ComponentFixture<ListeCommandeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListeCommandeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListeCommandeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
