import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ComingsoonToastComponent } from './comingsoon-toast.component';

describe('ComingsoonToastComponent', () => {
  let component: ComingsoonToastComponent;
  let fixture: ComponentFixture<ComingsoonToastComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ComingsoonToastComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ComingsoonToastComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
