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
import {MatCard, MatCardHeader, MatCardModule, MatCardTitle} from "@angular/material/card";
import {MatTab, MatTabGroup, MatTabsModule} from "@angular/material/tabs";
import { LhcFormComponent } from './lhc-form/lhc-form.component';
import { FormDetailComponent } from './form-detail/form-detail.component';
import {MatTree, MatTreeModule, MatTreeNode, MatTreeNodePadding, MatTreeNodeToggle} from "@angular/material/tree";
import {MatIcon, MatIconModule} from "@angular/material/icon";
import {MatIconButton} from "@angular/material/button";
import { FormDetailNodeComponent } from './form-detail-node/form-detail-node.component';

@NgModule({
  declarations: [
    AppComponent,
    LhcFormComponent,
    FormDetailComponent,
    FormDetailNodeComponent
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
        MatIconButton
    ],
  providers: [
    provideAnimationsAsync()
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
