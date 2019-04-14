import { Component, OnInit } from '@angular/core';
import { routerTransition } from '../../router.animations';
import { ActivatedRoute, Router } from '@angular/router';
import { RestService} from '../../services/rest.service'

@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.scss'],
    animations: [routerTransition()]
})
export class DashboardComponent implements OnInit {
    public alerts: Array<any> = [];
    public sliders: Array<any> = [];

    constructor(private route: ActivatedRoute,
              private router: Router,
              private restService: RestService) {
  }
  authenticated: boolean;
  loggedIn: boolean;
  private currentUser;
  appointment: Array<object>;

  ngOnInit() {
    this.route.queryParams.subscribe((params) => {
        const loggedIn = params['loggedIn'];
        this.restService.getMyAppointment().subscribe(
            data =>{
                this.appointment = [];
                for(let key in data)
                {
                    this.appointment.push(data[key]);
                    console.log(data[key]);
                }
            }
        );
        if (loggedIn) {
          console.log('User Logged in successfully')
          this.authenticated = true;
          return this.checkWallet()
          .then(() => {
              
          });         


        }else {
          console.log('User Not Logged in successfully')
        }
      });
      
  }

  checkWallet() {
    return this.restService.checkWallet()
      .then((results) => {
        if (results['length'] > 0) {
          this.loggedIn = true;
          return this.getCurrentUser()
        }
      });
  }

  getCurrentUser() {
    return this.restService.getCurrentUser()
      .then((currentUser) => {
        this.currentUser = currentUser;
        console.log('Current User is ' + currentUser );
        localStorage.setItem('username', currentUser);
        //this.restService.getAllDoctors()
      });
  }

    public closeAlert(alert: any) {
        const index: number = this.alerts.indexOf(alert);
        this.alerts.splice(index, 1);
    }
}

