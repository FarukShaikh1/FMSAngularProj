import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HeaderComponent } from './header/header.component';
import { LoginComponent } from './login/login.component';
import { DayComponent } from './day/day.component';
import { DayDetailsComponent } from './day-details/day-details.component';
import { ExpenseComponent } from './expense/expense.component';
import { ExpenseDetailsComponent } from './expense-details/expense-details.component';
import { authenticationGuard } from './Services/authentication/authentication.guard';
import { childAuthenticationGuard } from './Services/authentication/child-authentication.guard';
import { LogoutComponent } from './logout/logout.component';
import { SettingsComponent } from './settings/settings.component';
import { CurrencyCoinComponent } from './currency-coin/currency-coin.component';
import { CurrencyCoinDetailsComponent } from './currency-coin-details/currency-coin-details.component';

const routes: Routes = [
  { path: 'header', component: HeaderComponent },
  { path: 'login', component: LoginComponent },
  { path: 'logout', component: LogoutComponent },
  {
    path: 'day',canActivateChild:[childAuthenticationGuard],
    children: [
      { path: '', component: DayComponent },
      { path: 'day-details', component: DayDetailsComponent },
    ]
  },
  { path: 'expense', component: ExpenseComponent },
  { path: 'expense-details', component: ExpenseDetailsComponent },
  { path: 'currency-coin', component: CurrencyCoinComponent },
  { path: 'currency-coin-details', component: CurrencyCoinDetailsComponent },
  { path:'settings',component:SettingsComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
