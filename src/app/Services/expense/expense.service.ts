import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs/internal/Observable';
import * as constants from '../../constants/constants';

@Injectable({
  providedIn: 'root'
})

export class ExpenseService {
  loggedInUserId: number;
  constructor(private http: HttpClient) {
    this.loggedInUserId = Number(localStorage.getItem("userId"));
  }

  getExpenseDetails(expenseId: number) {
    const params=new HttpParams()
    .set('userid', this.loggedInUserId)
    .set('expenseId', expenseId)        
    return this.http.get(constants.EXPENSEURL + 'getExpenseDetails',{params:params})
    
  }


    getExpenseSummaryList(fromDate:string, toDate:string,sourceOrReason:string,minAmount:number,maxAmount:number,
      modeOfTransaction:string): Observable<any> {
     const params=new HttpParams()
     .set('userid', this.loggedInUserId)
     .set('fromDate', fromDate)
     .set('toDate', toDate)
     .set('sourceOrReason',sourceOrReason)
     .set('minAmount', minAmount)
     .set('maxAmount', maxAmount)
     .set('modeOfTransaction', modeOfTransaction)

     return this.http.get(constants.EXPENSEURL + 'getExpenseSummaryList', {params:params});//?userid=' + this.loggedInUserId+'&searchText='+searchText+'&month='+month+'&dayType='+dayType);
   }
 
   getExpenseReportList(fromDate:string, toDate:string,sourceOrReason:string,minAmount:number,maxAmount:number,
    modeOfTransaction:string): Observable<any> {
   const params=new HttpParams()
   .set('userid', this.loggedInUserId)
   .set('fromDate', fromDate)
   .set('toDate', toDate)
   .set('sourceOrReason',sourceOrReason)
   .set('minAmount', minAmount)
   .set('maxAmount', maxAmount)
   .set('modeOfTransaction', modeOfTransaction)

   return this.http.get(constants.EXPENSEURL + 'getExpenseReportList', {params:params});//?userid=' + this.loggedInUserId+'&searchText='+searchText+'&month='+month+'&dayType='+dayType);
 }



   getExpenseList(fromDate:string, toDate:string,sourceOrReason:string,minAmount:number,maxAmount:number,
     modeOfTransaction:string): Observable<any> {
    const params=new HttpParams()
    .set('userid', this.loggedInUserId)
    .set('fromDate', fromDate)
    .set('toDate', toDate)
    .set('sourceOrReason',sourceOrReason)
    .set('minAmount', minAmount)
    .set('maxAmount', maxAmount)
    .set('modeOfTransaction', modeOfTransaction)
    
    return this.http.get(constants.EXPENSEURL + 'getExpenseList', {params:params});//?userid=' + this.loggedInUserId+'&searchText='+searchText+'&month='+month+'&dayType='+dayType);
  }

  addExpense(expenseDetailsForm: any): Observable<any> {
    return this.http.post(constants.EXPENSEURL + 'addExpense?userId=' + this.loggedInUserId, expenseDetailsForm);
  }

  updateExpense(expenseDetailsForm: any): Observable<any> {
    return this.http.post(constants.EXPENSEURL + 'updateExpense?userId=' + this.loggedInUserId, expenseDetailsForm);
  }

  deleteExpense(expenseId: number): Observable<any> {
    return this.http.get(constants.EXPENSEURL + 'deleteExpense?expenseId=' + expenseId + '&userId=' + Number(localStorage.getItem("userId")));
  }

  getSourceOrReasonList(fromDt:string='',toDt:string='',searchText:string=''):Observable<any>{
    const params=new HttpParams()
    .set('userid', this.loggedInUserId)
    .set('fromDate', fromDt)
    .set('toDate', toDt)
    .set('searchText', searchText)
    return this.http.get(constants.EXPENSEURL + 'GetSourceOrReasonList',{params:params});//?expenseId=' + expenseId + '&userId=' + Number(localStorage.getItem("userId")));

  }

  getDescriptionList(sourceText:string='',descriptionText:string=''):Observable<any>{
    const params=new HttpParams()
    .set('userid', this.loggedInUserId)
    .set('sourceText', sourceText)
    .set('descriptionText', descriptionText)
    return this.http.get(constants.EXPENSEURL + 'GetDescriptionList',{params:params});//?expenseId=' + expenseId + '&userId=' + Number(localStorage.getItem("userId")));

  }
  getPurposeList(sourceText:string='',purposeText:string=''):Observable<any>{
    const params=new HttpParams()
    .set('userid', this.loggedInUserId)
    .set('sourceText', sourceText)
    .set('purposeText', purposeText)
    return this.http.get(constants.EXPENSEURL + 'GetPurposeList',{params:params});//?expenseId=' + expenseId + '&userId=' + Number(localStorage.getItem("userId")));

  }

}
