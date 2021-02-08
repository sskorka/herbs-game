import { Component, Input } from '@angular/core';
import { Toast } from 'ngx-toast-notifications';

@Component({
  selector: 'app-coming-soon-toast',
  template:
    '<div style="padding: 1rem; font-size: 15px; margin: 0px 20px;" (click)="toast.close()">' +
    '<div>{{toast.text}}</div>' +
    '</div>'
})
export class ComingSoonToastComponent {
  @Input() toast: Toast;

  constructor() { }
}
