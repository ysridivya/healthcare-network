// import {today,timeNow,getPatient} from 'helper';

const d = new Date();
function today() {
    return ((d.getDate() < 10) ? "0" : "") + d.getDate() + "/" + (((d.getMonth() + 1) < 10) ? "0" : "") + (d.getMonth() + 1) + "/" + d.getFullYear();
}

function timeNow() {
    return ((d.getHours() < 10) ? "0" : "") + d.getHours() + ":" + ((d.getMinutes() < 10) ? "0" : "") + d.getMinutes() + ":" + ((d.getSeconds() < 10) ? "0" : "") + d.getSeconds();
}

function genID() {
  return ((d.getDate() < 10) ? "0" : "") + d.getDate()+(((d.getMonth() + 1) < 10) ? "0" : "") + (d.getMonth() + 1) + d.getFullYear() + ((d.getHours() < 10) ? "0" : "") + d.getHours() + ((d.getMinutes() < 10) ? "0" : "") + d.getMinutes() + ((d.getSeconds() < 10) ? "0" : "") + d.getSeconds();
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
    var new_appointment = factory.newResource('org1.healthcare.biznet','Appointment',genID());

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
            throw new  Error("processResolveAppointment Error: Doctor mismatch");
            return;
        }

        console.log("processResolveAppointment: Doctor Verified");

        var factory = getFactory();
        var new_report = factory.newResource('org1.healthcare.biznet','PatientReport',genID());
        var new_prescription = factory.newResource('org1.healthcare.biznet','Prescription',genID());

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
        new_prescription.completed = false;
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
        throw new  Error("processResolveAppointment Error : "+err.message);
        return;
    }
}

/**
 * Processes Prescription, adds entry that patient medicines were given
 * @param {org1.healthcare.biznet.ProcessPrescription} ps
 * @transaction
 */

