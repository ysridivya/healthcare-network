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

  }
  selectedReport()
  {
    alert('Hi');
  }


}
