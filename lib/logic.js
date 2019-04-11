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


    var patientSlot = 0;
    // Get factory for creating new instance
    var datetime = today() + " @ " + timeNow();
    var factory = getFactory();
    var new_appointment = factory.newResource('org1.healthcare.biznet','Appointment',datetime+appointment.byPatient);

    new_appointment.appointmentTime = datetime;
    try{
        var nowTime = new Date();


        var patientParticipantRegistry =await getParticipantRegistry('org1.healthcare.biznet.Patient');
        var find_patient = await patientParticipantRegistry.get(appointment.byPatient);
        console.log("processAppointment: Got patient "+find_patient.Name);
        var doctorParticipantRegistry = await getParticipantRegistry('org1.healthcare.biznet.Doctor');
        var find_doctor = await doctorParticipantRegistry.get(appointment.forDoctor);
        console.log("processAppointment: Got doctor "+find_doctor.Name);
        // Check if doctor has a free slot during that day.
        var scheduleAssetRegistry  = await getAssetRegistry('org1.healthcare.biznet.DoctorSchedule');

        var month = (appointment.scheduleDate.getMonth()+1);
        var scheduleMonth = "";
        if(month<=9)
        {
            scheduleMonth = "0" + month;
        }
        else
        {
            scheduleMonth = month;
        }
        console.log("processAppointment: month "+ scheduleMonth);
        // concat of doctorid day month and year

        var scheduleSearchId = appointment.forDoctor + appointment.scheduleDate.getDate() + scheduleMonth  +appointment.scheduleDate.getFullYear() ;
        var does_schedule_exist = await scheduleAssetRegistry.exists(scheduleSearchId);

        console.log("processAppointment: does_schedule_exist  "+ does_schedule_exist);


        if(does_schedule_exist)
        {
            // Schedule exists check if there is a slot vacant for the patient.
            console.log("processAppointment for " + appointment.transactionId + "  Fetching Doctor Schedule for the day" );
            var doctorSchedule = await scheduleAssetRegistry.get(scheduleSearchId);
            console.log("processAppointment for " + appointment.transactionId + "  Found Doctor Schedule for the day" );
            if(doctorSchedule.patientSlot.length==5)
            {
                // Slot filled cannot take any more patients for the day
                console.log("processAppointment for " + appointment.transactionId + "  Doctor busy for the day" );
                error_message = "Doctor busy for day. Try for another day";
                throw new Error(error_message);
            }
            else
            {
                doctorSchedule.patientSlot.push(appointment.byPatient);
                patientSlot = doctorSchedule.patientSlot.length;
                let scheduleRegistry = await getAssetRegistry('org1.healthcare.biznet.DoctorSchedule');
                await scheduleRegistry.update(doctorSchedule);
                console.log("processAppointment for " + appointment.transactionId + " Updated the doctor schedule. Patient slot is " + patientSlot );
            }

        }
        else
        {
            // Generate a new Schedule for the doctor
            console.log("processAppointment for " + appointment.transactionId + "  Doctor schedule does not exist for the day. Generating the schedule" );
            var new_schedule = factory.newResource('org1.healthcare.biznet','DoctorSchedule',scheduleSearchId);
            new_schedule.doctorId = appointment.forDoctor;
            new_schedule.scheduleDate = appointment.scheduleDate;
            let docSchedule = [];
            docSchedule.push(appointment.byPatient);
            new_schedule.patientSlot = docSchedule;
            let scheduleRegistry = await getAssetRegistry('org1.healthcare.biznet.DoctorSchedule');
            await scheduleRegistry.add(new_schedule);
            console.log("processAppointment for " + appointment.transactionId + " Generated Doctor schedule for the day" );
            patientSlot = 1;
        }

    } catch (err) {
        console.log("processAppointment Error : "+err.message);
        throw new Error(err.message);
    }

    new_appointment.byPatient = find_patient;
    new_appointment.forDoctor = find_doctor;
    new_appointment.completed = false;
    new_appointment.slot = patientSlot;

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

        new_report.canBeReferred = res_appointment.canBeReferred;  //added for referral

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


