import {Component, Input} from '@angular/core';
import {AppService} from "../../app.service";
import {Coding, Questionnaire} from "fhir/r4";

@Component({
  selector: 'app-clinical-coding',
  templateUrl: './clinical-coding.component.html',
  styleUrl: './clinical-coding.component.scss'
})
export class ClinicalCodingComponent {
  constructor(public appService: AppService) {
  }
  coding: Coding[] =[]
  @Input()
  set setCoding(coding: Coding[] | undefined) {
    if (coding !== undefined) {
      this.coding = coding
    } else {
      this.coding = []
    }
  }
  @Input()
  set setCode(coding: Coding | undefined) {
    if (coding !== undefined) {
      this.coding = []
      this.coding.push(coding)
    } else {
      this.coding = []
    }
  }

  getDisplay(code : Coding | undefined) {
    if (code?.display == undefined) return "";
    return code.display
  }
}
