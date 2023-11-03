import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { DayDetailsComponent } from '../day-details/day-details.component';
import { DayService } from '../Services/day/day.service';
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
import { ConfirmationDialogComponent } from '../confirmation-dialog/confirmation-dialog.component';


export interface Task {
  name: string;
  completed: boolean;
  color: ThemePalette;
  subtasks?: Task[];
}

@Component({
  selector: 'app-day',
  templateUrl: './day.component.html',
  styleUrls: ['./day.component.scss']
})

export class DayComponent {
  displayedColumns: string[] = ['birthdate', 'personName', 'emailId', 'address', 'mobileNumber', 'type', 'approve','edit','delete'];
  //    'contactNumber', 'isVerified', 'dayTypeId', 'type', 'createdBy', 'createdOn', 'isRestricted', 'isDeleted', 'isEditable', 'isApprovable'];
  //, 'personName', 'emailId', 'assetId', 'superAdminRelationId', 'relationShipName',

  index: number = 0;
  dataSource!: MatTableDataSource<any>;
  // allowed: boolean = false;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  monthList: any;
  dayTypeList: any = '';
  month: any = '';
  dayType: any = '';
  searchText: string = '';
  isToday: boolean = false;
  isTomorrow: boolean = false;
  isYesterday: boolean = false;
  selectedData!: { value: any; text: any; };
  constructor(private _dayService: DayService, private _globalService: GlobalService,
     private dialog: MatDialog,private _dialog: MatDialog,private _httpClient: HttpClient
  ) {
    this._httpClient.get(_globalService.getCommonListItems(constants.MONTH)).subscribe(res => {
      this.monthList = res;
    });

    this._httpClient.get(_globalService.getCommonListItems(constants.DAYTYPE)).subscribe(res => {
      this.dayTypeList = res;
    });

  }


  ngOnInit() {
    // window.location.reload();
    this.getDayList();
  }

  getDayList() {
    this._dayService.getDayList(this.month, this.dayType, this.searchText, this.isToday, this.isTomorrow, this.isYesterday).subscribe((res) => {
      this.dataSource = new MatTableDataSource(res);
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
    },
    )
  }

  dayDetails(data: any) {
    const dialogRef = this._dialog.open(DayDetailsComponent, { data });
    dialogRef.afterClosed().subscribe({
      next: (val) => {
        if (val) {
          this.getDayList();
        }
      }
    })
  }


  deleteDay(dayId: number) {

    const dialogRef = this.dialog.open(ConfirmationDialogComponent);

    dialogRef.afterClosed().subscribe(result => {
      if (result === true) {
        this._dayService.deleteDay(dayId).subscribe((res) => {
          if (res) {
            this._globalService.openSnackBar('Deleted successfully')
            this.getDayList();
          }
        },
        )
      }
      else {
            this._globalService.openSnackBar('Some issue is there in deletion')
            // User clicked "No" or canceled
      }
    });


  }

  addDay(day: any, user: any) {
    this._dayService.addDay(day).subscribe((res) => {
      if (res) {
        this.getDayList();
      }
    },
    )
  }


  filterGridByMonth(data: MatSelectChange) {
    // this.selectedData = {
    //   value: data.value,
    //   text: data.source.triggerValue
    // };
    this.month = data.value;
    this.getDayList();
  }

  filterGridByType(data: any) {
    this.dayType = data;
    this.getDayList();
  }

  filterGridSearchText(data: any) {
    this.searchText = data.target.value;
    this.getDayList();
  }


  task: Task = {
    name: 'Show all records',
    completed: false,
    color: 'primary',
    subtasks: [
      { name: 'Today', completed: false, color: 'primary' },
      { name: 'Yesterday', completed: false, color: 'primary' },
      { name: 'Tomorrow', completed: false, color: 'primary' },
    ],
  };
  allComplete: boolean = false;

  updateAllComplete() {
    this.allComplete = this.task.subtasks != null && this.task.subtasks.every(t => t.completed);

    this.isToday = (this.task.subtasks != null && this.task.subtasks[0].completed);//(t => t.completed);
    this.isYesterday = (this.task.subtasks != null && this.task.subtasks[1].completed);//(t => t.completed);
    this.isTomorrow = (this.task.subtasks != null && this.task.subtasks[2].completed);//(t => t.completed);


    this.getDayList();

  }

  someComplete(): boolean {
    this.isToday = (this.task.subtasks != null && this.task.subtasks[0].completed);//(t => t.completed);
    this.isTomorrow = (this.task.subtasks != null && this.task.subtasks[1].completed);//(t => t.completed);
    this.isYesterday = (this.task.subtasks != null && this.task.subtasks[2].completed);//(t => t.completed);
    if (this.task.subtasks == null) {
      return false;
    }
    return this.task.subtasks.filter(t => t.completed).length > 0 && !this.allComplete;
  }

  setAll(completed: boolean) {
    this.allComplete = completed;
    if (this.task.subtasks == null) {
      return;
    }
    this.task.subtasks.forEach(t => (t.completed = completed));
    this.isToday = (this.task.subtasks != null && this.task.subtasks[0].completed);//(t => t.completed);
    this.isTomorrow = (this.task.subtasks != null && this.task.subtasks[1].completed);//(t => t.completed);
    this.isYesterday = (this.task.subtasks != null && this.task.subtasks[2].completed);//(t => t.completed);

    this.getDayList();
  }
}


// applyFilter(event: Event) {
//   const filterValue = (event.target as HTMLInputElement).value;
//   this.dataSource.filter = filterValue.trim().toLowerCase();

//   if (this.dataSource.paginator) {
//     this.dataSource.paginator.firstPage();
//   }
// }




