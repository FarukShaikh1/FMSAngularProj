import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { GlobalService } from '../Services/global/global.service';

@Component({
  selector: 'app-logout',
  templateUrl: './logout.component.html',
  styleUrls: ['./logout.component.scss']
})
export class LogoutComponent {
  constructor(private router: Router, private _globalService: GlobalService) { }

  ngOnInit() {
    this._globalService.openSnackBar("Log out successfully");
    localStorage.setItem("currentUser", "false");
    localStorage.setItem("userName",'')
    localStorage.setItem("userId",'')
    this.reload();

    this.router.navigate(["login"]);//, this.data[0].UserId]);
  }
  reload() {
    this._globalService.reloadComponent();
  }

}
