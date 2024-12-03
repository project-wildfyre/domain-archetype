import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import {CovalentDynamicFormsModule} from "@covalent/dynamic-forms";
import {CovalentFlavoredMarkdownModule} from "@covalent/flavored-markdown";
import {CovalentMarkdownModule} from "@covalent/markdown";
import {CovalentHighlightModule} from "@covalent/highlight";
import {CovalentLayoutModule} from "@covalent/core/layout";
import {CovalentMessageModule} from "@covalent/core/message";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { FormDetailComponent } from './form-detail/form-detail.component';
import {MatTreeModule, MatTreeNode, MatTreeNodePadding, MatTreeNodeToggle} from "@angular/material/tree";
import { MatIconModule} from "@angular/material/icon";
import {MatButtonModule, MatIconButton} from "@angular/material/button";
import {MatChipsModule} from "@angular/material/chips";
import {MatTabsModule} from "@angular/material/tabs";
import {MatCardModule} from "@angular/material/card";
import {MatExpansionModule} from "@angular/material/expansion";
import { MatTableModule} from "@angular/material/table";
import {MatPaginator} from "@angular/material/paginator";
import {MatTooltip} from "@angular/material/tooltip";
import {MatToolbarModule} from "@angular/material/toolbar";
import {MatDialogModule} from "@angular/material/dialog";
import {MatMenuModule} from "@angular/material/menu";
import {A11yModule} from '@angular/cdk/a11y';
import {CodeDialogComponent} from "./dialog/code-dialog/code-dialog.component";
import {ConceptPopupComponent} from "./dialog/concept-popup/concept-popup.component";
import {HL7MappingComponent} from "./dialog/hl7-mapping/hl7-mapping.component";
import {MonacoEditorModule} from "ngx-monaco-editor-v2";
import {FormsModule} from "@angular/forms";
import {CovalentFileModule} from "@covalent/core/file";
import {InfoDiaglogComponent} from "./dialog/info-diaglog/info-diaglog.component";
import {FormAnswerComponent} from "./form-detail/form-answer/form-answer.component";
import {QuestionnaireEditComponent} from "./form-editor/questionnaire-edit.component";
import {LhcFormComponent} from "./form-preview/lhc-form.component";
import {FormDetailNodeComponent} from "./form-detail/form-detail-node/form-detail-node.component";
import {ClinicalCodingComponent} from "./widget/clinical-coding/clinical-coding.component";


@NgModule({
  declarations: [
    AppComponent,
    LhcFormComponent,
    FormDetailComponent,
    FormDetailNodeComponent,
    CodeDialogComponent,
    ConceptPopupComponent,
    FormAnswerComponent,
    HL7MappingComponent,
      QuestionnaireEditComponent,
      InfoDiaglogComponent,
      ClinicalCodingComponent
  ],
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        AppRoutingModule,
        CovalentLayoutModule,
        CovalentHighlightModule,
        CovalentMarkdownModule,
        CovalentFlavoredMarkdownModule,
        CovalentDynamicFormsModule,
        CovalentMessageModule,
        MatTabsModule,
        MatCardModule,
        MatTreeModule,
        MatIconModule,
        MatIconButton,
        MatChipsModule,
        MatExpansionModule,
        MatTableModule,
        MatPaginator,
        MatTooltip,
        MatToolbarModule,
        MatDialogModule,
        MatButtonModule,
        MatMenuModule,
        A11yModule,
        MonacoEditorModule.forRoot(),
        FormsModule,
        CovalentFileModule
    ],
  providers: [
    provideAnimationsAsync()
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
