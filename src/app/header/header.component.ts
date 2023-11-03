import { Component } from '@angular/core';
import { Subject, Subscription } from 'rxjs';
import { GlobalService } from '../Services/global/global.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
  constructor(private globalService: GlobalService) {
    console.log('In header HeaderComponent constructor');
    
    this.subscription = this.globalService.getReloadObservable().subscribe(() => {
      console.log('in header Constructor getReloadObservable()');
      
      this.checkUserIsLoggedInOrNot();

    });
  }
  private subscription: Subscription;

  alreadyLoggedIn = true;
  ngOnInit() {
    console.log('In ngOnInit ');
    
    this.checkUserIsLoggedInOrNot();
  }

  checkUserIsLoggedInOrNot() {
    console.log('in checkUserIsLoggedInOrNot');
    
    if (localStorage.getItem('currentUser') == 'true') {
      this.alreadyLoggedIn = true;
    }
    else
      this.alreadyLoggedIn = false;
  }


}
