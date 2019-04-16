import { Component, OnInit } from '@angular/core';
import { routerTransition } from '../../router.animations';
import { ActivatedRoute, Router } from '@angular/router';
import { RestService} from '../../services/rest.service'
import {NgbDateStruct, NgbCalendar,NgbDatepickerConfig} from '@ng-bootstrap/ng-bootstrap';
import {NgbDateParserFormatter} from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'app-blank-page',
    templateUrl: './blank-page.component.html',
    styleUrls: ['./blank-page.component.scss']
})
export class BlankPageComponent implements OnInit {
    doctors: Array<String>;
    minDate = undefined;
    constructor(private route: ActivatedRoute,
        private router: Router,
        private restService: RestService,private calendar: NgbCalendar,private parserFormatter: NgbDateParserFormatter,config: NgbDatepickerConfig
        ) {
            const current = new Date();
            this.minDate = {
              year: current.getFullYear(),
              month: current.getMonth() + 1,
              day: current.getDate()
            };
}
model: NgbDateStruct;
date: {year: number, month: number};
private appointment={
    forDoctor:'',
    byPatient:'',
    scheduleDate:''

}
public loading = false;
public appointment_output = ''

    registerAppointment(e)
    {
        console.log(this.model);
        console.log(this.loading);

        var appointment_date = this.parserFormatter.format(this.model)
        appointment_date = appointment_date.toString()
        this.loading = true;

        this.appointment.forDoctor = e.target.elements[0].value;
        this.appointment.byPatient = e.target.elements[1].value;
        this.appointment.scheduleDate = appointment_date;
        var username = localStorage.getItem('username');
        username = username.substr(username.indexOf("#")+1);
        this.appointment.byPatient = username;
       return this.restService.createAppointment(this.appointment)
        .then((output) => {
        this.loading = false;
        this.appointment_output = 'Appointment creation successful '
        window.alert(this.appointment_output)
        window.location.reload();

        }).catch((error)=>{
            console.log(error.error.error.message);
            this.appointment_output = error.error.error.message
            this.appointment_output = this.appointment_output.substr(this.appointment_output.lastIndexOf('Error'));
            this.loading = false;
            window.alert(this.appointment_output)
            window.location.reload();

          });
    }

    ngOnInit()
    {
        this.restService.getAllDoctors().subscribe(
            data => {
                this.doctors = [];
                for(let key in data) {
                    this.doctors.push(data[key]);
                    console.log(data[key]);
                    }
                }
                );
    }
}
