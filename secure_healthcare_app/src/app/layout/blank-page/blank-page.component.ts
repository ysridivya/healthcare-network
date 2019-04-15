import { Component, OnInit } from '@angular/core';
import { routerTransition } from '../../router.animations';
import { ActivatedRoute, Router } from '@angular/router';
import { RestService} from '../../services/rest.service'
import { $ } from 'protractor';


@Component({
    selector: 'app-blank-page',
    templateUrl: './blank-page.component.html',
    styleUrls: ['./blank-page.component.scss']
})
export class BlankPageComponent implements OnInit {
    doctors: Array<String>;
    constructor(private route: ActivatedRoute,
        private router: Router,
        private restService: RestService) {
}

private appointment={
    forDoctor:'',
    byPatient:'',
    scheduleDate:''

}
public appointment_loading = false;

registerAppointment(e)
{
    this.appointment_loading = true;
    e.preventDefault();
    this.appointment.forDoctor = e.target.elements[0].value;
    this.appointment.byPatient = e.target.elements[1].value;
    var username = localStorage.getItem('username');
    username = username.substr(username.indexOf("#")+1);
    this.appointment.byPatient = username;
    console.log(this.restService.createAppointment(this.appointment))
    this.appointment_loading = false;

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
