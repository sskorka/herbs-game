import { Component, Input, OnInit } from '@angular/core';
import { faCheck, faUser, faUsers } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-mode',
  templateUrl: './mode.component.html',
  styleUrls: ['./mode.component.css']
})
export class ModeComponent implements OnInit {
  faCheck = faCheck;
  faUser = faUser;
  faUsers = faUsers;

  @Input() title: string;
  @Input() description: string;
  @Input() isSelected: boolean;
  @Input() isSingleplayer: boolean;
  @Input() estimatedGameTime: number;

  constructor() { }

  ngOnInit(): void {
  }

}
