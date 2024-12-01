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
  editorOptions = {theme: 'vs-dark', language: 'json'};

  monacoEditor: any

  @Input()
  set formDefinition(questionnaire: Questionnaire | undefined) {
    this.data = JSON.stringify(questionnaire, undefined, 2)
  }
  @Input()
  readonly = false;

  @Output()
  questionnaireChanged = new EventEmitter();

  checkType = signal<any | null>(null);

  data: any;


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
