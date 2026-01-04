
import { Component, Input } from '@angular/core';

@Component({
  selector: 'title-component',
  standalone: true,
  imports: [],
  templateUrl: './title.component.html',
})
export class Title {
  @Input() title!: string;
  @Input() testId?: string;
}
