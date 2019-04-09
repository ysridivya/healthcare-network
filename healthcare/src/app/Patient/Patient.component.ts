/*
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { PatientService } from './Patient.service';
import 'rxjs/add/operator/toPromise';

@Component({
  selector: 'app-patient',
  templateUrl: './Patient.component.html',
  styleUrls: ['./Patient.component.css'],
  providers: [PatientService]
})
export class PatientComponent implements OnInit {

  myForm: FormGroup;

  private allParticipants;
  private participant;
  private currentId;
  private errorMessage;

  PatientId = new FormControl('', Validators.required);
  Name = new FormControl('', Validators.required);
  Age = new FormControl('', Validators.required);
  Address = new FormControl('', Validators.required);
  phoneNumber = new FormControl('', Validators.required);


  constructor(public servicePatient: PatientService, fb: FormBuilder) {
    this.myForm = fb.group({
      PatientId: this.PatientId,
      Name: this.Name,
      Age: this.Age,
      Address: this.Address,
      phoneNumber: this.phoneNumber
    });
  };

  ngOnInit(): void {
    this.loadAll();
  }

  loadAll(): Promise<any> {
    const tempList = [];
    return this.servicePatient.getAll()
    .toPromise()
    .then((result) => {
      this.errorMessage = null;
      result.forEach(participant => {
        tempList.push(participant);
      });
      this.allParticipants = tempList;
    })
    .catch((error) => {
      if (error === 'Server error') {
        this.errorMessage = 'Could not connect to REST server. Please check your configuration details';
      } else if (error === '404 - Not Found') {
        this.errorMessage = '404 - Could not find API route. Please check your available APIs.';
        this.errorMessage = error;
      }
    });
  }

	/**
   * Event handler for changing the checked state of a checkbox (handles array enumeration values)
   * @param {String} name - the name of the participant field to update
   * @param {any} value - the enumeration value for which to toggle the checked state
   */
  changeArrayValue(name: string, value: any): void {
    const index = this[name].value.indexOf(value);
    if (index === -1) {
      this[name].value.push(value);
    } else {
      this[name].value.splice(index, 1);
    }
  }

	/**
	 * Checkbox helper, determining whether an enumeration value should be selected or not (for array enumeration values
   * only). This is used for checkboxes in the participant updateDialog.
   * @param {String} name - the name of the participant field to check
   * @param {any} value - the enumeration value to check for
   * @return {Boolean} whether the specified participant field contains the provided value
   */
  hasArrayValue(name: string, value: any): boolean {
    return this[name].value.indexOf(value) !== -1;
  }

  addParticipant(form: any): Promise<any> {
    this.participant = {
      $class: 'org1.healthcare.biznet.Patient',
      'PatientId': this.PatientId.value,
      'Name': this.Name.value,
      'Age': this.Age.value,
      'Address': this.Address.value,
      'phoneNumber': this.phoneNumber.value
    };

    this.myForm.setValue({
      'PatientId': null,
      'Name': null,
      'Age': null,
      'Address': null,
      'phoneNumber': null
    });

    return this.servicePatient.addParticipant(this.participant)
    .toPromise()
    .then(() => {
      this.errorMessage = null;
      this.myForm.setValue({
        'PatientId': null,
        'Name': null,
        'Age': null,
        'Address': null,
        'phoneNumber': null
      });
      this.loadAll(); 
    })
    .catch((error) => {
      if (error === 'Server error') {
        this.errorMessage = 'Could not connect to REST server. Please check your configuration details';
      } else {
        this.errorMessage = error;
      }
    });
  }


   updateParticipant(form: any): Promise<any> {
    this.participant = {
      $class: 'org1.healthcare.biznet.Patient',
      'Name': this.Name.value,
      'Age': this.Age.value,
      'Address': this.Address.value,
      'phoneNumber': this.phoneNumber.value
    };

    return this.servicePatient.updateParticipant(form.get('PatientId').value, this.participant)
    .toPromise()
    .then(() => {
      this.errorMessage = null;
      this.loadAll();
    })
    .catch((error) => {
      if (error === 'Server error') {
        this.errorMessage = 'Could not connect to REST server. Please check your configuration details';
      } else if (error === '404 - Not Found') {
        this.errorMessage = '404 - Could not find API route. Please check your available APIs.';
      } else {
        this.errorMessage = error;
      }
    });
  }


  deleteParticipant(): Promise<any> {

    return this.servicePatient.deleteParticipant(this.currentId)
    .toPromise()
    .then(() => {
      this.errorMessage = null;
      this.loadAll();
    })
    .catch((error) => {
      if (error === 'Server error') {
        this.errorMessage = 'Could not connect to REST server. Please check your configuration details';
      } else if (error === '404 - Not Found') {
        this.errorMessage = '404 - Could not find API route. Please check your available APIs.';
      } else {
        this.errorMessage = error;
      }
    });
  }

  setId(id: any): void {
    this.currentId = id;
  }

  getForm(id: any): Promise<any> {

    return this.servicePatient.getparticipant(id)
    .toPromise()
    .then((result) => {
      this.errorMessage = null;
      const formObject = {
        'PatientId': null,
        'Name': null,
        'Age': null,
        'Address': null,
        'phoneNumber': null
      };

      if (result.PatientId) {
        formObject.PatientId = result.PatientId;
      } else {
        formObject.PatientId = null;
      }

      if (result.Name) {
        formObject.Name = result.Name;
      } else {
        formObject.Name = null;
      }

      if (result.Age) {
        formObject.Age = result.Age;
      } else {
        formObject.Age = null;
      }

      if (result.Address) {
        formObject.Address = result.Address;
      } else {
        formObject.Address = null;
      }

      if (result.phoneNumber) {
        formObject.phoneNumber = result.phoneNumber;
      } else {
        formObject.phoneNumber = null;
      }

      this.myForm.setValue(formObject);
    })
    .catch((error) => {
      if (error === 'Server error') {
        this.errorMessage = 'Could not connect to REST server. Please check your configuration details';
      } else if (error === '404 - Not Found') {
        this.errorMessage = '404 - Could not find API route. Please check your available APIs.';
      } else {
        this.errorMessage = error;
      }
    });

  }

  resetForm(): void {
    this.myForm.setValue({
      'PatientId': null,
      'Name': null,
      'Age': null,
      'Address': null,
      'phoneNumber': null
    });
  }
}
