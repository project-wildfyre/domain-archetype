import {Component, inject, Input} from '@angular/core';
import {
  CodeableConcept,
  Observation,
  Questionnaire,
  QuestionnaireItem
} from "fhir/r4";
import {MatDialog} from "@angular/material/dialog";

@Component({
  selector: 'app-form-detail-node',
  templateUrl: './form-detail-node.component.html',
  styleUrl: './form-detail-node.component.scss'
})
export class FormDetailNodeComponent {
  readonly dialog = inject(MatDialog);
  item: QuestionnaireItem | undefined;
  questionnaire: Questionnaire | undefined;
  panelOpenState = false;



  @Input()
  set setQuestionnaire(questionnaire: Questionnaire) {
    this.questionnaire = questionnaire;
  }


  hasAnswerType(item: QuestionnaireItem | undefined) : boolean {
    if (item == undefined) return false;
    if (item.answerValueSet !== undefined) return true;
    if (item.type !== "group") return true;
    return false
  }



  getWarnings(item : QuestionnaireItem | undefined): string[] {
    var warnings : string[] = []
    if (item == undefined) return []
    if (item?.type == 'choice' && item?.code == undefined) warnings.push("Answer is a choice and the question is not coded")
    if (this.answersNotSNOMED(item)) warnings.push("Answers are not SNOMED coded")
    if (this.answersContainLOINC(item)) warnings.push("Answers contain LOINC coded entries")
    return warnings
  }
  answersNotSNOMED(item: QuestionnaireItem | undefined) {
    if (item == undefined || item.answerOption == undefined) return false
    var answer = false
    item.answerOption.forEach(option => {
      if (option.valueCoding !== undefined) {
        if (option.valueCoding.system == undefined) answer = true
        if (option.valueCoding.system !== 'http://snomed.info/sct') answer = true
      }
    })
    return answer
  }

  answersContainLOINC(item: QuestionnaireItem | undefined) {
    if (item == undefined || item.answerOption == undefined) return false
    var answer = false
    item.answerOption.forEach(option => {
      if (option.valueCoding !== undefined) {
        if (option.valueCoding.system !== undefined && option.valueCoding.system == 'http://loinc.org') answer = true
      }
    })
    return answer
  }


}
