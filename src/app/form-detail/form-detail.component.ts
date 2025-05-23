import {Component, inject, Input} from '@angular/core';
import {Coding, Extension, Parameters, Questionnaire, QuestionnaireItem} from "fhir/r4";
import {FlatTreeControl} from "@angular/cdk/tree";
import {MatTreeFlatDataSource, MatTreeFlattener} from "@angular/material/tree";
import {MatDialog} from "@angular/material/dialog";
import {CodeDialogComponent} from "../dialog/code-dialog/code-dialog.component";
import {DataExtractComponent} from "../dialog/data-extraction/data-extract.component";
import {AppService} from "../app.service";
import {HttpClient} from "@angular/common/http";
import {DataPopulateComponent} from "../dialog/data-populate/data-populate.component";

/** Flat node with expandable and level information */
interface ItemFlatNode {
  expandable: boolean;
  name: string;
  level: number;
  item: QuestionnaireItem;
}

@Component({
  selector: 'app-form-detail',
  templateUrl: './form-detail.component.html',
  styleUrl: './form-detail.component.scss'
})
export class FormDetailComponent {

  @Input()
  set formDefinition(questionnaire: Questionnaire | undefined) {
    this.questionnaire = questionnaire;
    if (this.questionnaire?.item && this.questionnaire.item.length > 0) {
      this.dataSource.data = this.questionnaire?.item;
    }
  }
  readonly dialog = inject(MatDialog);
  readonly appService = inject(AppService)

  // not used: 'coding',
  displayedColumns: string[] = ['name', 'type','enabled','answer',  'required', 'repeats','sdc', 'fhir'];
  questionnaire : any;

  private _transformer = (node: QuestionnaireItem, level: number) : ItemFlatNode => {
    return {
      expandable: !!node.item && node.item.length > 0,
      name: (node.text !== undefined) ? node.text : '',
      level: level,
      item: node
    };
  };
  treeControl = new FlatTreeControl<ItemFlatNode>(
      node => node.level,
      node => node.expandable,
  );

  treeFlattener = new MatTreeFlattener(
      this._transformer,
      node => node.level,
      node => node.expandable,
      node => node.item
  );

  dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);


  hasChild = (_: number, node: ItemFlatNode) => node.expandable;

  showCode(item: QuestionnaireItem | undefined) {
    const dialogRef = this.dialog.open(CodeDialogComponent, {
      data: item,
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }
  showExtraction(item: QuestionnaireItem | undefined) {
    const dialogRef = this.dialog.open(DataExtractComponent, {
      data: item,
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }

  showPopulation(item: QuestionnaireItem | undefined) {
    const dialogRef = this.dialog.open(DataPopulateComponent, {
      data: item,
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
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

  getAnswerValueSet(item: QuestionnaireItem | undefined) {
    var retStr = ""
    if (item !== undefined && item.answerValueSet !== undefined) {
      var valueSet = decodeURI(item.answerValueSet).split('ecl')
      if (valueSet.length> 1) retStr = "SNOMED ecl = " + valueSet[1].replace('%2F','').replace('+',' ')
      else retStr = item.answerValueSet
    }
    return retStr;
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
  hasObservationExtraction(item: QuestionnaireItem | undefined) {
    var answer = false;
    if (item !== undefined && item.code !== undefined) {
      item.code.forEach(code => {
        if (code.extension !== undefined) {
          code.extension.forEach(ext => {
            if (ext.url == 'http://hl7.org/fhir/uv/sdc/StructureDefinition/sdc-questionnaire-observationExtract'
                && ext.valueBoolean !== undefined) {
              answer = ext.valueBoolean;
            }
          })
        }
      })
    }
    if (item !== undefined ) {
      if (item.extension !== undefined) {
          item.extension.forEach(ext => {
            if (ext.url == 'http://hl7.org/fhir/uv/sdc/StructureDefinition/sdc-questionnaire-observationExtract'
                && ext.valueBoolean !== undefined) {
              answer = ext.valueBoolean;
            }
          })
        }
    }
    return answer;
  }

    getPrePopulate(item: QuestionnaireItem | undefined) {
      var units = ''
      if (item !== undefined && item?.extension !== undefined) {
          item.extension.forEach(ext => {
            if (ext.url == 'http://hl7.org/fhir/uv/sdc/StructureDefinition/sdc-questionnaire-observationLinkPeriod'
                && ext.valueDuration !== undefined) {
              var code = ext.valueDuration?.code
              if (code === 'a') code = 'year(s)'
              if (code === 'mo') code = 'month(s)'
              units += ext.valueDuration?.value + ' ' + code
            }
          })
        }

        return units;
    }

  hasObservationPopulate(item: QuestionnaireItem | undefined) {
    var hasExt = false
    if (item !== undefined && item?.extension !== undefined) {
      item.extension.forEach(ext => {
        if (ext.url == 'http://hl7.org/fhir/uv/sdc/StructureDefinition/sdc-questionnaire-observationLinkPeriod') {
         hasExt = true
        }
      })
    }
    return hasExt;
  }

  getCategory(item: QuestionnaireItem | undefined) {
    var category = ''
    if (item !== undefined && item?.extension !== undefined) {
      item.extension.forEach(ext => {
        if (ext.url == 'http://hl7.org/fhir/uv/sdc/StructureDefinition/sdc-questionnaire-observation-extract-category'
            && ext.valueCodeableConcept !== undefined
            && ext.valueCodeableConcept.coding !== undefined) {

          category = 'Extraction Category: ' + ext.valueCodeableConcept.coding[0].code
        }
      })
    }
    return category;
  }

  hasDefinitionPopulate(item: QuestionnaireItem | undefined) {
    var hasExt = false
    if (item !== undefined && item?.extension !== undefined) {
      item.extension.forEach(ext => {
        if (ext.url == 'http://hl7.org/fhir/uv/sdc/StructureDefinition/sdc-questionnaire-itemPopulationContext'
        || ext.url == 'http://hl7.org/fhir/uv/sdc/StructureDefinition/sdc-questionnaire-initialExpression'
            || ext.url == 'http://hl7.org/fhir/uv/sdc/StructureDefinition/sdc-questionnaire-candidateExpression'
        || ext.url == 'http://hl7.org/fhir/uv/sdc/StructureDefinition/sdc-questionnaire-launchContext') {
          hasExt = true
        }
      })
    }
    return hasExt;
  }

  hasDefinitionExtraction(item: QuestionnaireItem | undefined) {
    var hasExt = false
    if (item?.definition !== undefined) return true;
    if (item !== undefined && item?.extension !== undefined) {
      item.extension.forEach(ext => {
        if (ext.url == 'http://hl7.org/fhir/uv/sdc/StructureDefinition/sdc-questionnaire-itemExtractionContext') {
          hasExt = true
        }
      })
    }
    return hasExt;
  }

  getExtractionContext(item: QuestionnaireItem) {
    var extension = this.getExtension('http://hl7.org/fhir/uv/sdc/StructureDefinition/sdc-questionnaire-itemExtractionContext', item)
    var text = ''
    if (extension !== null && extension?.valueExpression !== undefined) {
      if (extension.valueExpression.expression !== undefined) text += "- Expression: " + extension.valueExpression.expression + ' \n'
      if (extension.valueExpression.name !== undefined) text += "- Name: " + extension.valueExpression.name+ ' \n'
      if (extension.valueExpression.description !== undefined) text += "- Description: " + extension.valueExpression.description + ' \n'
      if (extension.valueExpression.language !== undefined) text += "- Language: " + extension.valueExpression.language + ' \n'
    }
    if (extension !== null && extension?.valueCode !== undefined) {
      if (extension.valueCode !== undefined) text += "- Code: " + extension.valueCode + ' \n'
    }
    if (text === '') return 'None';
    return text;
  }
  getExtension(uri: string, item: QuestionnaireItem): Extension | undefined {
    var extension : Extension | undefined
    if (item !== undefined && item.extension !== undefined) {
      item.extension.forEach( ext => {
        if (ext.url === uri ) extension = ext;
      })
    }
    return extension
  }
}
