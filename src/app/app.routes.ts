import { Routes } from '@angular/router';
import { MainPage } from '@/pages/main-page';
import { authGuard } from './guards/auth-guard';
import { CreatePollPage } from './pages/create-poll-page';
import { PollDetailPage } from './pages/poll-detail-page';
import { LoginPage } from './pages/login-page';
import { RegisterPage } from './pages/register-page';
import { UserProfilePage } from './pages/user-profile-page';
import { UserProfilePollsPage } from './pages/user-profile-polls-page';
import { UserProfileCommentsPage } from './pages/user-profile-comments-page';
import { UserProfileLikedPage } from './pages/user-profile-liked-page';
import { UserProfileBookmarkPage } from './pages/user-profile-bookmark-page';

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
  {
    path: 'users/:id',
    component: UserProfilePage,
    children: [
      {
        path: 'polls',
        component: UserProfilePollsPage,
      },
      {
        path: 'comments',
        component: UserProfileCommentsPage,
      },
      {
        path: 'liked',
        component: UserProfileLikedPage,
      },
      {
        path: 'bookmark',
        component: UserProfileBookmarkPage,
      },
    ],
  },
];
