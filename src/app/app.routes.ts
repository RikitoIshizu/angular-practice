import { QuotesComponent } from '@/pages/quotes/quotes.component';
import { TodoPageComponent } from '@/pages/todo-page/todo-page.component';
import { VocabularyPageComponent } from '@/pages/vocabulary-page/vocabulary-page.component';
import { VocabularyQuizPageComponent } from '@/pages/vocabulary-quiz-page/vocabulary-quiz-page.component';
import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', component: TodoPageComponent },
  { path: 'vocabulary', component: VocabularyPageComponent },
  { path: 'vocabulary-quiz', component: VocabularyQuizPageComponent },
  { path: 'quotes', component: QuotesComponent },
];
