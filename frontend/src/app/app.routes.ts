import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { SubscriptionsComponent } from './pages/subscriptions/subscriptions.component';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/sign-in',
    pathMatch: 'full'
  },
  {
    path: 'sign-in',
    component: LoginComponent
  },
  {
    path: 'sign-up',
    component: RegisterComponent
  },
  {
    path: 'subscriptions',
    component: SubscriptionsComponent,
    canActivate: [authGuard]
  },
  {
    path: '**',
    redirectTo: '/sign-in'
  }
];