import { VocabularyPageComponent } from '@/pages/vocabulary-page/vocabulary-page.component';
import { TodoPageComponent } from '@/pages/todo-page/todo-page.component';
import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', component: TodoPageComponent },
  { path: 'vocabulary', component: VocabularyPageComponent },
];
