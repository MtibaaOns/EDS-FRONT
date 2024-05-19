import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListeFactureClientComponent } from './liste-facture-client.component';

describe('ListeFactureClientComponent', () => {
  let component: ListeFactureClientComponent;
  let fixture: ComponentFixture<ListeFactureClientComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ListeFactureClientComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ListeFactureClientComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
