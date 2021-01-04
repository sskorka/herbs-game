import { Component, Input } from '@angular/core';
import { Toast } from 'ngx-toast-notifications';

@Component({
  selector: 'app-comingsoon-toast',
  template:
    '<div style="padding: 1rem; font-size: 15px; margin: 0px 20px;" (click)="toast.close()">' +
    '<div>{{toast.text}}</div>' +
    '</div>'
})
export class ComingsoonToastComponent {
  @Input() toast: Toast;

  constructor() { }
}
