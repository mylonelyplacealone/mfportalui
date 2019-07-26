import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SharedashboardComponent } from './sharedashboard.component';

describe('SharedashboardComponent', () => {
  let component: SharedashboardComponent;
  let fixture: ComponentFixture<SharedashboardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SharedashboardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SharedashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
