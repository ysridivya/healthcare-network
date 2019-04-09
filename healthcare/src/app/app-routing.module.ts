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

import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HomeComponent } from './home/home.component';

import { AppointmentComponent } from './Appointment/Appointment.component';
import { PatientReportComponent } from './PatientReport/PatientReport.component';
import { PrescriptionComponent } from './Prescription/Prescription.component';
import { LabReportComponent } from './LabReport/LabReport.component';

import { PatientComponent } from './Patient/Patient.component';
import { DoctorComponent } from './Doctor/Doctor.component';
import { HospitalComponent } from './Hospital/Hospital.component';
import { PharmacyComponent } from './Pharmacy/Pharmacy.component';
import { TestLabComponent } from './TestLab/TestLab.component';

import { CreateAppointmentComponent } from './CreateAppointment/CreateAppointment.component';
import { ResolveAppointmentComponent } from './ResolveAppointment/ResolveAppointment.component';
import { ProcessPrescriptionComponent } from './ProcessPrescription/ProcessPrescription.component';
import { GenerateLabReportComponent } from './GenerateLabReport/GenerateLabReport.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'Appointment', component: AppointmentComponent },
  { path: 'PatientReport', component: PatientReportComponent },
  { path: 'Prescription', component: PrescriptionComponent },
  { path: 'LabReport', component: LabReportComponent },
  { path: 'Patient', component: PatientComponent },
  { path: 'Doctor', component: DoctorComponent },
  { path: 'Hospital', component: HospitalComponent },
  { path: 'Pharmacy', component: PharmacyComponent },
  { path: 'TestLab', component: TestLabComponent },
  { path: 'CreateAppointment', component: CreateAppointmentComponent },
  { path: 'ResolveAppointment', component: ResolveAppointmentComponent },
  { path: 'ProcessPrescription', component: ProcessPrescriptionComponent },
  { path: 'GenerateLabReport', component: GenerateLabReportComponent },
  { path: '**', redirectTo: '' }
];

@NgModule({
 imports: [RouterModule.forRoot(routes)],
 exports: [RouterModule],
 providers: []
})
export class AppRoutingModule { }
