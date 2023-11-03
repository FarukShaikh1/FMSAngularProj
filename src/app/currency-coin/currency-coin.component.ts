import { Component } from '@angular/core';
import {MatButtonModule} from '@angular/material/button';
import {MatCardModule} from '@angular/material/card';
import { CurrencyCoinService } from '../Services/currency-coin/currency-coin.service';
import { HttpClient } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import {CurrencyCoinDetailsComponent} from '../currency-coin-details/currency-coin-details.component'
import * as constants from '../constants/constants';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { MatTableDataSource } from '@angular/material/table';
import {MatGridListModule} from '@angular/material/grid-list';
import {NgFor} from '@angular/common';

@Component({
  selector: 'app-currency',
  templateUrl: './currency-coin.component.html',
  styleUrls: ['./currency-coin.component.scss']
})
export class CurrencyCoinComponent {
  displayedColumns: string[] = [];
  imageList:any;
  dataSource: any;
  basePath:string=constants.ATTACHMENT;
  selectedTabIndex:number=0;
  sort: any;
  paginator: any;
  constructor(private _dialog: MatDialog,private _currencyCoinService : CurrencyCoinService){

  }

  
  ngOnInit() {
  this.selectedTabIndex=0;
  this.basePath = constants.ATTACHMENT;
    // window.location.reload();
    this.getCurrencyCoinRecords();

  }

  tabChange(data: MatTabChangeEvent) {
    this.setTabActive(data.index);
  }
  setTabActive(index: number) {
    this.selectedTabIndex = index;
  }
  
  getCurrencyCoinRecords() {
    this._currencyCoinService.getCurrencyCoinRecords().subscribe((res) => {
      this.displayedColumns = ['collectionCoinId', 'description', 'edit'];
      this.imageList = res;

      this.dataSource = new MatTableDataSource(res);
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
    },
    )
  }

  
  currencyCoinDetails(data: any) {
    const dialogRef = this._dialog.open(CurrencyCoinDetailsComponent, { data });
    console.log('in currencyCoinDetails data :',data);
    dialogRef.afterClosed().subscribe({
      next: (val) => {
        if (val) {
          this.getCurrencyCoinRecords();
        }
      }
    })
  }
}


