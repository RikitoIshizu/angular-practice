import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { NgxSpinnerModule } from 'ngx-spinner';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, CommonModule, RouterLinkActive, NgxSpinnerModule],
  templateUrl: './app.component.html',
})
export class AppComponent {
  routings = [
    { path: '/', text: 'TODO' },
    { path: '/calendar/', text: 'カレンダー' },
  ];
}
