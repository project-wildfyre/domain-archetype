import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {MatTabChangeEvent} from "@angular/material/tabs";
import {Questionnaire, QuestionnaireItem} from "fhir/r4";
import {AppService} from "./app.service";



@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})


export class AppComponent implements OnInit {
  title = 'questionnaire-viewer';

  constructor(private route: ActivatedRoute, public appSerivce: AppService) {
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
          this.questionnaire = this.fixEcl(data2)
          console.log(this.questionnaire)
        })
      }
    })
  }

  fixEcl(questionnaire : Questionnaire) {
    var quest = JSON.stringify(questionnaire)
    quest = quest.replaceAll('%3C+','%3C')
    quest = quest.replaceAll('ecl%2F','ecl')
    return JSON.parse(quest)
  }


  changedTab(event: MatTabChangeEvent) {
    this.currentTab = event.index
  }

  getDescription() {
    if (this.questionnaire !== undefined && this.questionnaire.description !== undefined) return this.questionnaire.description
    return "";
  }
}
