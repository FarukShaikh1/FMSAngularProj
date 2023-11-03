import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-confirmation-dialog',
  templateUrl: './confirmation-dialog.component.html',
  styleUrls: ['./confirmation-dialog.component.scss']
})
export class ConfirmationDialogComponent {

constructor(private dialog: MatDialog) { }

openConfirmationDialog(): void {
  const dialogRef = this.dialog.open(ConfirmationDialogComponent);

  dialogRef.afterClosed().subscribe(result => {
    if (result === true) {
      // User clicked "Yes" or confirmed
      // Place your logic here
    } else {
      // User clicked "No" or canceled
    }
  });
}

}
