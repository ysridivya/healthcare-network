import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChangedoctorComponent } from './changedoctor.component';
import { ChangedoctorModule } from './changedoctor.module';

describe('ChangedoctorComponent', () => {
  let component: ChangedoctorComponent;
  let fixture: ComponentFixture<ChangedoctorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChangedoctorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChangedoctorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
