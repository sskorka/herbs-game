import { Component, OnInit } from '@angular/core';
import { faSignInAlt, faCaretDown } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  faSignInAlt = faSignInAlt;
  faCaretDown = faCaretDown;

  constructor() { }

  ngOnInit(): void {
  }

}
