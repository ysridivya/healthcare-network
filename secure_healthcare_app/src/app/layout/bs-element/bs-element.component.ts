import { Component, OnInit } from '@angular/core';
import { routerTransition } from '../../router.animations';
import { ActivatedRoute, Router } from '@angular/router';
import { RestService} from '../../services/rest.service'
@Component({
    selector: 'app-bs-element',
    templateUrl: './bs-element.component.html',
    styleUrls: ['./bs-element.component.scss'],
    animations: [routerTransition()]
})
export class BsElementComponent implements OnInit {
    labreports: Array<object>;
    constructor(private route: ActivatedRoute,
        private router: Router,
        private restService: RestService) {
}
ngOnInit(){
    this.restService.getPatientLabReport().subscribe(
        data =>{
            this.labreports = [];
            for(let key in data)
            {
                var lab_id = data[key]['lab']
                lab_id = lab_id.substr(lab_id.indexOf("#")+1);
                data[key]['lab'] = lab_id
                this.labreports.push(data[key]);
                console.log(data[key]);
            }
        }
    );
 }}
