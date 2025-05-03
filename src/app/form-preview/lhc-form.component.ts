import {AfterViewInit, Component, ElementRef, Input, OnInit, ViewChild} from '@angular/core';
import {Questionnaire, QuestionnaireResponse} from "fhir/r4";
import Client from "fhirclient/lib/Client";
import {HttpClient} from "@angular/common/http";
import {client} from "fhirclient";


declare var LForms: any;

@Component({
  selector: 'app-lhc-form',
  templateUrl: './lhc-form.component.html',
  styleUrl: './lhc-form.component.scss'
})
export class LhcFormComponent implements OnInit, AfterViewInit {

  ctx: Client | undefined

  @ViewChild('myFormContainer', {static: false}) mydiv: ElementRef | undefined;

  questionnaire : any;
  private sdcServer: string = 'https://lforms-fhir.nlm.nih.gov/baseR4' ;

  @Input()
  set formDefinition(questionnaire: Questionnaire | undefined) {
    console.log("Setting Questionnaire")
    if (questionnaire == undefined) {
      console.log("Questionnaire is undefined")
    }
    this.questionnaire = questionnaire;
    if (this.questionnaire !== undefined) {
      this.populateQuestionnaireNoPopulation()
    }
  }

  constructor(

      private http: HttpClient

  ) {
  }

  ngOnInit(): void {
    this.ctx = client({
      serverUrl: this.sdcServer
    });

  }

  ngAfterViewInit(): void {
    console.log("After View Init")
    if (this.questionnaire !== undefined) {
      this.populateQuestionnaireNoPopulation()
    }
  }

  populateQuestionnaireNoPopulation() {
    console.log("Populating Questionnaire")
    LForms.Util.setFHIRContext(this.ctx)
    console.log(this.ctx)
    let formDef = LForms.Util.convertFHIRQuestionnaireToLForms(this.questionnaire, "R4");
    var newFormData = (new LForms.LFormsData(formDef));
    try {
      const qr : QuestionnaireResponse = {
        resourceType: "QuestionnaireResponse", status: 'in-progress'

      }

      formDef = LForms.Util.mergeFHIRDataIntoLForms('QuestionnaireResponse', qr, newFormData, "R4");

      LForms.Util.addFormToPage(formDef, this.mydiv?.nativeElement, {prepopulate: false, showQuestionCode: true});
    } catch (e) {
      console.log(e)
      formDef = null;
    }
  }

}
