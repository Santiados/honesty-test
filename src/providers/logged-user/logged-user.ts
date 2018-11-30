import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { SQLiteObject } from '@ionic-native/sqlite';

import { UserProvider } from '../user/user';

/*
  Generated class for the LoggedUserProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class LoggedUserProvider {
  db: SQLiteObject = null;
  constructor(private userService: UserProvider) {
    console.log('Hello LoggedUserProvider Provider');
  }

  setDB(db: SQLiteObject) {
    if (this.db === null) {
      this.db = db;
    }
  }

  userLoggedTable() {
    let sql = 'CREATE TABLE IF NOT EXISTS users(id INTEGER PRIMARY KEY AUTOINCREMENT, username TEXT, password TEXT)';
    return this.db.executeSql(sql, []);
  }

  insertUsers(username,password){
    this.delete();
    console.log('borrada tabla');
    let sql = 'INSERT INTO users(username,password) VALUES(?,?)';
    return this.db.executeSql(sql,[username,password]);
  }

  delete(){
    let drop = 'DELETE from users';
    this.db.executeSql(drop,[]);
  }

  getLoggedUser() {
    let sql = 'SELECT * FROM users';
    return this.db.executeSql(sql, [])
    .then(response => {
      let tasks = [];
      for (let index = 0; index < response.rows.length; index++) {
        tasks.push( response.rows.item(index) );
      }
      return Promise.resolve( tasks );
    })
    .catch(error => Promise.reject(error));
  }


}