async function processPrescription(ps){
  console.log("processPrescription: Start");
  var patientid_condition = ps.patientId != ps.toProcessPrescription.forPatient.getIdentifier()
  var doctorid_condition = ps.doctorId != ps.toProcessPrescription.byDoctor.getIdentifier()
  var pharmacyid_condition = ps.pharmacyId != ps.toProcessPrescription.toPharmacy.getIdentifier()
  var stale_condition = ps.toProcessPrescription.completed
  if(patientid_condition || doctorid_condition || pharmacyid_condition || stale_condition) {
    if (patientid_condition) {
      throw new Error('processPrescription Error: Patient Mismatch');
    }else if (doctorid_condition) {
      throw new Error('processPrescription Error: Doctor Mismatch');
    }else if (pharmacyid_condition) {
      throw new Error('processPrescription Error: TestLab Mismatch');
    }else {
      throw new Error('processPrescription Error: Prescription already processed.');
    }
  }
  console.log("processPrescription: Participants Verified");
  let prescriptionRegistry = await getAssetRegistry('org1.healthcare.biznet.Prescription');
  ps.toProcessPrescription.completed = true
  // Update the prescriptionRegistry in the asset registry.
  await prescriptionRegistry.update(ps.toProcessPrescription);
  console.log("processPrescription: Prescription Processed successfully");
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
    var labReport = factory.newResource('org1.healthcare.biznet','LabReport',genID());
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
        var new_request = factory.newResource('org1.healthcare.biznet','ReassignReportRequest',genID());

        new_request.newDoctor = requestDocChange.newDoctor;
        new_request.oldDoctor = requestDocChange.byDoctor;
        new_request.report = found_report;
        new_request.patientId = found_report.ownerPatient;
        console.log("DoctorChangeRequest: Filled Request");

        let requestResgistry = await getAssetRegistry('org1.healthcare.biznet.ReassignReportRequest');
        requestResgistry.add(new_request);

        console.log("DoctorChangeRequest: Request added to DB");

    } catch (err) {
        throw new  Error("DoctorChangeRequest: Error: " + err)
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
    throw new  Error("approveDocRequest: Error: " + err)
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

                var newShareReport = factory.newResource(nameSpac,'ShareReport',genID());
                newShareReport.reportId = share.reportId;
                newShareReport.isRevoked = false;
                newShareReport.sharedOn = share.timestamp;
                newShareReport.participantType = participantType;
                newShareReport.expiresOn = share.timestamp;
                newShareReport.ownerId = share.ownerId;
                newShareReport.reportMessage = patientReport.reportMessage;
                
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
      throw Error('Owner : Patient not Exists or Report is invalid:'+ownerExists+" Report:"+reportExists);
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


/**
 * @param {org1.healthcare.biznet.ReqLabReport} request
 * @transaction
 */

async function requestLabReport(request){
  console.log("Request_Lab_Report: Start");

  var labParticipantRegistry = await getParticipantRegistry('org1.healthcare.biznet.TestLab');
  var find_testlab = await labParticipantRegistry.get(request.LabID);
  console.log("requestLabReport: Got doctor: "+find_testlab.labName);

  var reportRegistry =await getAssetRegistry('org1.healthcare.biznet.PatientReport');
  var find_patientReport = await reportRegistry.get(request.reportID);
  console.log("requestLabReport: Got Report: "+find_patientReport.reportId);

  var doctor_condition = find_patientReport.creatingDoctor.getIdentifier() != request.fromDoctor.getIdentifier()
  var patient_condition = find_patientReport.ownerPatient.getIdentifier() != request.PatientId

  if (doctor_condition || patient_condition) {
    throw new Error('requestLabReport Error: Doctor or Patient Mismatch');
  }

  // Get factory for creating new instance
  var datetime = today() + " @ " + timeNow();
  var factory = getFactory();
  var new_request = factory.newResource('org1.healthcare.biznet','RequestLabReport',genID());
  new_request.requestTime = datetime;
  new_request.report = find_patientReport;
  new_request.toLab = find_testlab;
  new_request.authorized = false

  let requestLabReportRegistry = await getAssetRegistry('org1.healthcare.biznet.RequestLabReport');
  await requestLabReportRegistry.add(new_request);
  console.log("requestLabReport: Added to registry");

  let event = getFactory().newEvent('org1.healthcare.biznet', 'RequestLabReportEvent');
  event.new_request = new_request;
  event.fromDoctor = request.fromDoctor.getIdentifier();
  event.toLab = request.LabID;
  event.forPatient = request.PatientId;
  emit(event);
  // Have to add more to it
 }

/**
 * Patient
 * @param {org1.healthcare.biznet.ChangeOfDoctor} change_doctor
 * @transaction
 */

async function processChangeOfDoctor(change_doctor) {

        console.log("Change of Doctor: START");

        var patientRegistry = await getParticipantRegistry('org1.healthcare.biznet.Patient')
        var reportRegistry = await getAssetRegistry('org1.healthcare.biznet.PatientReport')
        var patientExists = await patientRegistry.exists(change_doctor.byPatient.PatientId)
        var reportExists = await reportRegistry.exists(change_doctor.ReportId)
        var errorMessage = ""
        if(!patientExists) errorMessage = "Patient doesn't Exist."
        if(!reportExists) errorMessage = errorMessage + " Report doesn't Exist"
        if (patientExists && reportExists)
        {
            //Check if new Doctor Exists
            var doctorRegistry = await getParticipantRegistry('org1.healthcare.biznet.Doctor')
            var newDoctorExists = await doctorRegistry.exists(change_doctor.newDoctorId)
            if (!newDoctorExists)
                throw new Error("New Doctor Id is invalid. Doesn't exist")

            var patient = await patientRegistry.get(change_doctor.byPatient.PatientId)
            var report = await reportRegistry.get(change_doctor.ReportId)
            if( report.ownerPatient.getIdentifier() != patient.PatientId) {
                throw new Error("Report doesn't belong to the patient who initiated the transaction")
            }

            var helperState = getFactory().newResource('org1.healthcare.biznet','ChangeDoctorHelperState',genID())

            helperState.newDoctorId = change_doctor.newDoctorId
            helperState.PatientId = change_doctor.byPatient.PatientId
            helperState.Report = report
            var helperStateRegistry = await getAssetRegistry('org1.healthcare.biznet.ChangeDoctorHelperState')
            await helperStateRegistry.add(helperState);

            let event = getFactory().newEvent('org1.healthcare.biznet', 'ChangeOfDoctorEvent');
            event.newDoctorId = helperState.newDoctorId
            event.Message = "Change Of Doctor Request Raised"
            event.PatientId = helperState.PatientId;
            emit(event);
        }
        else
            throw new Error(errorMessage)
 }

 /**
 * Patient
 * @param {org1.healthcare.biznet.ChangeOfDoctorApproval} change_doctor_approval
 * @transaction
 */

async function processApproveChangeDoctor(change_doctor_approval) {

        console.log("Change Doctor Approval: START");


        var doctorRegistry = await getParticipantRegistry('org1.healthcare.biznet.Doctor')
        var helperStateRegistry = await getAssetRegistry('org1.healthcare.biznet.ChangeDoctorHelperState')
        var newDoctorExists = await doctorRegistry.exists(change_doctor_approval.newDoctor.getIdentifier())
        var helperStateExists = await helperStateRegistry.exists(change_doctor_approval.helperState.getIdentifier())
        var errorMessage = ""
        if(!newDoctorExists) errorMessage = "Doctor doesn't exist."
        if(!helperStateExists) errorMessage = errorMessage + " helper state doesn't exist"
        if(newDoctorExists && helperStateExists)
        {
            var newDoctor = await doctorRegistry.get(change_doctor_approval.newDoctor.getIdentifier())
            var helperState = await helperStateRegistry.get(change_doctor_approval.helperState.getIdentifier())
            var approval_value = change_doctor_approval.Approval
            if(newDoctor.DoctorId != helperState.newDoctorId)
                throw new  Error("This is not the Doctor Patient requested for")
            if(approval_value)
            {
                var reportRegistry = await getAssetRegistry('org1.healthcare.biznet.PatientReport')
                var report = await reportRegistry.get(change_doctor_approval.helperState.Report.getIdentifier())
                report.creatingDoctor = newDoctor
                await reportRegistry.update(report)

            }
            else
            {
              	var patientRegistry = await getParticipantRegistry('org1.healthcare.biznet.Patient')
                var patient = await patientRegistry.get(change_doctor_approval.helperState.PatientId)
                let event = getFactory().newEvent('org1.healthcare.biznet', 'ChangeOfDoctorApprovalRejectedEvent');
                event.DoctorId = helperState.newDoctorId
                event.Message = "Doctor has rejected"
                event.RejectedPatient = patient;
                emit(event);
            }

            await helperStateRegistry.remove(change_doctor_approval.helperState)
        }
        else
            throw new Error(errorMessage)


}
