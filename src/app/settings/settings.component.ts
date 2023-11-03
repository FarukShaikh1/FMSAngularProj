import { Component } from '@angular/core';
import { MatTabChangeEvent } from '@angular/material/tabs';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent {

  displayedColumns: string[] = [];
  dataSource:any;
  tabChange(data: MatTabChangeEvent) {

  }

  deleteData(id:number)
  {

  }
  EditDetails(data:any)
  {

  }
  
}
