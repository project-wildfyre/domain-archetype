import {Component, Input} from '@angular/core';
import {QuestionnaireItem} from "fhir/r4";

@Component({
  selector: 'app-form-detail-node',
  templateUrl: './form-detail-node.component.html',
  styleUrl: './form-detail-node.component.scss'
})
export class FormDetailNodeComponent {

  item: QuestionnaireItem | undefined;

  @Input()
  set itemnode(item: QuestionnaireItem) {
    this.item = item;
  }
  getAnswer(item: QuestionnaireItem | undefined) {
    var retStr = ""
    if (item !== undefined && item.answerValueSet !== undefined) {

        retStr = "ValueSet = " + decodeURI(item.answerValueSet)

    }
    return retStr;
  }
  getCoded(item: QuestionnaireItem | undefined) {
    var retStr = ""
    if (item !== undefined && item.code !== undefined) {
      item.code.forEach( coding => {
        retStr = "(" + coding.code + ")"
      })
    }
    return retStr;
  }
}
