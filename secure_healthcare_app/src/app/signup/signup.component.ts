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
    private signUp = {
        fullname: '',
        age: '',
        address: '',
        phone: '',
      };
    public loading = false;

    // TODO: Convert using ng-app  
    ngOnInit() {}
    registerUser(e)
    {
        e.preventDefault();
        this.signUp.fullname = e.target.elements[0].value;
        this.signUp.age = e.target.elements[1].value;
        this.signUp.address = e.target.elements[2].value;
        this.signUp.phone = e.target.elements[3].value;
        this.loading = true;
        

        console.log(this.signUp.fullname,this.signUp.age,this.signUp.address,this.signUp.phone);
        return this.restService.signUp(this.signUp)
      .then(() => {
        this.loading = false;
        //this.router.navigateByUrl('/dashboard?loggedIn=true');
        this.router.navigate(['/dashboard'], { queryParams: { loggedIn: 'true' } });

        console.log('User ' + this.signUp.fullname + ' has sucessfully signed up');
      })
    }
}
