import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {MatTabChangeEvent} from "@angular/material/tabs";
import {Questionnaire} from "fhir/r4";



@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})


export class AppComponent implements OnInit {
  title = 'questionnaire-viewer';

  constructor(private route: ActivatedRoute) {
  }
  questionnaire : Questionnaire | undefined;

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
          this.questionnaire = data2
        })
      }
    })
  }



  changedTab(event: MatTabChangeEvent) {
    this.currentTab = event.index
  }

  getDescription() {
    if (this.questionnaire !== undefined && this.questionnaire.description !== undefined) return this.questionnaire.description
    return "";
  }
}