/**
 * Process the Lab Report Generated by the Lab
 * @param {org1.healthcare.biznet.GenerateLabReport} generateLabReport
 * @transaction
 */

async function processLabReport(generateLabReport){
    var is_test_generated_by_doctor = false;
    console.log("Processing Lab Report Generated by Transaction " + generateLabReport.transactionId)
    var datetime = today() + " @ " + timeNow();
    var factory = getFactory();

    if (typeof generateLabReport.TestsReport == 'undefined')
    {
        error_message = "[ERROR] Processing Lab Report Generated by Transaction " + generateLabReport.transactionId + " Error: No lab report provided in the transaction";
        console.log(error_message);
        throw new Error(error_message)
    }
    try{
        var patientParticipantRegistry =await getParticipantRegistry('org1.healthcare.biznet.Patient');
        var find_patient = await patientParticipantRegistry.get(generateLabReport.PatientId);
        console.log("Processing Lab Report Generated by Transaction " + generateLabReport.transactionId + " Found patient " + generateLabReport.PatientId);
        if (typeof generateLabReport.DoctorId == 'undefined')
            console.log("Processing Lab Report Generated by Transaction " + generateLabReport.transactionId + " Test Not generated by Doctor");

        else
        {
            var doctorParticipantRegistry = await getParticipantRegistry('org1.healthcare.biznet.Doctor');
            var find_doctor = await doctorParticipantRegistry.get(generateLabReport.DoctorId);
            is_test_generated_by_doctor = true;
            console.log("Processing Lab Report Generated by Transaction " + generateLabReport.transactionId + " Found doctor " + generateLabReport.DoctorId);
        }

        var labParticipantRegistry =await getParticipantRegistry('org1.healthcare.biznet.TestLab');
        var find_lab = await labParticipantRegistry.get(generateLabReport.LabId);
        console.log("Processing Lab Report Generated by Transaction " + generateLabReport.transactionId + " Found lab " + generateLabReport.LabId);


    } catch (err)
    {
        err_msg = "[ERROR] Processing Lab Report Generated by Transaction " + generateLabReport.transactionId + " Error:" + err.message
        console.log(err_msg);
        throw new Error(err_msg);
    }
    var labReport = factory.newResource('org1.healthcare.biznet','LabReport',datetime+generateLabReport.PatientId+ generateLabReport.LabId);
    labReport.report = generateLabReport.TestsReport;
    labReport.patient = find_patient;
    labReport.lab = find_lab;
    if(is_test_generated_by_doctor)
    {
        labReport.doctor = find_doctor;
    }
    let labReportRegistry = await getAssetRegistry('org1.healthcare.biznet.LabReport');
    await labReportRegistry.add(labReport);


    console.log("Processing complete for Transaction " + generateLabReport.transactionId);
}

/**
 * Patient chooses to allow Doctor to refer him/her to another Doctor
 * @param {org1.healthcare.biznet.AllowReferral} allow_referral
 * @transaction
 */

 //Yet to be validated
 async function AllowReferralOfReport(allow_referral) {
    console.log("Allowing Referral: START")
    try {

        var patientRegistry = await getParticipantRegistry('org1.healthcare.biznet.Patient');
        var reportRegistry = await getAssetRegistry('org1.healthcare.biznet.PatientReport')

        var patient = await patientRegistry.get(allow_referral.ownerPatient);
        console.log("Allow Referral: Got patient " + patient.Name);
        var report = await reportRegistry.get(allow_referral.Report)
        console.log("Allow Referral: Got Report "+ report.reportId);

        allow_referral.Report.canBeReferred = 1;
        await reportRegistry.update(allow_referral.Report);

    } catch (err) {
        console.log("AllowReferralOfReport Error : " + err.message);
        return;
    }


 }

/**
 * Patient chooses NOT to allow Doctor to refer him/her to another Doctor
 * @param {org1.healthcare.biznet.AllowReferral} rev_referral
 * @transaction
 */

