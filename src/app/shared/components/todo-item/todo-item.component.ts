import { Todo } from '@/models/type';
import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'todo-item',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './todo-item.component.html',
})
export class TodoItemComponent {
  // props
  @Input() title!: string;
  @Input() todos!: Todo[];
  @Input() noListMsg?: string;

  // 親で操作するハンドラ
  // (親コンポーネントはこちらを渡す)
  @Output() todoClick = new EventEmitter<Todo['id']>();

  // Todoリストの項目をクリックする
  click(id: Todo['id']) {
    this.todoClick.emit(id);
  }
}
