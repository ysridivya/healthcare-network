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


    // constructor() {
    //     this.sliders.push(
    //         {
    //             imagePath: 'assets/images/slider1.jpg',
    //             label: 'First slide label',
    //             text:
    //                 'Nulla vitae elit libero, a pharetra augue mollis interdum.'
    //         },
    //         {
    //             imagePath: 'assets/images/slider2.jpg',
    //             label: 'Second slide label',
    //             text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.'
    //         },
    //         {
    //             imagePath: 'assets/images/slider3.jpg',
    //             label: 'Third slide label',
    //             text:
    //                 'Praesent commodo cursus magna, vel scelerisque nisl consectetur.'
    //         }
    //     );
    //
    //     this.alerts.push(
    //         {
    //             id: 1,
    //             type: 'success',
    //             message: `Lorem ipsum dolor sit amet, consectetur adipisicing elit.
    //             Voluptates est animi quibusdam praesentium quam, et perspiciatis,
    //             consectetur velit culpa molestias dignissimos
    //             voluptatum veritatis quod aliquam! Rerum placeat necessitatibus, vitae dolorum`
    //         },
    //         {
    //             id: 2,
    //             type: 'warning',
    //             message: `Lorem ipsum dolor sit amet, consectetur adipisicing elit.
    //             Voluptates est animi quibusdam praesentium quam, et perspiciatis,
    //             consectetur velit culpa molestias dignissimos
    //             voluptatum veritatis quod aliquam! Rerum placeat necessitatibus, vitae dolorum`
    //         }
    //     );
    // }

    ngOnInit() {
    this.route.queryParams.subscribe((params) => {
        const loggedIn = params['loggedIn'];
        if (loggedIn) {
          console.log('User Logged in successfully')
          this.authenticated = true;
          return this.checkWallet();

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
      });
  }

    public closeAlert(alert: any) {
        const index: number = this.alerts.indexOf(alert);
        this.alerts.splice(index, 1);
    }
}

