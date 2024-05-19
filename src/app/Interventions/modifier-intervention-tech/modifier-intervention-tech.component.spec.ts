import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModifierInterventionTechComponent } from './modifier-intervention-tech.component';

describe('ModifierInterventionTechComponent', () => {
  let component: ModifierInterventionTechComponent;
  let fixture: ComponentFixture<ModifierInterventionTechComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ModifierInterventionTechComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ModifierInterventionTechComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
