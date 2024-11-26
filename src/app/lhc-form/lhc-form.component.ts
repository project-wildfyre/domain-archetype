import {AfterViewInit, Component, ElementRef, Input, ViewChild} from '@angular/core';
import {Questionnaire, QuestionnaireResponse} from "fhir/r4";
import Client from "fhirclient/lib/Client";

declare var LForms: any;

@Component({
  selector: 'app-lhc-form',
  templateUrl: './lhc-form.component.html',
  styleUrl: './lhc-form.component.scss'
})
export class LhcFormComponent implements AfterViewInit {

  ctx: Client | undefined

  @ViewChild('myFormContainer', {static: false}) mydiv: ElementRef | undefined;

  questionnaire : any;

  @Input()
  set formDefinition(questionnaire: Questionnaire | undefined) {
    this.questionnaire = questionnaire;
  }

  ngAfterViewInit(): void {
    if (this.questionnaire !== null) {
      this.populateQuestionnaireNoPopulation()
    }
  }

  populateQuestionnaireNoPopulation() {
    LForms.Util.setFHIRContext(this.ctx)
    let formDef = LForms.Util.convertFHIRQuestionnaireToLForms(this.questionnaire, "R4");
    var newFormData = (new LForms.LFormsData(formDef));
    try {
      const qr : QuestionnaireResponse = {
        resourceType: "QuestionnaireResponse", status: 'in-progress'

      }
      formDef = LForms.Util.mergeFHIRDataIntoLForms('QuestionnaireResponse', qr, newFormData, "R4");

      LForms.Util.addFormToPage(formDef, this.mydiv?.nativeElement, {prepopulate: false});
    } catch (e) {
      console.log(e)
      formDef = null;
    }
  }
}
