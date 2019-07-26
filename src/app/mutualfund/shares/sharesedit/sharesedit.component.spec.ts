import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShareseditComponent } from './sharesedit.component';

describe('ShareseditComponent', () => {
  let component: ShareseditComponent;
  let fixture: ComponentFixture<ShareseditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShareseditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShareseditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
