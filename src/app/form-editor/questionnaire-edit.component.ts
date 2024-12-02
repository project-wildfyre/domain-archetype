import {Component, EventEmitter, Input, Output, signal} from '@angular/core';
import {Questionnaire} from "fhir/r4";
import {HttpClient} from "@angular/common/http";
import {MatDialog} from "@angular/material/dialog";

@Component({
  selector: 'app-questionnaire-edit',
  templateUrl: './questionnaire-edit.component.html',
  styleUrl: './questionnaire-edit.component.scss'
})
export class QuestionnaireEditComponent {
  editorOptions = {theme: 'vs-light', language: 'json'};

  monacoEditor: any
  data: any;

  @Input()
  set formDefinition(questionnaire: Questionnaire | undefined) {
    this.data = JSON.stringify(questionnaire, undefined, 2)
  }
  @Input()
  readonly = false;

  @Output()
  questionnaireChanged = new EventEmitter<Questionnaire>();

  checkType () {
    try {
      var questionnaire = JSON.parse(this.data)
      this.questionnaireChanged.emit(questionnaire)
    }
    catch (e) {
      console.log((e as Error).message);
    }
  }

  constructor(private http: HttpClient,
              public dialog: MatDialog
  ) {
  }

  onInit(editor: any) {
    console.log('On Init Called')
    this.monacoEditor = editor
  }


  updateQuestionnaire(questionnaire : Questionnaire) {
    this.data = JSON.stringify(questionnaire, undefined, 2)
    this.questionnaireChanged.emit(questionnaire)
  }

}
