import {Component, Input} from '@angular/core';
import {CodeableConcept, Observation, Questionnaire, QuestionnaireItem} from "fhir/r4";

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
    if (item.definition?.includes("valueBoolean")) {
      observation.valueBoolean = true
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
          obx3 += code.code + "^" + this.getString(code.display) + "^SNM"
        }
        if (code.system == "http://loinc.org") {
          if (obx3 !== '') obx3 += "~"
          obx3 += code.code + "^" + this.getString(code.display) + "^LN"
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
    if (item.type == 'quantity') {
      return "NM"
    }
    return obx2;
  }

  getString(str:string|undefined) {
    if (str == undefined) return ""
    return str
  }

}
