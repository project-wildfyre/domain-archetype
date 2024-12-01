import {Component, inject, Input} from '@angular/core';
import {Coding, Questionnaire, QuestionnaireItem} from "fhir/r4";
import {FlatTreeControl} from "@angular/cdk/tree";
import {MatTreeFlatDataSource, MatTreeFlattener} from "@angular/material/tree";
import {MatDialog} from "@angular/material/dialog";
import {CodeDialogComponent} from "../diaglog/code-dialog/code-dialog.component";
import {ConceptPopupComponent} from "../diaglog/concept-popup/concept-popup.component";
import {HL7MappingComponent} from "../diaglog/hl7-mapping/hl7-mapping.component";
import {AppService} from "../app.service";




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
  displayedColumns: string[] = ['name', 'enabled', 'coding', 'type', 'required', 'repeats', 'answer',  'fhir'];
  questionnaire : any;

  private _transformer = (node: QuestionnaireItem, level: number) : ItemFlatNode => {
    return {
      expandable: !!node.item && node.item.length > 0,
      name: (node.text !== undefined) ? node.text : 'Missing text',
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
  showMapping(item: QuestionnaireItem | undefined) {
    const dialogRef = this.dialog.open(HL7MappingComponent, {
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


}
