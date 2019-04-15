import { Component, OnInit } from '@angular/core';
import { RestService } from '../../services/rest.service';

@Component({
  selector: 'app-share',
  templateUrl: './share.component.html',
  styleUrls: ['./share.component.scss']
})
export class ShareComponent implements OnInit {
  patientReport: Array<object>;
  doctors: Array<object>;
  selectedValue = null;
  private report={
    reportId:'',
    shareId:'',
    sharedWithId:'',
    ownerId:'',
    numberOfDays:10,
    participantType:'Doctor',
    isRevoking: false
  }
  constructor(private restService: RestService) { }

  ngOnInit() {
    this.restService.getPatientReport().subscribe(
      data =>{
          this.patientReport = [];
          for(let key in data)
          {
              this.patientReport.push(data[key]);
          }
      }
  );

  this.restService.getAllDoctors().subscribe(
    data =>{
        this.doctors = [];
        for(let key in data)
        {
            this.doctors.push(data[key]);
        }
    }
  );
  }
  shareReport(e){
    e.preventDefault();
    var username = localStorage.getItem('username');
        username = username.substr(username.indexOf("#")+1);
    this.report.ownerId = username;
    this.report.sharedWithId = e.target.elements[0].value;
    this.report.reportId = e.target.elements[1].value;
    this.report.shareId = username+this.report.sharedWithId+this.report.reportId;
    console.log(this.report);

    return this.restService.sharePatientReport(this.report)
        .then((output) => {
        var appointment_output = 'Report Shared Successfully'
        window.alert(appointment_output);
        }).catch((error)=>{
            console.log(error.error.error.message);
            var appointment_output = error.error.error.message
            appointment_output = appointment_output.substr(appointment_output.lastIndexOf('Error'));
            window.alert(appointment_output)
          });
  }
}