async function RevokeReferralOfReport(rev_referral) {
    console.log("Revoking Referral: START")
    try {
        var patientRegistry = await getParticipantRegistry('org1.healthcare.biznet.Patient');
        var reportRegistry = await getAssetRegistry('org1.healthcare.biznet.PatientReport')
        var patient = await patientRegistry.get(rev_referral.ownerPatient);
        console.log("Allow Referral: Got patient " + patient.Name);

        var report = await reportRegistry.get(rev_referral.Report)
        console.log("Allow Referral: Got Report "+ report.reportId);

        rev_referral.Report.canBeReferred = 0;
        await reportRegistry.update(rev_referral.Report);

    }
    catch (err) {
        console.log("RevokeReferralOfReport Error : " + err.message);
        return;
    }

}

/**
 * Patient
 * @param {org1.healthcare.biznet.ReferToAnotherDoctor} referral
 * @transaction
 */

 async function processReferral(referral) {
     console.log("Referral: START");
     try {
         var doctorRegistry = await getParticipantRegistry('org1.healthcare.biznet.Doctor')
         var reportRegistry = await getAssetRegistry('org1.healthcare.biznet.PatientReport')

         var oldDoctor = await doctorRegistry.get(referral.oldDoctor)
         console.log("processReferral: Got Old Doctor" + oldDoctor.Name)
         var newDoctor = await doctorRegistry.get(referral.newDoctor)
         console.log("processReferral: Got New Doctor" + newDoctor.Name)
         var report = await reportRegistry.get(referral.Report)
         console.log("Allow Referral: Got Report "+ report.reportId);

         //check if patient allows referral
         if(report.canBeReferred == 0)
         throw new Error('Patient does not choose to be referred to another Doctor')
         else
         {
             referral.Report.creatingDoctor = newDoctor
             await reportRegistry.update(referral.Report);

         }
     }
     catch(err) {
         console.log("Error Message: " + err)
         return;
     }
 }


/**
 * Change in doctor request intiated by doctor (reqId,reportId,newDoctor,byDoctor)
 * @param {org1.healthcare.biznet.RequestDoctorChange} requestDocChange
 * @transaction
 */

async function createDcotorChangeRequest(requestDocChange) {
    console.log("DoctorChangeRequest: Start");
    try {
        var reportAssetRegsitry = await getAssetRegistry('org1.healthcare.biznet.PatientReport');
        var found_report = await reportAssetRegsitry.get(requestDocChange.reportId);



        // console.log("DoctorChangeRequest: ",found_report.creatingDoctor.getIdentifier(),requestDocChange.byDoctor.DoctorId);

        if(found_report.creatingDoctor.getIdentifier() != requestDocChange.byDoctor.DoctorId )
        {
            throw new Error("Creating and Requesting Doctor mismatch.");
        }
        console.log("DoctorChangeRequest: Doctor matched");
        var factory = getFactory();
        var new_request = factory.newResource('org1.healthcare.biznet','ReassignReportRequest',requestDocChange.reqId);

        new_request.newDoctor = requestDocChange.newDoctor;
        new_request.oldDoctor = requestDocChange.byDoctor;
        new_request.report = found_report;
        new_request.patientId = found_report.ownerPatient;
        console.log("DoctorChangeRequest: Filled Request");

        let requestResgistry = await getAssetRegistry('org1.healthcare.biznet.ReassignReportRequest');
        requestResgistry.add(new_request);

        console.log("DoctorChangeRequest: Request added to DB");

    } catch (err) {
        console.log("DoctorChangeRequest: Error: " + err)
        return;
    }
}

