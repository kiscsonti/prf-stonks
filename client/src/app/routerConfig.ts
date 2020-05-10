import { Routes } from '@angular/router';
import { HomePageComponent } from './components/home-page/home-page.component';
import { RegisterPageComponent } from './components/register-page/register-page.component';
import { LoginPageComponent } from './components/login-page/login-page.component';
import { RecordsPageComponent } from './components/records-page/records-page.component';
import { AuthenticationGuardService } from './services/authentication-guard.service';
import {InsightsPageComponent} from './components/insights-page/insights-page.component';

const appRoutes: Routes = [
  { path: '',
    component: HomePageComponent,
    data: { animation: 'home' }
  },
  {
    path: 'register',
    component: RegisterPageComponent,
    data: { animation: 'register' }
  },
  {
    path: 'login',
    component: LoginPageComponent,
    data: { animation: 'login' }
  },
  {
    path: 'records',
    component: RecordsPageComponent,
    canActivate: [AuthenticationGuardService],
    data: { animation: 'records' }
  },
  {
    path: 'insights',
    component: InsightsPageComponent,
    canActivate: [AuthenticationGuardService],
    data: { animation: 'insights' }
  },
  {
    path: '**',
    redirectTo: '/insights'
  }
];
export default appRoutes;
