import {Component, Input} from '@angular/core';
import {Questionnaire, QuestionnaireItem} from "fhir/r4";

@Component({
  selector: 'app-form-detail-node',
  templateUrl: './form-detail-node.component.html',
  styleUrl: './form-detail-node.component.scss'
})
export class FormDetailNodeComponent {

  item: QuestionnaireItem | undefined;
  questionnaire: Questionnaire | undefined;
  panelOpenState = false;

  @Input()
  set setItem(item: QuestionnaireItem) {
    this.item = item;
  }
  @Input()
  set setQuestionnaire(questionnaire: Questionnaire) {
    this.questionnaire = questionnaire;
  }

  getAnswer(item: QuestionnaireItem | undefined) {
    var retStr = ""
    if (item !== undefined && item.answerValueSet !== undefined) {
        var valueSet = decodeURI(item.answerValueSet).split('ecl')
        retStr = "ecl = " + valueSet[1].replace('%2F','').replace('+',' ')

    }
    return retStr;
  }
  getCoded(item: QuestionnaireItem | undefined) {
    var retStr = ""
    if (item !== undefined && item.code !== undefined) {
      item.code.forEach( coding => {
        if (coding.code !== undefined) retStr = coding.code
      })
    }
    return retStr;
  }
  hasAnswerType(item: QuestionnaireItem | undefined) : boolean {
    if (item == undefined) return false;
    if (item.answerValueSet !== undefined) return true;
    if (item.type !== "group") return true;
    return false
  }

  getUnits(item: QuestionnaireItem | undefined) {
    var units = ''
    if (item !== undefined && item?.extension !== undefined) {
      item.extension.forEach(ext => {
        if (ext.url == 'http://hl7.org/fhir/StructureDefinition/questionnaire-unitOption' && ext.valueCoding !== undefined) {
          units += ext.valueCoding.code
        }
      })
    }
    return units;
  }

  getQuestion(question: string) {
    if (this.questionnaire !== undefined) {
       return this.getQuestionItem(question, this.questionnaire.item)
    }
    return "";
  }
  getQuestionItem(question: string,items?: QuestionnaireItem[]) {
    if (items == undefined) return undefined
    var answer : string | undefined
    items.forEach(item => {
      if (answer == undefined) {
        if (question === item.linkId) {
          if (item.prefix !== undefined) answer = item.prefix + " " + item.text
          else answer = item.text
        } else {
          if (item.item !== undefined) answer = this.getQuestionItem(question, item.item)
        }
      }
    })
    return answer
  }
}
