import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'count-component',
  imports: [CommonModule],
  templateUrl: './count.component.html',
})
export class CountComponent {
  // props
  @Input() title!: string; // タイトル
  @Input() amount?: number = undefined; // 数値
  @Input() suffix!: string; // 末尾の単位
  @Input() amountTextColor?: string = 'text-blue-600';
}
