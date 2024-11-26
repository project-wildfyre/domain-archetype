import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {DomSanitizer, SafeResourceUrl} from "@angular/platform-browser";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {QuestionnaireResponse} from "fhir/r4";
import Client from "fhirclient/lib/Client";

declare var LForms: any;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})


export class AppComponent implements OnInit {
  title = 'questionnaire-viewer';

  constructor(private route: ActivatedRoute,
              private sanitizer: DomSanitizer,
              private http: HttpClient) {
  }

  ctx: Client | undefined

  @ViewChild('myFormContainer', {static: false}) mydiv: ElementRef | undefined;

  ngOnInit() {

    this.route.queryParams.subscribe(params => {
        const questionnairePath = params['q'];
        if (questionnairePath !== null) {
          this.downloadQuestionnaire(questionnairePath)
        }
      }
    )
  }

  public downloadQuestionnaire(url: string) {
    fetch(url).then(data => {
      if (data.type == 'cors') {
        data.json().then(data2 => {
          console.log(data2)
          this.populateQuestionnaireNoPopulation(data2)
        })
      }
    })
  }

  populateQuestionnaireNoPopulation(questionnaire : any) {
    LForms.Util.setFHIRContext(this.ctx)
    let formDef = LForms.Util.convertFHIRQuestionnaireToLForms(questionnaire, "R4");
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
