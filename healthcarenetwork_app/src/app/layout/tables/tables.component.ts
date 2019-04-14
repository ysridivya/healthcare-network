import { Component, OnInit } from '@angular/core';
import { routerTransition } from '../../router.animations';
import { ActivatedRoute, Router } from '@angular/router';
import { RestService} from '../../services/rest.service'
@Component({
    selector: 'app-tables',
    templateUrl: './tables.component.html',
    styleUrls: ['./tables.component.scss'],
    animations: [routerTransition()]
})
export class TablesComponent implements OnInit {
    pharma: Array<object>;
    constructor(private route: ActivatedRoute,
        private router: Router,
        private restService: RestService) {
    }

    private createappointment = {
        forDoctor: '',
        byPatient: '',
        scheduleDate: ''
      };

 ngOnInit(){
    this.restService.getAllPharmacy().subscribe(
        data =>{
            this.pharma = [];
            for(let key in data)
            {
                this.pharma.push(data[key]);
                console.log(data[key]);
            }
        }
    );
    this.appoint();
 }

 appoint() {
    this.createappointment.forDoctor = '1'     //id will be subsitiuted
    this.createappointment.byPatient = '1'     //id will be subsitiuted
    this.createappointment.scheduleDate = '2019-09-14T16:33:24.409Z'

    console.log(this.restService.createAppointment(this.createappointment))
 }
 

}
