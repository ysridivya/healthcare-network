import { Component, OnInit } from '@angular/core';
import { routerTransition } from '../../router.animations';
import { ActivatedRoute, Router } from '@angular/router';
import { RestService} from '../../services/rest.service'
@Component({
    selector: 'app-charts',
    templateUrl: './charts.component.html',
    styleUrls: ['./charts.component.scss'],
    animations: [routerTransition()]
})
export class ChartsComponent implements OnInit {
    doctors: Array<object>;
    constructor(private route: ActivatedRoute,
        private router: Router,
        private restService: RestService) {
}

 ngOnInit(){

    this.restService.getAllDoctors().subscribe(
        data =>{
            this.doctors = [];
            for(let key in data)
            {
                this.doctors.push(data[key].DoctorId);
                console.log(data[key]);
            }
        }
    );
 }
 

}
