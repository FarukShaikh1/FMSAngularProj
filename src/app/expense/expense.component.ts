import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ExpenseDetailsComponent } from '../expense-details/expense-details.component';
import { ExpenseService } from '../Services/expense/expense.service';
import { HttpClient } from '@angular/common/http';
import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { Dialog } from '@angular/cdk/dialog';
import { GlobalService } from '../Services/global/global.service'
import * as constants from '../constants/constants';
import { MatSelectChange } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { ThemePalette } from '@angular/material/core';
import { DatePipe } from '@angular/common';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { ConfirmationDialogComponent } from '../confirmation-dialog/confirmation-dialog.component';
import { CurrencyPipe } from '@angular/common';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';


export interface Task {
  name: string;
  completed: boolean;
  color: ThemePalette;
  subtasks?: Task[];
}

@Component({
  selector: 'app-expense',
  templateUrl: './expense.component.html',
  styleUrls: ['./expense.component.scss']
})

export class ExpenseComponent {
  displayedColumns: string[] = [];
  index: number = 0;
  dataSource!: any;
  // dataSource!: MatTableDataSource<any>;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  fromDate = new Date();
  toDate = new Date();
  fromDt: any;
  toDt: any;
  sourceOrReason: string = '';
  SpecificSourceOrReason: string = '';
  minAmount: number = 0;
  maxAmount: number = 0;
  modeOfTransaction: string = '';
  modeOfTransactionList: any
  searchText: string = '';
  sourceOrReasonList: any;
  amountStyle = "'color':'red'";
  event: any;
  selectedTabIndex = 0;

  constructor(private _dialog: MatDialog, private expenseService: ExpenseService, private _httpClient: HttpClient,
    private _globalService: GlobalService,
    private datepipe: DatePipe, private sanitizer: DomSanitizer) {
    this._httpClient.get(_globalService.getCommonListItems(constants.MODEOFTRANSACTION)).subscribe(res => {
      this.modeOfTransactionList = res;
    });
  }

  ngOnInit() {
    this.fromDate.setDate(this.toDate.getDate() - 62);
    this.fromDt = this.datepipe.transform(this.fromDate, 'MM-dd-yyyy');
    this.toDt = this.datepipe.transform(this.toDate, 'MM-dd-yyyy');
    this.getSourceOrReasonList();
  }

  getTotalCost() {
    return this.dataSource.map((t: { debit: any; }) => t.debit).reduce((credit: any, value: any) => credit + value, 0);
  }

  setTabActive(index: number) {
    this.selectedTabIndex = index;
    this.LoadGrid();
  }
  tabChange(data: MatTabChangeEvent) {
    this.setTabActive(data.index);
    this.SpecificSourceOrReason = '';
  }

  LoadGrid() {
    switch (this.selectedTabIndex) {
      case 0:
        this.getExpenseList();
        break;
      case 1:
        this.getExpenseSummaryList();
        break;
      case 2:
        this.getExpenseReportList();
        break;
    }
  }
  getSourceOrReasonList() {
    this.expenseService.getSourceOrReasonList(
      this.fromDt, this.toDt, this.sourceOrReason
    ).subscribe(
      (res) => {
        this.sourceOrReasonList = res;
        this.LoadGrid();
      },
    )
  }

  // getSourceOrReasonList() {
  //   const res = this.expenseService.getSourceOrReasonList(this.fromDt, this.toDt, this.sourceOrReason).toPromise();
  //     this.sourceOrReasonList = res;
  //     this.LoadGrid();
  // }

  onSourceOrReasonChange(valueToFilter: any) {
    this.sourceOrReason = valueToFilter.target.value;
    this.getSourceOrReasonList();
  }

  getExpenseList() {
    this.displayedColumns = ['expenseDate', 'sourceOrReason', 'description', 'modeOfTransaction', 'debit', 'credit', 'edit', 'delete'];
    if (this.SpecificSourceOrReason != '') {
      this.expenseService.getExpenseList(this.fromDt, this.toDt, this.SpecificSourceOrReason, this.minAmount, this.maxAmount, this.modeOfTransaction).subscribe((res) => {
        this.dataSource = new MatTableDataSource(res);
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
      },
      )
    }
    else {
      this.expenseService.getExpenseList(this.fromDt, this.toDt, this.sourceOrReason, this.minAmount, this.maxAmount, this.modeOfTransaction).subscribe((res) => {
        this.dataSource = new MatTableDataSource(res);
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
      },
      )
    }
  }

