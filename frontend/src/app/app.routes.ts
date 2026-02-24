import { Routes } from '@angular/router';
import { MessageListComponent } from './components/message-list/message-list';

export const routes: Routes = [
  { path: '', component: MessageListComponent },
  { path: '**', redirectTo: '' },
];
