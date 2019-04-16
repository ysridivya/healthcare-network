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
    pharmacy: Array<String>;
    constructor(private route: ActivatedRoute,
        private router: Router,
        private restService: RestService) {
}

private appointment={
    appId:'',
    doctorid:'',
    report:'',
    meds:'',
    pharmacyid:''
}
public appointment_loading = false;

resolveAppointment(e)
{
    this.appointment_loading = true;
    e.preventDefault();
    this.appointment.appId = e.target.elements[0].value;
    this.appointment.report = e.target.elements[1].value;
    this.appointment.meds = e.target.elements[2].value;
    this.appointment.pharmacyid = e.target.elements[3].value;
    var username = localStorage.getItem('username');
    username = username.substr(username.indexOf("#")+1);
    this.appointment.doctorid = username;
    console.log(this.restService.resolveAppointment(this.appointment))
    this.appointment_loading = false;

}

 ngOnInit()
{
    this.restService.getMyAppointment().subscribe(
        data => {
             this.doctors = [];
             for(let key in data) {
                 if(data[key].completed == false)
                     this.doctors.push(data[key]);
                 console.log(data[key]);
                }
            }
            );
    this.restService.getAllPharmacy().subscribe(
        data => {
            this.pharmacy = [];
            for(let key in data) {
                this.pharmacy.push(data[key]);
                console.log(data[key]);
                }
            }
            );
    }
}
