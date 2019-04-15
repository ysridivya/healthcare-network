import { Component, OnInit } from '@angular/core';
import { routerTransition } from '../../router.animations';
import { ActivatedRoute, Router } from '@angular/router';
import { RestService} from '../../services/rest.service'

@Component({
    selector: 'app-grid',
    templateUrl: './grid.component.html',
    styleUrls: ['./grid.component.scss'],
    animations: [routerTransition()]
})
export class GridComponent implements OnInit {
    hospitals: Array<object>;
    constructor(private route: ActivatedRoute,
        private router: Router,
        private restService: RestService) {
}
ngOnInit(){
    this.restService.getAllHospitals().subscribe(
        data =>{
            this.hospitals = [];
            for(let key in data)
            {
                this.hospitals.push(data[key]);
                console.log(data[key]);
            }
        }
    );
 }}