  getExpenseSummaryList() {
    // alert("fromDate : "+this.fromDt + "toDate : "+this.toDt +" source : "+this.sourceOrReason+" minAmount : "+ this.minAmount+" MaxAmount : "+this.maxAmount+" Mode : "+this.modeOfTransaction)
    this.displayedColumns = [
      'expenseDate', 'sourceOrReason', 'description', 'sbiAccount', 'cash', 'cbiAccount', 'other', 'totalAmount', 'sbiBalance', 'cashBalance', 'cbiBalance', 'otherBalance', 'totalAvailable', 'edit', 'delete'
    ];
    this.expenseService.getExpenseSummaryList(this.fromDt, this.toDt, this.sourceOrReason, this.minAmount, this.maxAmount, this.modeOfTransaction).subscribe((res) => {
      this.dataSource = new MatTableDataSource(res);
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
    },
    )
  }

  getExpenseReportList() {
    this.displayedColumns = ['firstDate', 'lastDate', 'sourceOrReason','purpose', 'takenAmount', 'givenAmount', 'totalAmount', 'details'];
    this.expenseService.getExpenseReportList(this.fromDt, this.toDt, this.sourceOrReason, this.minAmount, this.maxAmount, this.modeOfTransaction).subscribe((res) => {
      this.dataSource = new MatTableDataSource(res);
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
    },
    )
  }


  getExpenseListBySourceOrReason(sourceOrReason: string) {
    this.SpecificSourceOrReason = sourceOrReason;
    this.setTabActive(0);
  }

  expenseDetails(data: any) {
    const dialogRef = this._dialog.open(ExpenseDetailsComponent, { data });
    dialogRef.afterClosed().subscribe({
      next: (val) => {
        if (val) {
          this.LoadGrid();
        }
      }
    })
  }

  deleteExpense(data: number) {
    const dialogRef = this._dialog.open(ConfirmationDialogComponent, { data });

    dialogRef.afterClosed().subscribe(result => {
      if (result === true) {
        this.expenseService.deleteExpense(data).subscribe((res) => {
          if (res) {
            this._globalService.openSnackBar('Deleted successfully')
            this.LoadGrid();
          }
          else {
            this._globalService.openSnackBar('Some issue is there in deletion')
          }
        },
        )
      }
    });
  }

  addExpense(expense: any, user: any) {
    this.expenseService.addExpense(expense).subscribe((res) => {
      if (res) {
        this.LoadGrid();
      }
    },
    )
  }

  filterGridByFromDate(data: any) {
    // this.fromDate.setDate(data.value);
    // this.fromDate.setDate(this.fromDate.getDate());
    this.fromDate.setDate(data.value);
    this.fromDt = this.datepipe.transform(data.value, 'MM-dd-yyyy');
    this.getSourceOrReasonList();
  }

  filterGridByToDate(data: any) {
    this.toDt = this.datepipe.transform(data.value, 'MM-dd-yyyy');
    this.getSourceOrReasonList();
  }

  filterGridByMaxAmount(data: any) {
    this.maxAmount = data.target.value;
    this.LoadGrid();
  }

  filterGridByMinAmount(data: any) {
    this.minAmount = data.target.value;
    this.LoadGrid();
  }

  filterGridBySource(data: any) {
    if (data.source != null && data.source != undefined) {
      this.sourceOrReason = data.source.value;
    }
    else if (data.value != null && data.value != undefined) {
      this.sourceOrReason = data.source.value;
    }
    this.LoadGrid();
  }
  //   filterGridBySource(data: MatSelectChange) {
  //   this.sourceOrReason = data.value;
  //   this.LoadGrid();
  // }

  filterGridByMode(data: MatSelectChange) {
    this.modeOfTransaction = data.value;
    this.LoadGrid();
  }

  filterGridBySearch(data: any) {
    this.searchText = data.target.value;
    this.LoadGrid();
  }

  getColorForAmount(amount: any): any {
    if (amount <= 0) {
      return { 'color': '#FF0000', 'font-weight': 'bold' };
    }
    else {
      return { 'color': '#129D0A', 'font-weight': 'bold' };
    }
  }

  getColorForText(col: any): any {
    if (col.toLowerCase().includes('emergency')) {
      return { 'color': '#FF0000', 'font-weight': 'bold' };
    }
    else if (col.toLowerCase().includes('return')) {
      return { 'color': '#129D0A', 'font-weight': 'bold' };
    }
    else if (col.toLowerCase().includes('recharge')) {
      return { 'color': '#F29D0A', 'font-weight': 'bold' };
    }
    else
      return {}; // Default style (no style)
  }

  validateAmount(event: any) {
    // if (event.target.value.match(/^[0-9]{0,20}$/)) {
    if (event.key.match(/^[\D]$/) && event.key.match(/^[^\.\-]$/)) {
      event.preventDefault();
    }
  }


}


