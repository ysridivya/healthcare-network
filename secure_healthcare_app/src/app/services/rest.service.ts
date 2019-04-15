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
      PatientId: data.fullname
    };
    return this.httpClient.post('http://localhost:3001/api/org1.healthcare.biznet.Patient', collector).toPromise()
    .then(() => {
      const identity = {
        // TODO: Add logic to generate unique ids.
        participant: 'org1.healthcare.biznet.Patient#' + data.fullname,
        userID: data.fullname,
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
      console.log('Importing the card into the wallet');
      headers.set('Content-Type', 'multipart/form-data');
      return this.httpClient.post('http://localhost:3000/api/wallet/import', formData, {
        withCredentials: true,
        headers
      }).toPromise();
    });
}
checkWallet() {
  return this.httpClient.get('http://localhost:3000/api/wallet', {withCredentials: true}).toPromise();
}

getCurrentUser() {
  return this.httpClient.get('http://localhost:3000/api/system/ping', {withCredentials: true}).toPromise()
    .then((data) => {
      return data['participant'];
    });
}


getAllDoctors(){
  return this.httpClient.get('http://localhost:3000/api/org1.healthcare.biznet.Doctor', {withCredentials: true})
}

getMyAppointment(){
  return this.httpClient.get('http://localhost:3000/api/org1.healthcare.biznet.Appointment', {withCredentials: true})
}

getAllPharmacy(){
  return this.httpClient.get('http://localhost:3000/api/org1.healthcare.biznet.Pharmacy', {withCredentials: true})
}

getLabs(){
  return this.httpClient.get('http://localhost:3000/api/org1.healthcare.biznet.TestLab', {withCredentials: true})
}
getAllHospitals(){
  return this.httpClient.get('http://localhost:3000/api/org1.healthcare.biznet.Hospital', {withCredentials: true})
}

getPatientLabReport(){
  return this.httpClient.get('http://localhost:3000/api/org1.healthcare.biznet.LabReport', {withCredentials: true})
}

getPatientPrescription(){
  return this.httpClient.get('http://localhost:3000/api/org1.healthcare.biznet.Prescription', {withCredentials: true})
}

getAllReports(){
  return this.httpClient.get('http://localhost:3000/api/org1.healthcare.biznet.PatientReport', {withCredentials: true})
}

createAppointment(data) {
  console.log('createapoointment called by the user' + data.byPatient)
  const collector = {
    $class : 'org1.healthcare.biznet.CreateAppointment',
    forDoctor : data.forDoctor,
    byPatient : data.byPatient,
    scheduleDate : '2019-10-14T16:33:24.409Z'

  };
  
  return this.httpClient.post('http://localhost:3001/api/org1.healthcare.biznet.CreateAppointment', collector).toPromise().then((opt) =>{
    console.log(opt);

  });
}

changeDoctor(data) {
  console.log("Change Doc called by " + data.PatientIdRef)
  const collector = {
    $class : 'org1.healthcare.biznet.ChangeOfDoctor',
    byPatient   : data.PatientIdRef,
    ReportId    : data.ReportId,
    newDoctorId : data.newDoctorId
  };
  console.log(collector)
  return this.httpClient.post('http://localhost:3001/api/org1.healthcare.biznet.ChangeOfDoctor', collector).toPromise().then((opt) =>{
    console.log(opt);

  });

}



}