import {inject, Injectable} from '@angular/core';
import {Coding, QuestionnaireItem} from "fhir/r4";
import {ConceptPopupComponent} from "./diaglog/concept-popup/concept-popup.component";
import {MatDialog} from "@angular/material/dialog";

@Injectable({
  providedIn: 'root'
})
export class AppService {
  readonly dialog = inject(MatDialog);
  constructor() { }

  getCoded(code : Coding | undefined) {
    var retStr = ""
    if (code !== undefined && code.code !== undefined) {
      retStr = code.code
    }
    return retStr;
  }

  showSNOMED(code: Coding) {
    const dialogRef = this.dialog.open(ConceptPopupComponent, {
      data: code,
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }
}
