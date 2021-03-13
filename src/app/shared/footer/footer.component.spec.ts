import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FooterComponent } from './footer.component';
import { FormsModule, NgForm } from '@angular/forms';
import { MockTranslateService } from 'src/app/testing-helpers/mock-translate-service';
import { Toaster, ToastNotificationsModule } from 'ngx-toast-notifications';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

fdescribe('FooterComponent', () => {
  let component: FooterComponent;
  let fixture: ComponentFixture<FooterComponent>;
  let toasterSpy: jasmine.Spy;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FooterComponent],
      providers: [
        { provide: TranslateService, useClass: MockTranslateService },
      ],
      imports: [ToastNotificationsModule, TranslateModule, FormsModule],
    });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FooterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    const toaster = TestBed.inject(Toaster);
    toasterSpy = spyOn(toaster, 'open').and.callFake((key) => key);
  });

  it('should display a toast message on login', () => {
    component.onLogin();

    const message = toasterSpy.calls.mostRecent().args[0];

    expect(message).toBe('Footer.Bug');
  });

  it("should display a coming soon toast message on click", () => {
    component.comingSoon();

    const message = toasterSpy.calls.mostRecent().args[0];

    expect(message).toBe('ComingSoon');
  });

  it("should display a warning toast message on text input", () => {
    component.onContactFormInput();

    const message = toasterSpy.calls.mostRecent().args[0];

    expect(message).toBe('Footer.Demo');
  });

  it("should clear the form on click", () => {
    // Arrange
    const form = new NgForm([], []);
    const formSpy = spyOn(form, 'resetForm');

    component.onContactFormSubmit(form);

    expect(formSpy).toHaveBeenCalled();

  })
});