/**
 * Patients resolve on change in doctor request intiated by doctor (approve,toReassignRequest,byPatient
 * @param {org1.healthcare.biznet.ApproveRequestDoctorChange} approveReq
 * @transaction
 */

 async function apporveDoctorRequest(approveReq) {
    console.log("approveDocRequest: Start");
    try {
        if(approveReq.toReassignRequest.patientId.PatientId != approveReq.byPatient.PatientId )
        {
            throw new Error("Patient mismatch!!!");
        }

        if(approveReq.approve == true){
            console.log("approveDocRequest: Approve was accepted");
            let doctorParticipantRegistry = await getParticipantRegistry('org1.healthcare.biznet.Doctor');
            var newDoctor = await doctorParticipantRegistry.get(approveReq.toReassignRequest.newDoctor);
            console.log("approveDocRequest: Got new Doctor");

            approveReq.toReassignRequest.report.creatingDoctor = newDoctor;

            let reportRegistry = await getAssetRegistry('org1.healthcare.biznet.PatientReport');
            await reportRegistry.update(approveReq.toReassignRequest.report);
            console.log("approveDocRequest: Updated new doctor in report");
        }
        else
        {
            console.log("approveDocRequest: Approve was rejected");
        }
        let requestResgistry = await getAssetRegistry('org1.healthcare.biznet.ReassignReportRequest');
        console.log("approveDocRequest: Deleted request from the DB");
        await requestResgistry.remove(approveReq.toReassignRequest);
    } catch (err) {
    console.log("approveDocRequest: Error: " + err)
    return;
    }
 }

/**
 * Buy card transaction
 * @param {org1.healthcare.biznet.Share} share
 * @transaction
 */

async function shareReports(share) {
    console.log("Sharing the report");
    var factory = getFactory();
    var nameSpac = "org1.healthcare.biznet";

    let patientRegistry = await getParticipantRegistry(nameSpac+'.Patient');

  	let patientReportAssest = await getAssetRegistry(nameSpac+'.PatientReport');
    let ownerExists = await patientRegistry.exists(share.ownerId);
  	let reportExists = await patientReportAssest.exists(share.reportId);
 	var shareParticipantRegistry;
    if(ownerExists && reportExists){
        let patientReport = await patientReportAssest.get(share.reportId);
        var participantType;
      	if(patientReport.ownerPatient.getIdentifier() == share.ownerId){
            if(share.participantType == 'Doctor'){
                shareParticipantRegistry = await getParticipantRegistry('org1.healthcare.biznet.Doctor');
                participantType = 'Doctor'
          	} else {
                shareParticipantRegistry = await getParticipantRegistry('org1.healthcare.biznet.Patient');
                participantType = 'Patient'
            }
            let shareParticipantExists = await shareParticipantRegistry.exists(share.sharedWithId);
            if(shareParticipantExists){

                var newShareReport = factory.newResource(nameSpac,'ShareReport',share.shareId);
                newShareReport.reportId = share.reportId;
                newShareReport.isRevoked = false;
                newShareReport.sharedOn = share.timestamp;
                newShareReport.participantType = participantType;
              	newShareReport.expiresOn = share.timestamp;
              	newShareReport.expiresOn.setDate(newShareReport.expiresOn.getDate() + share.numberOfDays);
                newShareReport.sharedTo = await shareParticipantRegistry.get(share.sharedWithId);

                let shareReportRegistry = await getAssetRegistry(nameSpac+'.ShareReport');
                await shareReportRegistry.add(newShareReport);

            } else {
                throw Error('Invalid person to share with');
            }
        } else {
            throw Error('You are not authorized to share the report');
        }

    } else {
      throw Error('Owner : Patient not Exists or Report is invalid')
    }
}

 /**
 * Buy card transaction
 * @param {org1.healthcare.biznet.DoctorAvailability} availability
 * @transaction
 */

