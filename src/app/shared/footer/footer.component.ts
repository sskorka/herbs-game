import { Component, OnInit } from '@angular/core';
import { faEnvelope } from '@fortawesome/free-regular-svg-icons';
import { NgForm } from '@angular/forms';
import { Toaster } from 'ngx-toast-notifications';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit {
  faEnvelope = faEnvelope;

  constructor(private toaster: Toaster, private translate: TranslateService) { }

  ngOnInit(): void {
  }

  onContactFormSubmit(form: NgForm) {
    console.log(form);

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
