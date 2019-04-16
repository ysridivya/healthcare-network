import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { RestService} from '../../services/rest.service'
@Component({
    selector: 'app-bs-component',
    templateUrl: './bs-component.component.html',
    styleUrls: ['./bs-component.component.scss']
})
export class BsComponentComponent implements OnInit {
    prescription: Array<object>;
    constructor(private route: ActivatedRoute,
        private router: Router,
        private restService: RestService) {
}

 ngOnInit(){
    this.restService.getDoctorPrescription().subscribe(
        data =>{
            this.prescription = [];
            for(let key in data)
            {
                this.prescription.push(data[key]);
                console.log(data[key]);
            }
        }
    );
 }
}

