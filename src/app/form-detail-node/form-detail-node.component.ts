import {Component, inject, Input} from '@angular/core';
import {CodeableConcept, Observation, Questionnaire, QuestionnaireItem, QuestionnaireItemAnswerOption} from "fhir/r4";
import {MatTableDataSource} from "@angular/material/table";
import {MatDialog} from "@angular/material/dialog";
import {CodeDialogComponent} from "../code-dialog/code-dialog.component";

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
  private applyPaginator: boolean = false;
  displayedColumns: string[] = ['initial', 'display', 'code',  'codesystem'];
  // @ts-ignore
  dataSource: MatTableDataSource<QuestionnaireItemAnswerOption>;

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
      this.applyPaginator = true
    }
  }
  @Input()
  set setQuestionnaire(questionnaire: Questionnaire) {
    this.questionnaire = questionnaire;
  }

  getAnswer(item: QuestionnaireItem | undefined) {
    var retStr = ""
    if (item !== undefined && item.answerValueSet !== undefined) {
        var valueSet = decodeURI(item.answerValueSet).split('ecl')
        if (valueSet.length> 1) retStr = "ecl = " + valueSet[1].replace('%2F','').replace('+',' ')
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

  getFHIR(item: QuestionnaireItem | undefined) {
    if (item == undefined) return "";
    if (item.code == undefined) return ""
    var concept: CodeableConcept = {
      coding : item.code
    }
    var observation :Observation = {
      resourceType: "Observation",
      status: "final",
      code: concept
    }
    if (item.definition?.includes("valueQuantity")) {
      observation.valueQuantity = {
        "value": 0.0,
          "system": "http://unitsofmeasure.org",
          "code": this.getUnits(item)
      }
    }
    if (item.definition?.includes("valueBoolean") || item.type == 'boolean') {
      observation.valueBoolean = true
    }
    if (item.definition?.includes("valueInteger") || item.type == 'integer') {
      observation.valueInteger = 12345
    }
    if (item.definition?.includes("valueCodeableConcept")) {
      observation.valueCodeableConcept = {
          "coding": [
            {
              "system": "http://snomed.info/sct",
              "code": "{{selectedCode}}",
              "display": "The display term for the selected code"
            }
          ]
        }

    }
    return JSON.stringify(observation, undefined, 4);
  }

  getHL7v2OBX3(item: QuestionnaireItem | undefined) {
    if (item == undefined) return "";
    if (item.code == undefined) return ""
    var obx3=""
    item.code.forEach( code => {
        if (code.system == "http://snomed.info/sct") {
          if (obx3 !== '') obx3 += "~"
          obx3 += code.code + "^" + this.getDisplayTerm(code.display) + "^SNM"
        }
        if (code.system == "http://loinc.org") {
          if (obx3 !== '') obx3 += "~"
          obx3 += code.code + "^" + this.getDisplayTerm(code.display) + "^LN"
        }
      }
    )
    return obx3;
  }

  getHL7v2OBX2(item: QuestionnaireItem | undefined) {
    if (item == undefined) return "";
    var obx2=""

    /*

    https://hl7-definition.caristix.com/v2/HL7v2.5.1/Tables/0125

CE Coded Entry
DT Date
ED FT Encapsulated Data
Formatted Text (Display)
NM Numeric
RP Reference Pointer
SN Structured Numeric
ST String Data.
TM Time
TS Time Stamp (Date & Time)
TX Text Data (Display)
     */

    if (item.type == 'choice') {
      return "CE"
    }
    if (item.type == 'string') {
      return "ST"
    }
    if (item.type == 'quantity' || item.type == 'integer') {
      return "NM"
    }
    return obx2;
  }

  getHL7v2OBX5(item: QuestionnaireItem | undefined) {
    if (item == undefined) return "";
    var obx5=""

    /*

    https://hl7-definition.caristix.com/v2/HL7v2.5.1/Tables/0125

CE Coded Entry
DT Date
ED FT Encapsulated Data
Formatted Text (Display)
NM Numeric
RP Reference Pointer
SN Structured Numeric
ST String Data.
TM Time
TS Time Stamp (Date & Time)
TX Text Data (Display)
     */

    if (item.type == 'choice') {
      obx5 += "{{conceptId}}^{{displayTerm}}^SNM"
    }
    if (item.type == 'quantity') {
      obx5 += "0.00|" + this.getUnits(item)
    }
    return obx5;
  }

  getDisplayTerm(str:string|undefined) {
    if (str == undefined) return ""
    return str
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

  getWarnings(item : QuestionnaireItem | undefined): string[] {
    var warnings : string[] = []
    if (item == undefined) return []
    if (item?.type == 'choice' && item?.code == undefined) warnings.push("Answer is a choice and the question is not coded")
    if (this.answersNotSNOMED(item)) warnings.push("Answers are not SNOMED coded")
    if (this.answersContainLOINC(item)) warnings.push("Answers contain LOINC coded entries")
    return warnings
  }

  showCode(item: QuestionnaireItem | undefined) {
    const dialogRef = this.dialog.open(CodeDialogComponent, {
      data: item,
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }
}
