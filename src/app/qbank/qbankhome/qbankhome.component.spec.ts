import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QbankhomeComponent } from './qbankhome.component';

describe('QbankhomeComponent', () => {
  let component: QbankhomeComponent;
  let fixture: ComponentFixture<QbankhomeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QbankhomeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QbankhomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
