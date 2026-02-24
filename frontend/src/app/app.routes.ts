import { Routes } from '@angular/router';
import { MessageListComponent } from './components/message-list/message-list';
import { LoginComponent } from './components/login/login';
import { SignupComponent } from './components/signup/signup';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: '', component: MessageListComponent, canActivate: [authGuard] },
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent },
  { path: '**', redirectTo: '' },
];
