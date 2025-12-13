import { CalendarPageComponent } from '@/pages/calendar-page/calendar-page.component';
import { TodoPageComponent } from '@/pages/todo-page/todo-page.component';
import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', component: TodoPageComponent },
  { path: 'calendar', component: CalendarPageComponent },
];
