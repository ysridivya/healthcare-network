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
import { GenerateLabReportService } from './GenerateLabReport.service';
import 'rxjs/add/operator/toPromise';

@Component({
  selector: 'app-generatelabreport',
  templateUrl: './GenerateLabReport.component.html',
  styleUrls: ['./GenerateLabReport.component.css'],
  providers: [GenerateLabReportService]
})
export class GenerateLabReportComponent implements OnInit {

  myForm: FormGroup;

  private allTransactions;
  private Transaction;
  private currentId;
  private errorMessage;

  testNames = new FormControl('', Validators.required);
  byDoctor = new FormControl('', Validators.required);
  ofPatient = new FormControl('', Validators.required);
  fromLab = new FormControl('', Validators.required);
  transactionId = new FormControl('', Validators.required);
  timestamp = new FormControl('', Validators.required);


  constructor(private serviceGenerateLabReport: GenerateLabReportService, fb: FormBuilder) {
    this.myForm = fb.group({
      testNames: this.testNames,
      byDoctor: this.byDoctor,
      ofPatient: this.ofPatient,
      fromLab: this.fromLab,
      transactionId: this.transactionId,
      timestamp: this.timestamp
    });
  };

  ngOnInit(): void {
    this.loadAll();
  }

  loadAll(): Promise<any> {
    const tempList = [];
    return this.serviceGenerateLabReport.getAll()
    .toPromise()
    .then((result) => {
      this.errorMessage = null;
      result.forEach(transaction => {
        tempList.push(transaction);
      });
      this.allTransactions = tempList;
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

	/**
   * Event handler for changing the checked state of a checkbox (handles array enumeration values)
   * @param {String} name - the name of the transaction field to update
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
   * only). This is used for checkboxes in the transaction updateDialog.
   * @param {String} name - the name of the transaction field to check
   * @param {any} value - the enumeration value to check for
   * @return {Boolean} whether the specified transaction field contains the provided value
   */
  hasArrayValue(name: string, value: any): boolean {
    return this[name].value.indexOf(value) !== -1;
  }

  addTransaction(form: any): Promise<any> {
    this.Transaction = {
      $class: 'org1.healthcare.biznet.GenerateLabReport',
      'testNames': this.testNames.value,
      'byDoctor': this.byDoctor.value,
      'ofPatient': this.ofPatient.value,
      'fromLab': this.fromLab.value,
      'transactionId': this.transactionId.value,
      'timestamp': this.timestamp.value
    };

    this.myForm.setValue({
      'testNames': null,
      'byDoctor': null,
      'ofPatient': null,
      'fromLab': null,
      'transactionId': null,
      'timestamp': null
    });

    return this.serviceGenerateLabReport.addTransaction(this.Transaction)
    .toPromise()
    .then(() => {
      this.errorMessage = null;
      this.myForm.setValue({
        'testNames': null,
        'byDoctor': null,
        'ofPatient': null,
        'fromLab': null,
        'transactionId': null,
        'timestamp': null
      });
    })
    .catch((error) => {
      if (error === 'Server error') {
        this.errorMessage = 'Could not connect to REST server. Please check your configuration details';
      } else {
        this.errorMessage = error;
      }
    });
  }

  updateTransaction(form: any): Promise<any> {
    this.Transaction = {
      $class: 'org1.healthcare.biznet.GenerateLabReport',
      'testNames': this.testNames.value,
      'byDoctor': this.byDoctor.value,
      'ofPatient': this.ofPatient.value,
      'fromLab': this.fromLab.value,
      'timestamp': this.timestamp.value
    };

    return this.serviceGenerateLabReport.updateTransaction(form.get('transactionId').value, this.Transaction)
    .toPromise()
    .then(() => {
      this.errorMessage = null;
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

  deleteTransaction(): Promise<any> {

    return this.serviceGenerateLabReport.deleteTransaction(this.currentId)
    .toPromise()
    .then(() => {
      this.errorMessage = null;
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

    return this.serviceGenerateLabReport.getTransaction(id)
    .toPromise()
    .then((result) => {
      this.errorMessage = null;
      const formObject = {
        'testNames': null,
        'byDoctor': null,
        'ofPatient': null,
        'fromLab': null,
        'transactionId': null,
        'timestamp': null
      };

      if (result.testNames) {
        formObject.testNames = result.testNames;
      } else {
        formObject.testNames = null;
      }

      if (result.byDoctor) {
        formObject.byDoctor = result.byDoctor;
      } else {
        formObject.byDoctor = null;
      }

      if (result.ofPatient) {
        formObject.ofPatient = result.ofPatient;
      } else {
        formObject.ofPatient = null;
      }

      if (result.fromLab) {
        formObject.fromLab = result.fromLab;
      } else {
        formObject.fromLab = null;
      }

      if (result.transactionId) {
        formObject.transactionId = result.transactionId;
      } else {
        formObject.transactionId = null;
      }

      if (result.timestamp) {
        formObject.timestamp = result.timestamp;
      } else {
        formObject.timestamp = null;
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
      'testNames': null,
      'byDoctor': null,
      'ofPatient': null,
      'fromLab': null,
      'transactionId': null,
      'timestamp': null
    });
  }
}
