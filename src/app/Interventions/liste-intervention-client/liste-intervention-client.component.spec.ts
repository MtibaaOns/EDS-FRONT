import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListeInterventionClientComponent } from './liste-intervention-client.component';

describe('ListeInterventionClientComponent', () => {
  let component: ListeInterventionClientComponent;
  let fixture: ComponentFixture<ListeInterventionClientComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ListeInterventionClientComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ListeInterventionClientComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