async function checkAvailability(availability){
    console.log("checkAvailability for transaction : " + availability.transactionId);

    try{

        var doctorParticipantRegistry = await getParticipantRegistry('org1.healthcare.biznet.Doctor');
        var find_doctor = await doctorParticipantRegistry.get(availability.Doctor);
        console.log("checkAvailability for transaction : " + availability.transactionId + " Found doctor ");
        // Check if doctor has a free slot during that day.
        var scheduleAssetRegistry  = await getAssetRegistry('org1.healthcare.biznet.DoctorSchedule');
        var month = (availability.scheduleDate.getMonth()+1);
        var scheduleMonth = "";
        if(month<=9)
        {
            scheduleMonth = "0" + month;
        }
        else
        {
            scheduleMonth = month;
        }
        // concat of doctorid day month and year

        var scheduleSearchId = availability.Doctor + availability.scheduleDate.getDate() + scheduleMonth  +availability.scheduleDate.getFullYear() ;
        var does_schedule_exist = await scheduleAssetRegistry.exists(scheduleSearchId);
        console.log("checkAvailability for transaction : " + availability.transactionId + " does_schedule_exist " + does_schedule_exist);


        // Schedule already exists check if slots are filled
        if(does_schedule_exist)
        {
            console.log("checkAvailability for transaction : " + availability.transactionId +  "  Fetching Doctor Schedule for the day" );
            var doctorSchedule = await scheduleAssetRegistry.get(scheduleSearchId);
            console.log("checkAvailability for transaction : " + availability.transactionId + "  Found Doctor Schedule for the day" );
            if(doctorSchedule.patientSlot.length==5)
            {
                // Slot filled cannot take any more patients for the day
                console.log("checkAvailability for transaction : " + availability.transactionId + "  Doctor busy for the day" );
                event_msg =  "Doctor busy for day. Try for another day";
            }
            else
            {
                console.log("checkAvailability for transaction : " + availability.transactionId + " Doctor is available for the day" );
                event_msg =  "Doctor is available for the day";
            }
        }
        else
        {
            event_msg =  "Doctor is available for the day";
        }

    } catch (err) {
        console.log("[ERROR]: checkAvailability for transaction : " + availability.transactionId  + err.message);
        throw new Error(err.message);
    }
    let availabilityEvent = getFactory().newEvent('org1.healthcare.biznet', 'DoctorAvailabilityEvent');
    availabilityEvent.Doctor = availability.Doctor
    availabilityEvent.Message = event_msg;
    emit(availabilityEvent);
    return;

}

// Vishal
/**
 * @param {org1.healthcare.biznet.ReqLabReport} request
 * @transaction
 */

 async function requestLabReport(request){
     console.log("Request_Lab_Report: Start");
     // Get factory for creating new instance
     var datetime = today() + " @ " + timeNow();
     var factory = getFactory();
     var new_request = factory.newResource('org1.healthcare.biznet','RequestLabReport',datetime+request.forPatient);

     new_request.requestTime = datetime;
     try{
         var patientParticipantRegistry =await getParticipantRegistry('org1.healthcare.biznet.Patient');
         var find_patient = await patientParticipantRegistry.get(request.forPatient);
         console.log("requestLabReport: Got Patient: "+find_patient.Name);

         var doctorParticipantRegistry = await getParticipantRegistry('org1.healthcare.biznet.Doctor');
         var find_doctor = await doctorParticipantRegistry.get(request.fromDoctor);
         console.log("requestLabReport: Got doctor: "+find_doctor.Name);

         var labParticipantRegistry = await getParticipantRegistry('org1.healthcare.biznet.TestLab');
         var find_testlab = await labParticipantRegistry.get(request.toLab);
         console.log("requestLabReport: Got doctor: "+find_test.labName);

     } catch (err) {
         console.log("requestLabReport Error : "+err.message);
         return;
     }

     new_request.fromDoctor = find_doctor;
     new_request.toLab = find_testlab;
     new_request.forPatient = find_patient

     let requestLabReportRegistry = await getAssetRegistry('org1.healthcare.biznet.RequestLabReport');
     await requestLabReportRegistry.add(new_request);

     console.log("requestLabReport: Added to registry");
     let event = getFactory().newEvent('org1.healthcare.biznet', 'RequestLabReportEvent');
     event.new_request = new_request;
     event.fromDoctor = request.fromDoctor;
     event.toLab = request.toLab;
     event.forPatient = request.forPatient;
     emit(event);
     // Have to add more to it
 }
