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
  private sdcServer: string = 'https://3cdzg7kbj4.execute-api.eu-west-2.amazonaws.com/poc/events/FHIR/R4' ;

  @Input()
  set formDefinition(questionnaire: Questionnaire | undefined) {
    this.questionnaire = questionnaire;
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

  /*
  downloadFile(fileName: string, results: Object) {
    const data = JSON.stringify(results, undefined, 2);
    const blob = new Blob([data], {
      type: 'application/json'
    });
    //const url = this.sanitizer.bypassSecurityTrustResourceUrl(
    let url = window.URL.createObjectURL(blob);
    // @ts-ignore
    window.open(url);
  }
  extract(newQuestionnaireResponse: QuestionnaireResponse, fileName : string | undefined)
  {
    this.http.post(this.sdcServer + '/QuestionnaireResponse/$extract', newQuestionnaireResponse).subscribe(bundleResult => {

          if (bundleResult !== undefined) {
            let bundle = bundleResult as Bundle
            if (fileName !== undefined) {
              this.downloadFile(fileName,bundleResult)
            }
            if (bundle !== undefined && bundle.entry !== undefined) {

              this.http.post(this.sdcServer + '/', bundle).subscribe((bundle) => {
                  },
                  error => {
              
                    console.log(JSON.stringify(error))
                  })
            }
          }

        },
        error => {
          console.log(JSON.stringify(newQuestionnaireResponse))
          
        })
  } */
}
