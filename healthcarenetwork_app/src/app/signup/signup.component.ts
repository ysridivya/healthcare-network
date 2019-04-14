import { Component, OnInit } from '@angular/core';
import { routerTransition } from '../router.animations';
import { RestService } from '../services/rest.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
    selector: 'app-signup',
    templateUrl: './signup.component.html',
    styleUrls: ['./signup.component.scss'],
    animations: [routerTransition()]
})
export class SignupComponent implements OnInit {
    constructor(private route: ActivatedRoute,
        private router: Router,
        private restService: RestService) {
}
    fullname: Object;
    age: Object;
    address: Object;
    phone: Object;
    private signUp = {
        fullname: '',
        age: '',
        address: '',
        phone: '',
      };

    ngOnInit() {}
    registerUser(e)
    {
        e.preventDefault();
        const target = event.target;
        //const fullname = target.get('fullname');
        //console.log(target.getElementById('fullname'));
        this.signUp.fullname = e.target.elements[0].value
        this.signUp.age = e.target.elements[1].value
        this.signUp.address = e.target.elements[2].value
        this.signUp.phone = e.target.elements[3].value

        console.log(this.signUp.fullname,this.signUp.age,this.signUp.address,this.signUp.phone);
        return this.restService.signUp(this.signUp)
      .then(() => {
        console.log('Something worked')
      })
    }
}
