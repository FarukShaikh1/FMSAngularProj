import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { GlobalService } from '../global/global.service';

export const authenticationGuard: CanActivateFn = (route, state) => {
  let router = inject(Router);
  let _globalService=inject(GlobalService)

  let isLoggedIn = localStorage.getItem('currentUser');
  if (isLoggedIn == 'true') {
    return true;
  }
  else {
    _globalService.openSnackBar("Please login before access the site")
    router.navigate(["../login/"]);//, this.data[0].UserId]);

    return false;
  }
};


