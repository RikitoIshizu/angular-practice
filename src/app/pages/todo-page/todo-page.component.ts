import { CountComponent } from '@/shared/components/count/count.component';
import { Title } from '@/shared/components/title/title.component';
import { LearningScoreStore, ScoreState } from '@/stores/learningStatus.store';

import { Component, computed, inject } from '@angular/core';

@Component({
  selector: 'todo-page',
  standalone: true,
  imports: [Title, CountComponent],
  templateUrl: './todo-page.component.html',
})
export class TodoPageComponent {
  private readonly learningScoreState = inject(LearningScoreStore);

  readonly learningScore = computed<ScoreState['score']>(() =>
    this.learningScoreState.score()
  );
}
