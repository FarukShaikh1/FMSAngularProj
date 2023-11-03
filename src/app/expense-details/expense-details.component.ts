import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms'
import { ExpenseService } from '../Services/expense/expense.service';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { GlobalService } from '../Services/global/global.service'
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-expense-details',
  templateUrl: './expense-details.component.html',
  styleUrls: ['./expense-details.component.scss'],
})

export class ExpenseDetailsComponent implements OnInit {
  [x: string]: any;
  startDate = new Date();
  // startDate = new Date(2001, 0, 1);
  expenseDetailsForm: FormGroup;
  sourceOrReasonList: any;
  descriptionList: any;
  purposeList: any;
  source: string = '';
  filteredOptions!: any;// Observable<string[]>;
  myControl = new FormControl('');
  customDateFormat = 'dd/MMM/yyyy';

  constructor(private _details: FormBuilder,
    private _expenseService: ExpenseService,
    private _httpClient: HttpClient,
    private route: ActivatedRoute,
    private router: Router,
    private expenseService: ExpenseService,
    private _globalService: GlobalService,
    private _dialogRef: MatDialogRef<ExpenseDetailsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private datepipe: DatePipe
  ) {

    this.expenseDetailsForm = this._details.group({
      // expenseId: 0,
      // // sourceOrReason: ['', [Validators.required, Validators.pattern(/^[a-zA-Z. ]{3,40}$/)]],
      // sourceOrReason: ['', Validators.required],
      // expenseDate: ['', Validators.required],
      // sbiAccount: 0,
      // cbiAccount: 0,
      // cash: 0,
      // otherAmount: 0,
      // description: '',
      // assetId: 0,
      expenseId: 0,
      expenseAuditId: 0,
      expenseDate: ['', Validators.required],
      sourceOrReason: ['', Validators.required],
      modeOfTransaction: '',
      transactionType: '',
      cash: '',
      sbiAccount: '',
      cbiAccount: '',
      otherAmount: '',
      totalAmount: '',
      cashBalance: 0,
      sbiBalance: 0,
      cbiBalance: 0,
      otherBalance: 0,
      totalAvailable: 0,
      credit: 0,
      debit: 0,
      amount: 0,
      isInvoiceAvailable: false,
      referenceNumber: '',
      description: '',
      purpose: '',
      assetType: '',
      expenseReceiptAssetId: 0,
      assetId: 0,
      noOfDays: 0,
      transactionStatus: '',
      transactionStatusId: 0,
      modifiedDate: '',

    })

    this.getSourceOrReasonList('', '', '');
    this.getPurposeList('', '');

  }
  // private _filter(value: string): string[] {
  //   const filterValue = value.toLowerCase();
  //   return this.sourceOrReasonList.filter((option: string) => option.toLowerCase().includes(filterValue));
  // }

  onSourceReasonChange(valueToFilter: any) {
    this.getSourceOrReasonList('', '', valueToFilter.target.value);
    this.getDescriptionList(valueToFilter.target.value, '')
    this.getPurposeList(valueToFilter.target.value, '')
  }


  onDescriptionChange(valueToFilter: any) {
    this.getDescriptionList('', valueToFilter.target.value)
  }

  onPurposeChange(valueToFilter: any) {
    this.getPurposeList('', valueToFilter.target.value)
  }

  ngOnInit(): void {
    this.expenseDetailsForm.controls['expenseDate'].patchValue(this.startDate);

    if (this.data) {
      if (isNaN(this.data)) {
        this.patchValues(this.data);

      }
      else {
        this.getExpenseDetails(this.data)
      }
    }
  }

  validateAmount(event: any) {
    // if (event.target.value.match(/^[0-9]{0,20}$/)) {
    if (event.key.match(/^[\D]$/) && event.key.match(/^[^\.\-]$/)) {
      event.preventDefault();
    }
  }

  // cbiAccountChange(event:any){

  // }

  // other(event:any){

  // }
  // cbiAccountChange(event:any){

  // }

  getSourceOrReasonList(fromDt: string = '', toDt: string = '', searchText: string = '') {
    this.expenseService.getSourceOrReasonList(fromDt, toDt, searchText).subscribe((res) => {
      this.sourceOrReasonList = res;
    },
    )

  }

