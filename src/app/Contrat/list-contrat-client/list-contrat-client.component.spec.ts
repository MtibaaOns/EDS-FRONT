import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListContratClientComponent } from './list-contrat-client.component';

describe('ListContratClientComponent', () => {
  let component: ListContratClientComponent;
  let fixture: ComponentFixture<ListContratClientComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ListContratClientComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ListContratClientComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
