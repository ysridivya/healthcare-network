import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class RestService {

  constructor(private httpClient: HttpClient) {
  }
  signUp(data) {
    const collector = {
      $class: 'org1.healthcare.biznet.Patient',
      Name:data.fullname,
      Age: data.age,
      Address: data.address,
      phoneNumber: data.phone,
      id: data.fullname
    };
    return this.httpClient.post('http://localhost:3001/api/org1.healthcare.biznet.Patient', collector).toPromise()
    .then(() => {
      const identity = {
        participant: 'org1.healthcare.biznet.Patient#' + data.id,
        userID: data.id,
        options: {}
      };

      return this.httpClient.post('http://localhost:3001/api/system/identities/issue', identity, {responseType: 'blob'}).toPromise();
    })
    .then((cardData) => {
    console.log('CARD-DATA', cardData);
      const file = new File([cardData], 'myCard.card', {type: 'application/octet-stream', lastModified: Date.now()});

      const formData = new FormData();
      formData.append('card', file);

      const headers = new HttpHeaders();
      headers.set('Content-Type', 'multipart/form-data');
      return this.httpClient.post('http://localhost:3000/api/wallet/import', formData, {
        withCredentials: true,
        headers
      }).toPromise();
    });
}

}
