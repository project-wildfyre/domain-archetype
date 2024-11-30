import {Component, inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {CodeableConcept, Observation, QuestionnaireItem} from "fhir/r4";

@Component({
  selector: 'app-hl7-mapping',
  templateUrl: './hl7-mapping.component.html',
  styleUrl: './hl7-mapping.component.scss'
})
export class HL7MappingComponent {
  readonly dialogRef = inject(MatDialogRef<HL7MappingComponent>);
  readonly item = inject<QuestionnaireItem>(MAT_DIALOG_DATA);

  getUnits() {
    var units = ''
    if (this.item !== undefined && this.item?.extension !== undefined) {
      this.item.extension.forEach(ext => {
        if (ext.url == 'http://hl7.org/fhir/StructureDefinition/questionnaire-unitOption' && ext.valueCoding !== undefined) {
          units += ext.valueCoding.code
        }
      })
    }
    return units;
  }

  getDisplayTerm(str:string|undefined) {
    if (str == undefined) return ""
    return str
  }

  getFHIR() {
    if (this.item == undefined) return "";
    if (this.item.code == undefined) return ""
    var concept: CodeableConcept = {
      coding : this.item.code
    }
    var observation :Observation = {
      resourceType: "Observation",
      status: "final",
      code: concept
    }
    if (this.item.definition?.includes("valueQuantity")) {
      observation.valueQuantity = {
        "value": 0.0,
        "system": "http://unitsofmeasure.org",
        "code": this.getUnits()
      }
    }
    if (this.item.definition?.includes("valueBoolean") || this.item.type == 'boolean') {
      observation.valueBoolean = true
    }
    if (this.item.definition?.includes("valueInteger") || this.item.type == 'integer') {
      observation.valueInteger = 12345
    }
    if (this.item.definition?.includes("valueCodeableConcept") || this.item.type == 'choice' || this.item.type == 'open-choice') {
      if (this.item.answerOption !== undefined && this.item.answerOption[0].valueCoding !== undefined
      ) {
        observation.valueCodeableConcept = {
          "coding": [
            {
              "system": this.item.answerOption[0].valueCoding?.system,
              "code": this.item.answerOption[0].valueCoding?.code,
              "display": this.item.answerOption[0].valueCoding?.display
            }
          ]
        }
      }
      if (observation.valueCodeableConcept == undefined) {
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
    }
    return JSON.stringify(observation, undefined, 4);
  }

  getHL7v2OBX3() {
    if (this.item == undefined) return "";
    if (this.item.code == undefined) return ""
    var obx3=""
    this.item.code.forEach( code => {
          if (code.system == "http://snomed.info/sct") {
            if (obx3 !== '') obx3 += "~"
            obx3 += code.code + "^" + this.getDisplayTerm(code.display) + "^SNM3"
          }
          if (code.system == "http://loinc.org") {
            if (obx3 !== '') obx3 += "~"
            obx3 += code.code + "^" + this.getDisplayTerm(code.display) + "^LN"
          }
        }
    )
    return obx3;
  }

  getHL7v2OBX2() {
    if (this.item == undefined) return "";
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

    if (this.item.type == 'choice') {
      return "CE"
    }
    if (this.item.type == 'string') {
      return "ST"
    }
    if (this.item.type == 'quantity' || this.item.type == 'integer') {
      return "NM"
    }
    return obx2;
  }

  getHL7v2OBX5() {
    if (this.item == undefined) return "";
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

    if (this.item.type == 'choice') {
      obx5 += "{{valueCodeableConcept.coding.code}}^{{valueCodeableConcept.coding.display}}^covertToV2({{valueCodeableConcept.coding.system}})"
    }
    if (this.item.type == 'quantity') {
      obx5 += "0.00|" + this.getUnits()
    }
    if (this.item.type == 'integer') {
      obx5 += "12345"
    }
    return obx5;
  }

}
