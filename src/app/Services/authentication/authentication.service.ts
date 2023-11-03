import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import * as constants from '../../constants/constants'
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  constructor(private http: HttpClient) { }

  login(userName: string, password: string) {
    return this.http.post<any>(constants.LOGINURL + 'authenticate', { userName, password }).pipe(map(user => {
      localStorage.setItem('currentUser', JSON.stringify(user))
      return user;
    })
    )
  }
}
