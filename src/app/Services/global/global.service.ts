import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GlobalService {

  constructor(private _snackBar: MatSnackBar) { }

  openSnackBar(message: string, action: string = 'Ok', duration: number = 10000) {
    this._snackBar.open(message, action, {
      horizontalPosition: 'center',
      verticalPosition: 'top',
      duration: 1000
    });
  }

  getCommonListItems(commonListId: number) {
    // alert(commonListId)
    return 'https://localhost:7069/api/common/getCommonListItems?commonListId=' + commonListId;
  }

  private reloadSubject = new Subject<void>();

  getReloadObservable() {
    console.log('In global getReloadObservable()');
    return this.reloadSubject.asObservable();
  }

  reloadComponent() {
    console.log('In global reloadComponent()');
    this.reloadSubject.next();
  }


}
