import { Routes } from '@angular/router';
import { MainPage } from '@/pages/main-page/main-page';
import { authGuard } from './guards/auth-guard';
import { CreatePollPage } from './pages/create-poll-page/create-poll-page';
import { PollDetailPage } from './pages/poll-detail-page/poll-detail-page';

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
  {
    path: 'polls/:id',
    component: PollDetailPage,
  },
];
