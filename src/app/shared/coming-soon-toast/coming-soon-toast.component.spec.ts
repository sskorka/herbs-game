import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ComingSoonToastComponent } from './coming-soon-toast.component';

describe('ComingsoonToastComponent', () => {
  let component: ComingSoonToastComponent;
  let fixture: ComponentFixture<ComingSoonToastComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ComingSoonToastComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ComingSoonToastComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
