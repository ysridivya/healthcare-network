// import {today,timeNow,getPatient} from 'helper';

const d = new Date();
function today() {
    return ((d.getDate() < 10) ? "0" : "") + d.getDate() + "/" + (((d.getMonth() + 1) < 10) ? "0" : "") + (d.getMonth() + 1) + "/" + d.getFullYear();
}

function timeNow() {
    return ((d.getHours() < 10) ? "0" : "") + d.getHours() + ":" + ((d.getMinutes() < 10) ? "0" : "") + d.getMinutes() + ":" + ((d.getSeconds() < 10) ? "0" : "") + d.getSeconds();
}

/**
 * Buy card transaction
 * @param {org1.healthcare.biznet.CreateAppointment} appointment
 * @transaction
 */

async function processAppointment(appointment){
    console.log("processAppointment: Start");
    // Get factory for creating new instance
    var datetime = today() + " @ " + timeNow();
    var factory = getFactory();
    var new_appointment = factory.newResource('org1.healthcare.biznet','Appointment',datetime+appointment.byPatient);
    
    new_appointment.appointmentTime = datetime;
    try{
        var patientParticipantRegistry =await getParticipantRegistry('org1.healthcare.biznet.Patient');
        var find_patient = await patientParticipantRegistry.get(appointment.byPatient);
        console.log("processAppointment: Got patient "+find_patient.Name);
        var doctorParticipantRegistry = await getParticipantRegistry('org1.healthcare.biznet.Doctor');
        var find_doctor = await doctorParticipantRegistry.get(appointment.forDoctor);
        console.log("processAppointment: Got doctor "+find_doctor.Name);
    } catch (err) {
        console.log("processAppointment Error : "+err.message);
        return;
    }
    
    new_appointment.byPatient = find_patient;
    new_appointment.forDoctor = find_doctor;
    new_appointment.completed = false

    let appointmentRegistry = await getAssetRegistry('org1.healthcare.biznet.Appointment');
    await appointmentRegistry.add(new_appointment);

    console.log("processAppointment: Added to registry");
    let event = getFactory().newEvent('org1.healthcare.biznet', 'AppointmentEvent');
    event.new_appointment = new_appointment;
    event.byPatient = appointment.byPatient;
    event.forDoctor = appointment.forDoctor;
    emit(event);
    // Have to add more to it
}

/**
 * Buy card transaction
 * @param {org1.healthcare.biznet.ResolveAppointment} res_appointment
 * @transaction
 */

async function processResolveAppointment(res_appointment){
    console.log("processResolveAppointment: Start");
    try{
        if((res_appointment.appointment.forDoctor.DoctorId != res_appointment.doctorId) || (res_appointment.appointment.completed != false) ) {
            console.log("processResolveAppointment Error: Doctor mismatch");
            return;
        }
    
        console.log("processResolveAppointment: Doctor Verified");

        var factory = getFactory();
        var new_report = factory.newResource('org1.healthcare.biznet','PatientReport',"P"+res_appointment.appointment.byPatient.PatiesntId+"A"+res_appointment.appointment.appointmentId);
        var new_prescription = factory.newResource('org1.healthcare.biznet','Prescription',"P"+res_appointment.appointment.byPatient.PatientId+"A"+res_appointment.appointment.appointmentId);
    
        console.log("processResolveAppointment: Entries Created in registry");
    
        new_report.ownerPatient = res_appointment.appointment.byPatient;
        new_report.creatingDoctor = res_appointment.appointment.forDoctor;
        new_report.reportMessage = res_appointment.reportMessage;
        let reportRegistry = await getAssetRegistry('org1.healthcare.biznet.PatientReport');
        
    
        new_prescription.forPatient = res_appointment.appointment.byPatient;
        new_prescription.byDoctor = res_appointment.appointment.forDoctor;
        var pharmacyParticipantRegistry = await getParticipantRegistry('org1.healthcare.biznet.Pharmacy');
        new_prescription.toPharmacy = await pharmacyParticipantRegistry.get(res_appointment.pharmacyId);
        new_prescription.PrescriptionText = res_appointment.PrescriptionText;
        let prescriptionRegistry = await getAssetRegistry('org1.healthcare.biznet.Prescription');

        await reportRegistry.add(new_report);
        console.log("processResolveAppointment: Report Filled");
        await prescriptionRegistry.add(new_prescription);
        console.log("processResolveAppointment: Prescription Filled");
        let appointmentRegistry = await getAssetRegistry('org1.healthcare.biznet.Appointment');
        res_appointment.appointment.completed = true;
        await appointmentRegistry.update(res_appointment.appointment);
    } 
    catch (err) {
        console.log("processResolveAppointment Error : "+err.message);
        return;
    }
}