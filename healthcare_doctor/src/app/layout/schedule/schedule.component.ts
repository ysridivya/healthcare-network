import { Component, OnInit } from '@angular/core';
import { routerTransition } from '../../router.animations';
import { ActivatedRoute, Router } from '@angular/router';
import { RestService} from '../../services/rest.service'
import { $ } from 'protractor';
import {NgbDateStruct, NgbCalendar,NgbDatepickerConfig} from '@ng-bootstrap/ng-bootstrap';
import {NgbDateParserFormatter} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-schedule',
  templateUrl: './schedule.component.html',
  styleUrls: ['./schedule.component.scss']
})
export class ScheduleComponent implements OnInit {
  minDate = undefined;
  constructor(private route: ActivatedRoute,
    private router: Router,
    private restService: RestService,private calendar: NgbCalendar,private parserFormatter: NgbDateParserFormatter,config: NgbDatepickerConfig
    ) {
        const current = new Date();
        this.minDate = {
          year: current.getFullYear(),
          month: current.getMonth() + 1,
          day: current.getDate()
        };
  }
  private
  model: NgbDateStruct;
  date: {year: number, month: number};

  getDocSchedule(e)
  {
    console.log()
  }

  ngOnInit() {
    
  }

}
