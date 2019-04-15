import { Component, OnInit } from '@angular/core';
import { routerTransition } from '../../router.animations';
import { ActivatedRoute, Router } from '@angular/router';
import { RestService} from '../../services/rest.service'

@Component({
  selector: 'app-changedoctor',
  templateUrl: './changedoctor.component.html',
  styleUrls: ['./changedoctor.component.scss']
})
export class ChangedoctorComponent implements OnInit {
  reports: Array<String>;
  doctors: Array<String>;
  constructor(private route: ActivatedRoute,
    private router: Router,
    private restService: RestService) {
  }
  private changedoctor={
    PatientIdRef:'',
    ReportId:'',
    newDoctorId:''

  }

  changeDoctor(e)
  {
      e.preventDefault();
      var username = localStorage.getItem('username'); 
      this.changedoctor.PatientIdRef = username;
      this.changedoctor.ReportId = e.target.elements[0].value;
      this.changedoctor.newDoctorId = e.target.elements[1].value;
      console.log(this.changedoctor.PatientIdRef)
      console.log(this.changedoctor.ReportId)
      console.log(this.changedoctor.newDoctorId)
      // console.log(this.restService.changeDoctor(this.changedoctor))
      return this.restService.changeDoctor(this.changedoctor)
        .then((output) => {
        var appointment_output = 'Change Doctor Request Posted Successfully'
        window.alert(appointment_output);
        }).catch((error)=>{
            console.log(error.error.error.message);
            var appointment_output = error.error.error.message
            appointment_output = appointment_output.substr(appointment_output.lastIndexOf('Error'));
            window.alert(appointment_output)
          });
      
    }

  ngOnInit() {


    this.restService.getAllReports().subscribe(
      data =>{
          this.reports = [];
          for(let key in data)
          {
              this.reports.push(data[key]);
              console.log(data[key]);
          }
      }
  );

  this.restService.getAllDoctors().subscribe(
    data =>{
        this.doctors = [];
        for(let key in data)
        {
            this.doctors.push(data[key]);
            console.log(data[key]);
        }
    }
);
  }

}
