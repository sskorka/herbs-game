import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { faEnvelope } from '@fortawesome/free-regular-svg-icons';
import { Toaster } from 'ngx-toast-notifications';
import { TranslateService } from '@ngx-translate/core';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent{
  email = environment.devMail;
  faEnvelope = faEnvelope;

  constructor(private toaster: Toaster, private translate: TranslateService) { }

  onContactFormSubmit(form: NgForm): void {
    form.resetForm();
  }

  onContactFormInput(): void {
    this.toaster.open(this.translate.instant("Footer.Demo"));
  }

  onLogin(): void {
    this.toaster.open(this.translate.instant("Footer.Bug"));
  }

  comingSoon(): void {
    this.toaster.open(this.translate.instant("ComingSoon"));
  }

}
