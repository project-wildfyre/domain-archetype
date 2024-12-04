import {Component, inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {Extension, QuestionnaireItem} from "fhir/r4";

@Component({
  selector: 'app-data-populate',
  templateUrl: './data-populate.component.html',
  styleUrl: './data-populate.component.scss'
})
export class DataPopulateComponent {
  readonly dialogRef = inject(MatDialogRef<DataPopulateComponent>);
  readonly item = inject<QuestionnaireItem>(MAT_DIALOG_DATA);

  getCandidateExpression() {
    var text = ''
    var extension = this.getExtension('http://hl7.org/fhir/uv/sdc/StructureDefinition/sdc-questionnaire-candidateExpression')
    if (extension !== undefined && extension.valueExpression !== undefined) {
      if (extension.valueExpression.expression !== undefined) text += "- Expression: " + extension.valueExpression.expression + ' \n'
      if (extension.valueExpression.name !== undefined) text += "- Name: " + extension.valueExpression.name+ ' \n'
      if (extension.valueExpression.description !== undefined) text += "- Description: " + extension.valueExpression.description + ' \n'
      if (extension.valueExpression.language !== undefined) text += "- Language: " + extension.valueExpression.language + ' \n'
    }
    return text;
  }

  getInitialExpression() {
    var text = ''
    var extension = this.getExtension('http://hl7.org/fhir/uv/sdc/StructureDefinition/sdc-questionnaire-initialExpression')
    if (extension !== undefined && extension.valueExpression !== undefined) {
      if (extension.valueExpression.expression !== undefined) text += "- Expression: " + extension.valueExpression.expression + ' \n'
      if (extension.valueExpression.name !== undefined) text += "- Name: " + extension.valueExpression.name+ ' \n'
      if (extension.valueExpression.description !== undefined) text += "- Description: " + extension.valueExpression.description + ' \n'
      if (extension.valueExpression.language !== undefined) text += "- Language: " + extension.valueExpression.language + ' \n'
    }
    return text;
  }

  getPopulationContext() {
    var text = ''
    var extension = this.getExtension('http://hl7.org/fhir/uv/sdc/StructureDefinition/sdc-questionnaire-itemPopulationContext')
    if (extension !== undefined && extension.valueExpression !== undefined) {
      if (extension.valueExpression.expression !== undefined) text += "- Expression: " + extension.valueExpression.expression + ' \n'
      if (extension.valueExpression.name !== undefined) text += "- Name: " + extension.valueExpression.name+ ' \n'
      if (extension.valueExpression.description !== undefined) text += "- Description: " + extension.valueExpression.description + ' \n'
      if (extension.valueExpression.language !== undefined) text += "- Language: " + extension.valueExpression.language + ' \n'
    }
    return text;
  }

  getLaunch() {
    var text = ''
    var extension = this.getExtension('http://hl7.org/fhir/uv/sdc/StructureDefinition/sdc-questionnaire-launchContext')
   /* TODO
    if (extension !== undefined && extension.valueExpression !== undefined) {
      if (extension.valueExpression.expression !== undefined) text += "- Expression: " + extension.valueExpression.expression + ' \n'
      if (extension.valueExpression.name !== undefined) text += "- Name: " + extension.valueExpression.name
    }*/
    return text;
  }

  getExtension(uri: string): Extension | undefined {
    var extension : Extension | undefined
    if (this.item !== undefined && this.item.extension !== undefined) {
       this.item.extension.forEach( ext => {
         if (ext.url === uri ) extension = ext;
       })
    }
    return extension
  }
}
