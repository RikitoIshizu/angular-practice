import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, CommonModule, RouterLinkActive],
  templateUrl: './app.component.html',
})
export class AppComponent {
  routings = [
    { path: '/', text: 'TODO' },
    { path: '/calendar/', text: 'カレンダー' },
  ];
}
