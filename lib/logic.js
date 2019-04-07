// import {today,timeNow,getPatient} from 'helper';

const d = new Date();
function today() {
    return ((d.getDate() < 10) ? "0" : "") + d.getDate() + "/" + (((d.getMonth() + 1) < 10) ? "0" : "") + (d.getMonth() + 1) + "/" + d.getFullYear();
}

function timeNow() {
    return ((d.getHours() < 10) ? "0" : "") + d.getHours() + ":" + ((d.getMinutes() < 10) ? "0" : "") + d.getMinutes() + ":" + ((d.getSeconds() < 10) ? "0" : "") + d.getSeconds();
}

function getPatient(id) {
    // Get the vehicle asset registry.
    return getParticipantRegistry('org1.healthcare.biznet.Patient')
    .then(function (patientParticipantRegistry) {
        return patientParticipantRegistry.get(id);
    })
    .then(function (patient) {
        // Process the the vehicle object.
        console.log("getPatient : "+patient.PatientId);
    })
    .catch(function (error) {
        console.log("Error getPatient: For ID : "+id);
        throw new Error("Error getPatient : "+error.message);
    });
}

function getDoctor(id) {
    // Get the vehicle asset registry.
    return getParticipantRegistry('org1.healthcare.biznet.Doctor')
    .then(function (doctorParticipantRegistry) {
        return doctorParticipantRegistry.get(id);
    })
    .then(function (doctor) {
        // Process the the vehicle object.
        console.log("getDoctor : "+doctor.DocotorId);
    })
    .catch(function (error) {
        console.log("Error getDoctor: For ID : "+id);
        throw new Error(error.message);
    });
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