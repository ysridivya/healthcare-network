import {Asset} from './org.hyperledger.composer.system';
import {Participant} from './org.hyperledger.composer.system';
import {Transaction} from './org.hyperledger.composer.system';
import {Event} from './org.hyperledger.composer.system';
// export namespace org1.healthcare.biznet{
   export class Appointment extends Asset {
      appointmentId: string;
      appointmentTime: string;
      byPatient: Patient;
      forDoctor: Doctor;
   }
   export class PatientReport extends Asset {
      reportId: string;
      ownerPatient: Patient;
      creatingDoctor: Doctor;
      reportMessage: string;
   }
   export class Prescription extends Asset {
      receiptId: string;
      forPatient: Patient;
      byDoctor: Doctor;
      toPharmacy: Pharmacy;
      PrescriptionText: string;
   }
   export class LabReport extends Asset {
      reportID: string;
      ofPatient: Patient;
      byLab: TestLab;
      forDoctor: Doctor;
   }
   export enum ReportType {
      DoctorReport,
      LabReport,
      Prescription,
   }
   export class Patient extends Participant {
      PatientId: string;
      Name: string;
      Age: string;
      Address: string;
      phoneNumber: string;
   }
   export class Doctor extends Participant {
      DoctorId: string;
      Name: string;
      Age: string;
      Address: string;
      phoneNumber: string;
      employedBy: Hospital;
   }
   export class Hospital extends Participant {
      HospitalId: string;
      Name: string;
   }
   export class Pharmacy extends Participant {
      pharmacyId: string;
      pharmacyName: string;
   }
   export class TestLab extends Participant {
      labId: string;
      labName: string;
   }
   export class CreateAppointment extends Transaction {
      forDoctor: string;
      byPatient: string;
   }
   export class ResolveAppointment extends Transaction {
      appointment: Appointment;
      doctorId: string;
      reportMessage: string;
      PrescriptionText: string;
      pharmacyId: string;
   }
   export class ProcessPrescription extends Transaction {
      toProcessPrescription: Prescription;
      forPatient: Patient;
      byDoctor: Doctor;
   }
   export class GenerateLabReport extends Transaction {
      testNames: string;
      byDoctor: Doctor;
      ofPatient: Patient;
      fromLab: TestLab;
   }
   export class AppointmentEvent extends Event {
      new_appointment: Appointment;
      forDoctor: string;
      byPatient: string;
   }
// }
