import { Routes } from '@angular/router';
import { MainPage } from '@/pages/main-page';
import { authGuard } from './guards/auth-guard';
import { CreatePollPage } from './pages/create-poll-page';
import { PollDetailPage } from './pages/poll-detail-page';
import { LoginPage } from './pages/login-page';
import { RegisterPage } from './pages/register-page';

export const routes: Routes = [
  {
    path: '',
    component: MainPage,
  },
  {
    path: 'login',
    component: LoginPage,
  },
  {
    path: 'register',
    component: RegisterPage,
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
