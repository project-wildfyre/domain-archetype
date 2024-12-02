import {Component, EventEmitter, inject, OnInit} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {MatTabChangeEvent} from "@angular/material/tabs";
import {Questionnaire, QuestionnaireItem} from "fhir/r4";
import {AppService} from "./app.service";
import {MatDialog} from "@angular/material/dialog";
import {InfoDiaglogComponent} from "./diaglog/info-diaglog/info-diaglog.component";



@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})


export class AppComponent implements OnInit {
  readonly dialog = inject(MatDialog);
  title = 'questionnaire-viewer';

  constructor(private route: ActivatedRoute, public appSerivce: AppService) {
  }
  questionnaire : Questionnaire | undefined;

  currentTab = 0;
  fileLoadedFile: EventEmitter<any> = new EventEmitter();
  file: any;

  ngOnInit() {
    this.downloadQuestionnaire(this.appSerivce.defaultQuestionnaire)
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

  updateQuestionnaire(questionnaire: Questionnaire | undefined) {
    try {
      console.log('update rxd')
      this.questionnaire = questionnaire
      console.log(this.questionnaire?.title)
    } catch (e) {
      console.log((e as Error).message);
    }
  }

  download() {
    const newBlob = new Blob([JSON.stringify(this.questionnaire,undefined,4)], { type: "application/json" });
    const data = window.URL.createObjectURL(newBlob);
    const link = document.createElement("a");
    link.href = data;
    var fileName = 'untitled.json'
    if (this.questionnaire?.name !== undefined) fileName = this.questionnaire?.name + '.json'
    link.download = fileName; // set a name for the file
    link.click();
  }

  openAlert(title : string, information : string) {
    let dialogRef = this.dialog.open(InfoDiaglogComponent, {
      width: '400px',
      data:  {
        information: information,
        title: title
      }
    });

  }

  selectFileEvent(file: File | FileList) {
    if (file instanceof File) {
      const reader = new FileReader();
      reader.readAsBinaryString(file);
      this.fileLoadedFile.subscribe((data: any) => {
        this.questionnaire = JSON.parse(data)
        }
      );
      const me = this;
      reader.onload = (event: Event) => {
        if (reader.result instanceof ArrayBuffer) {
          ///console.log('array buffer');

          // @ts-ignore
          me.fileLoaded.emit(String.fromCharCode.apply(null, reader.result));
        } else {
          // console.log('not a buffer');
          if (reader.result !== null) me.fileLoadedFile.emit(reader.result);
        }
      };
      reader.onerror = function (error) {
        console.log('Error: ', error);
        me.openAlert('Alert','Failed to process file. Try smaller example?')
      };
    }
  }

}
