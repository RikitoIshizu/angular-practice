import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'title-component',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './title.component.html',
})
export class Title {
  @Input() title!: string;
}