  getDescriptionList(sourceText: string = '', descriptionText: string = '') {
    this.expenseService.getDescriptionList(sourceText, descriptionText).subscribe((res) => {
      this.descriptionList = res;
    },
    )
  }

  getPurposeList(sourceText: string = '', purposeText: string = '') {
    this.expenseService.getPurposeList(sourceText, purposeText).subscribe((res) => {
      this.purposeList = res;
    },
    )
  }

  getExpenseDetails(expenseId: number) {
    this.expenseService.getExpenseDetails(expenseId).subscribe((res: any) => {
      this.patchValues(res);

      // this.expenseDetailsForm.patchValue(res);

    })
  }

  patchValues(res: any) {
    this.expenseDetailsForm.controls['expenseId'].patchValue(res['ExpenseId']);
    this.expenseDetailsForm.controls['expenseDate'].patchValue(res['ExpenseDate']);
    this.expenseDetailsForm.controls['sourceOrReason'].patchValue(res['SourceOrReason']);
    this.expenseDetailsForm.controls['purpose'].patchValue(res['Purpose']);
    this.expenseDetailsForm.controls['description'].patchValue(res['Description']);
    this.expenseDetailsForm.controls['sbiAccount'].patchValue(res['SbiAccount']);
    this.expenseDetailsForm.controls['cash'].patchValue(res['Cash']);
    this.expenseDetailsForm.controls['otherAmount'].patchValue(res['OtherAmount']);
    this.expenseDetailsForm.controls['cbiAccount'].patchValue(res['CbiAccount']);
    this.expenseDetailsForm.controls['assetId'].patchValue(res['AssetId']);
  }
  sbiValid = false;
  cbiValid = false;
  cashValid = false;
  otherValid = false;

  submitExpenseDetails() {
    this.sbiValid = this.expenseDetailsForm.controls['sbiAccount'].value != 0 && this.expenseDetailsForm.controls['sbiAccount'].value != '';
    this.cbiValid = this.expenseDetailsForm.controls['cbiAccount'].value != 0 && this.expenseDetailsForm.controls['cbiAccount'].value != '';
    this.cashValid = this.expenseDetailsForm.controls['cash'].value != 0 && this.expenseDetailsForm.controls['cash'].value != '';
    this.otherValid = this.expenseDetailsForm.controls['otherAmount'].value != 0 && this.expenseDetailsForm.controls['otherAmount'].value != '';

    if (this.sbiValid || this.cbiValid || this.cashValid || this.otherValid) {
      if (!this.expenseDetailsForm.valid) {
        this._globalService.openSnackBar('Some issue is there');
        return;
      }
      else {
        try {
          const selectedDate = new Date(this.expenseDetailsForm.value['expenseDate']);
          // this.expenseDetailsForm.value['expenseDate'] = this.datepipe.transform(selectedDate, 'yyyy-MM-ddTHH:mm:ss');
          this.expenseDetailsForm.value['expenseDate'] = this.datepipe.transform(selectedDate, 'yyyy-MM-dd');

          if (this.expenseDetailsForm.value['expenseId'] > 0) {
            this._expenseService.updateExpense(this.expenseDetailsForm.value).subscribe((result) => {
              if (result) {
                this._globalService.openSnackBar('Record Updated Successfully');
                this._dialogRef.close(true);
              }
              else {
                this._globalService.openSnackBar('some issue is in update the data');
                return;
              }
            });
          }
          else {
            this._expenseService.addExpense(this.expenseDetailsForm.value).subscribe((result) => {
              if (result) {
                this._globalService.openSnackBar("Record added successfully");
                this._dialogRef.close(true);
              }
              else {
                this._globalService.openSnackBar('some issue is in adding the data');
                return;
              }
            });
          }
        } catch (error) {
          this._globalService.openSnackBar("Error in adding data : " + error);
          console.error("Error in adding data : ", error);
        }
      }
    }
    else {
      this._globalService.openSnackBar('Amount can not be blank or 0');
      return;
    }
  }



}