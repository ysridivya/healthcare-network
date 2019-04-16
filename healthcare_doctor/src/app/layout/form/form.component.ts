import { Component, OnInit } from '@angular/core';
import { routerTransition } from '../../router.animations';
import { ActivatedRoute, Router } from '@angular/router';
import { RestService} from '../../services/rest.service'

@Component({
    selector: 'app-form',
    templateUrl: './form.component.html',
    styleUrls: ['./form.component.scss'],
    animations: [routerTransition()]
})
export class FormComponent implements OnInit {
    labs: Array<object>;
    constructor(private route: ActivatedRoute,
        private router: Router,
        private restService: RestService) {
}

 ngOnInit(){
    this.restService.getLabs().subscribe(
        data =>{
            this.labs = [];
            for(let key in data)
            {
                this.labs.push(data[key]);
                console.log(data[key]);
            }
        }
    );
 }
 

}
