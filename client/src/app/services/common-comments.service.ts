import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})

export class CommonCommentsService {

  constructor(private http: HttpClient) { }

  getCommonComments(id, type) {

    return new Promise((resolve, reject) => {
      this.http
        .post('/api/commonComments/getCommonComments', {
          id: id,
          type: type,
        })
        .subscribe(
          (res: any) => {
            return resolve(res);
          },
          err => reject(err),
        );
    });
  }

  postCommonComments(data) {

    return new Promise((resolve, reject) => {
      this.http
        .post('/api/commonComments/postCommonComments', data)
        .subscribe(
          (res: any) => {
            return resolve(res);
          },
          err => reject(err),
        );
    });

  }

}
