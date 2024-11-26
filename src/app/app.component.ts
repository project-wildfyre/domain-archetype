import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {DomSanitizer} from "@angular/platform-browser";
import {HttpClient} from "@angular/common/http";
import {MatTabChangeEvent} from "@angular/material/tabs";



@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})


export class AppComponent implements OnInit {
  title = 'questionnaire-viewer';

  constructor(private route: ActivatedRoute,
              private sanitizer: DomSanitizer,
              private http: HttpClient) {
  }
  questionnaire : any;

  currentTab = 0;

  ngOnInit() {

    this.route.queryParams.subscribe(params => {
        const questionnairePath = params['q'];
        if (questionnairePath !== null) {
          this.downloadQuestionnaire(questionnairePath)
        }
      }
    )
  }

  public downloadQuestionnaire(url: string) {
    fetch(url).then(data => {
      if (data.type == 'cors') {
        data.json().then(data2 => {
          console.log(data2)
          this.questionnaire= data2
        })
      }
    })
  }



  changedTab(event: MatTabChangeEvent) {
    this.currentTab = event.index
  }

}
