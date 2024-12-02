import {Component, inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {CodeableConcept, Coding, Observation, ObservationComponent, QuestionnaireItem} from "fhir/r4";

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

    if (this.item.code !== undefined) {
      this.item.code.forEach(code => {
        if (code.extension !== undefined) {
          code.extension.forEach(ext => {
            if (ext.url == 'http://hl7.org/fhir/uv/sdc/StructureDefinition/sdc-questionnaire-observationExtract'
                && ext.valueBoolean !== undefined && ext.valueBoolean) {
                var newCode: Coding = {
                  system: code.system,
                  code: code.code,
                  display: code.display
                }
                concept.coding = [ newCode ]
            }
          })
        }
      })
    }

    if (this.item.extension !== undefined) {
      this.item.extension.forEach(ext => {
        if (ext.url == 'http://hl7.org/fhir/uv/sdc/StructureDefinition/sdc-questionnaire-observationExtract'
            && ext.valueBoolean !== undefined && ext.valueBoolean) {
          concept.coding = this.item.code
        }
      })
    }

    var observation :Observation = {
      resourceType: "Observation",
      status: "final",
      code: concept
    }
    if (this.item.extension !== undefined) {
      this.item.extension.forEach(ext => {
        if (ext.url == 'http://hl7.org/fhir/uv/sdc/StructureDefinition/sdc-questionnaire-observation-extract-category'
            && ext.valueCodeableConcept !== undefined ) {
          observation.category = [ ext.valueCodeableConcept ]
        }
      })
    }

    if (this.item.definition?.includes("valueQuantity")) {
      var valueQuantity = {
        "value": 0.0,
        "system": "http://unitsofmeasure.org",
        "code": this.getUnits()
      }
      if (this.item.definition?.includes("Observation#component")) {
        var obsComponent: ObservationComponent = {
          code: concept,
          valueQuantity: valueQuantity
        }
        // @ts-ignore
        observation.code = undefined
        observation.component = []
        observation.component.push(obsComponent)
      } else {
        observation.valueQuantity = valueQuantity
      }
    }
    if (this.item.definition?.includes("valueBoolean") || this.item.type == 'boolean') {
      observation.valueBoolean = true
    }
    if (this.item.definition?.includes("valueInteger") || this.item.type == 'integer') {
      observation.valueInteger = 12345
    }
    if (this.item.definition?.includes("valueCodeableConcept") || this.item.type == 'choice' || this.item.type == 'open-choice') {
      var codeableConcept = undefined
      if (this.item.answerOption !== undefined && this.item.answerOption[0].valueCoding !== undefined
      ) {
        codeableConcept = {
          "coding": [
            {
              "system": this.item.answerOption[0].valueCoding?.system,
              "code": this.item.answerOption[0].valueCoding?.code,
              "display": this.item.answerOption[0].valueCoding?.display
            }
          ]
        }
      }
      if (codeableConcept == undefined) {
        codeableConcept = {
          "coding": [
            {
              "system": "http://snomed.info/sct",
              "code": "{{selectedCode}}",
              "display": "The display term for the selected code"
            }
          ]
        }
      }
      if (this.item.definition?.includes("bodySite")) {
        // @ts-ignore
        observation.code = undefined
        observation.bodySite = codeableConcept
      } else if (this.item.definition?.includes("Observation#component")) {

      } else {
        observation.valueCodeableConcept = codeableConcept
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
