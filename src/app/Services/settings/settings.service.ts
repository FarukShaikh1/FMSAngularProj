import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import * as constants from '../../constants/constants';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SettingsService {
  constructor(private http: HttpClient) {
    this.loggedInUserId = Number(localStorage.getItem("userId"));
  }
    loggedInUserId: number;

    getExpenseDetails(expenseId: number) {
      const params=new HttpParams()
      .set('userid', this.loggedInUserId)
      .set('expenseId', expenseId)        
      return this.http.get(constants.EXPENSEURL + 'getExpenseDetails',{params:params})
      
    }

    
  addExpense(expenseDetailsForm: any): Observable<any> {
    return this.http.post(constants.EXPENSEURL + 'addExpense?userId=' + this.loggedInUserId, expenseDetailsForm);
  }

  }
