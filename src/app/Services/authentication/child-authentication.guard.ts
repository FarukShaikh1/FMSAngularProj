import { inject } from '@angular/core';
import { CanActivateChildFn, Router } from '@angular/router';
import { GlobalService } from '../global/global.service';

export const childAuthenticationGuard: CanActivateChildFn = (childRoute, state) => {
  let router = inject(Router);
  let _globalService=inject(GlobalService)
  let isLoggedIn = localStorage.getItem('currentUser');

  if (isLoggedIn == 'true') {
    return true;
  }
  else {
    _globalService.openSnackBar("Please login before access the child")
    router.navigate(["../login/"]);//, this.data[0].UserId]);

    return false;
  }
};
