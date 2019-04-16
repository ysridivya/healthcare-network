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
    
 ngOnInit(){
    this.restService.getAllPharmacy().subscribe(
        data =>{
            this.pharma = [];
            for(let key in data)
            {
                this.pharma.push(data[key]);
                //console.log(data[key]);
            }
        }
    );
 }
}
