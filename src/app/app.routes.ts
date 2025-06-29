import { Routes } from '@angular/router';
import { MainPage } from '@/pages/main-page/main-page';
import { CreatePollPage } from './pages/create-poll-page/create-poll-page';
import { authGuard } from './guards/auth-guard';

export const routes: Routes = [
  {
    path: '',
    component: MainPage,
  },
  {
    path: 'create-poll',
    component: CreatePollPage,
    canActivate: [authGuard],
  },
];
