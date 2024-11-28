import {Component, inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {QuestionnaireItem} from "fhir/r4";

@Component({
  selector: 'app-code-dialog',
  templateUrl: './code-dialog.component.html',
  styleUrl: './code-dialog.component.scss'
})
export class CodeDialogComponent {
  readonly dialogRef = inject(MatDialogRef<CodeDialogComponent>);
  readonly item = inject<QuestionnaireItem>(MAT_DIALOG_DATA);
  readonly jsonItem = JSON.stringify(this.item,undefined,4)
}
