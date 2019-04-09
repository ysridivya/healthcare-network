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

import { AngularTestPage } from './app.po';
import { ExpectedConditions, browser, element, by } from 'protractor';
import {} from 'jasmine';


describe('Starting tests for healthcare', function() {
  let page: AngularTestPage;

  beforeEach(() => {
    page = new AngularTestPage();
  });

  it('website title should be healthcare', () => {
    page.navigateTo('/');
    return browser.getTitle().then((result)=>{
      expect(result).toBe('healthcare');
    })
  });

  it('network-name should be healthcare-network@0.0.19',() => {
    element(by.css('.network-name')).getWebElement()
    .then((webElement) => {
      return webElement.getText();
    })
    .then((txt) => {
      expect(txt).toBe('healthcare-network@0.0.19.bna');
    });
  });

  it('navbar-brand should be healthcare',() => {
    element(by.css('.navbar-brand')).getWebElement()
    .then((webElement) => {
      return webElement.getText();
    })
    .then((txt) => {
      expect(txt).toBe('healthcare');
    });
  });

  
    it('Appointment component should be loadable',() => {
      page.navigateTo('/Appointment');
      browser.findElement(by.id('assetName'))
      .then((assetName) => {
        return assetName.getText();
      })
      .then((txt) => {
        expect(txt).toBe('Appointment');
      });
    });

    it('Appointment table should have 5 columns',() => {
      page.navigateTo('/Appointment');
      element.all(by.css('.thead-cols th')).then(function(arr) {
        expect(arr.length).toEqual(5); // Addition of 1 for 'Action' column
      });
    });
  
    it('PatientReport component should be loadable',() => {
      page.navigateTo('/PatientReport');
      browser.findElement(by.id('assetName'))
      .then((assetName) => {
        return assetName.getText();
      })
      .then((txt) => {
        expect(txt).toBe('PatientReport');
      });
    });

    it('PatientReport table should have 5 columns',() => {
      page.navigateTo('/PatientReport');
      element.all(by.css('.thead-cols th')).then(function(arr) {
        expect(arr.length).toEqual(5); // Addition of 1 for 'Action' column
      });
    });
  
    it('Prescription component should be loadable',() => {
      page.navigateTo('/Prescription');
      browser.findElement(by.id('assetName'))
      .then((assetName) => {
        return assetName.getText();
      })
      .then((txt) => {
        expect(txt).toBe('Prescription');
      });
    });

    it('Prescription table should have 6 columns',() => {
      page.navigateTo('/Prescription');
      element.all(by.css('.thead-cols th')).then(function(arr) {
        expect(arr.length).toEqual(6); // Addition of 1 for 'Action' column
      });
    });
  
    it('LabReport component should be loadable',() => {
      page.navigateTo('/LabReport');
      browser.findElement(by.id('assetName'))
      .then((assetName) => {
        return assetName.getText();
      })
      .then((txt) => {
        expect(txt).toBe('LabReport');
      });
    });

    it('LabReport table should have 5 columns',() => {
      page.navigateTo('/LabReport');
      element.all(by.css('.thead-cols th')).then(function(arr) {
        expect(arr.length).toEqual(5); // Addition of 1 for 'Action' column
      });
    });
  

  
    it('Patient component should be loadable',() => {
      page.navigateTo('/Patient');
      browser.findElement(by.id('participantName'))
      .then((participantName) => {
        return participantName.getText();
      })
      .then((txt) => {
        expect(txt).toBe('Patient');
      });
    });

    it('Patient table should have 6 columns',() => {
      page.navigateTo('/Patient');
      element.all(by.css('.thead-cols th')).then(function(arr) {
        expect(arr.length).toEqual(6); // Addition of 1 for 'Action' column
      });
    });
  
    it('Doctor component should be loadable',() => {
      page.navigateTo('/Doctor');
      browser.findElement(by.id('participantName'))
      .then((participantName) => {
        return participantName.getText();
      })
      .then((txt) => {
        expect(txt).toBe('Doctor');
      });
    });

    it('Doctor table should have 7 columns',() => {
      page.navigateTo('/Doctor');
      element.all(by.css('.thead-cols th')).then(function(arr) {
        expect(arr.length).toEqual(7); // Addition of 1 for 'Action' column
      });
    });
  
    it('Hospital component should be loadable',() => {
      page.navigateTo('/Hospital');
      browser.findElement(by.id('participantName'))
      .then((participantName) => {
        return participantName.getText();
      })
      .then((txt) => {
        expect(txt).toBe('Hospital');
      });
    });

    it('Hospital table should have 3 columns',() => {
      page.navigateTo('/Hospital');
      element.all(by.css('.thead-cols th')).then(function(arr) {
        expect(arr.length).toEqual(3); // Addition of 1 for 'Action' column
      });
    });
  
    it('Pharmacy component should be loadable',() => {
      page.navigateTo('/Pharmacy');
      browser.findElement(by.id('participantName'))
      .then((participantName) => {
        return participantName.getText();
      })
      .then((txt) => {
        expect(txt).toBe('Pharmacy');
      });
    });

    it('Pharmacy table should have 3 columns',() => {
      page.navigateTo('/Pharmacy');
      element.all(by.css('.thead-cols th')).then(function(arr) {
        expect(arr.length).toEqual(3); // Addition of 1 for 'Action' column
      });
    });
  
    it('TestLab component should be loadable',() => {
      page.navigateTo('/TestLab');
      browser.findElement(by.id('participantName'))
      .then((participantName) => {
        return participantName.getText();
      })
      .then((txt) => {
        expect(txt).toBe('TestLab');
      });
    });

    it('TestLab table should have 3 columns',() => {
      page.navigateTo('/TestLab');
      element.all(by.css('.thead-cols th')).then(function(arr) {
        expect(arr.length).toEqual(3); // Addition of 1 for 'Action' column
      });
    });
  

  
    it('CreateAppointment component should be loadable',() => {
      page.navigateTo('/CreateAppointment');
      browser.findElement(by.id('transactionName'))
      .then((transactionName) => {
        return transactionName.getText();
      })
      .then((txt) => {
        expect(txt).toBe('CreateAppointment');
      });
    });
  
    it('ResolveAppointment component should be loadable',() => {
      page.navigateTo('/ResolveAppointment');
      browser.findElement(by.id('transactionName'))
      .then((transactionName) => {
        return transactionName.getText();
      })
      .then((txt) => {
        expect(txt).toBe('ResolveAppointment');
      });
    });
  
    it('ProcessPrescription component should be loadable',() => {
      page.navigateTo('/ProcessPrescription');
      browser.findElement(by.id('transactionName'))
      .then((transactionName) => {
        return transactionName.getText();
      })
      .then((txt) => {
        expect(txt).toBe('ProcessPrescription');
      });
    });
  
    it('GenerateLabReport component should be loadable',() => {
      page.navigateTo('/GenerateLabReport');
      browser.findElement(by.id('transactionName'))
      .then((transactionName) => {
        return transactionName.getText();
      })
      .then((txt) => {
        expect(txt).toBe('GenerateLabReport');
      });
    });
  

});