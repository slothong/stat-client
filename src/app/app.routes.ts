import { Routes } from '@angular/router';
import { MainPageComponent } from '@/pages/main-page/main-page';
import { CreatePollPage } from './pages/create-poll-page/create-poll-page';

export const routes: Routes = [
  {
    path: '',
    component: MainPageComponent,
  },
  {
    path: 'create-poll',
    component: CreatePollPage,
  },
];
