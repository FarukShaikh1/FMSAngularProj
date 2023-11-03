import { Injectable } from '@angular/core';
import * as constants from '../../constants/constants';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class UserServiceService {
  constructor(private http:HttpClient){}

  getUser(user:any) {
    return this.http.get(constants.USERURL +'getUser?username='+user.username+'&password='+user.password);
  }

  getUserByUserId(id: number) {
    return constants.USERURL + 'getUserByUserId?userId=' + id;
  }

  getUserList() {
    return constants.USERURL + 'getUserList';
  }
  
}
