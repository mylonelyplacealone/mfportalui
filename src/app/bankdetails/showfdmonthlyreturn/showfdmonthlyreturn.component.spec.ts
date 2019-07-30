import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowfdmonthlyreturnComponent } from './showfdmonthlyreturn.component';

describe('ShowfdmonthlyreturnComponent', () => {
  let component: ShowfdmonthlyreturnComponent;
  let fixture: ComponentFixture<ShowfdmonthlyreturnComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShowfdmonthlyreturnComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShowfdmonthlyreturnComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
