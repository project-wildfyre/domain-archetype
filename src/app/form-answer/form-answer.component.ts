import {Component, Input} from '@angular/core';
import {MatTableDataSource} from "@angular/material/table";
import {QuestionnaireItem, QuestionnaireItemAnswerOption} from "fhir/r4";

@Component({
  selector: 'app-form-answer',
  templateUrl: './form-answer.component.html',
  styleUrl: './form-answer.component.scss'
})
export class FormAnswerComponent {
  applyPaginator: boolean = false;
  displayedColumns: string[] = [ 'display', 'code',  'codesystem'];
  // @ts-ignore
  dataSource: MatTableDataSource<QuestionnaireItemAnswerOption>;
  item: QuestionnaireItem | undefined;
  @Input()
  set setItem(item: QuestionnaireItem) {
    this.item = item;
    if (item.answerOption !== undefined) {

      for (let entry of item.answerOption) {
        if (entry.valueString !== undefined) {
          entry.valueCoding = {
            display: entry.valueString
          }
          entry.valueString = undefined
        }
      }
      this.dataSource = new MatTableDataSource<QuestionnaireItemAnswerOption>(this.item.answerOption)
      if (item.answerOption.length > 5) this.applyPaginator = true
    }
  }
}
