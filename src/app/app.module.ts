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

@NgModule({
  declarations: [
    AppComponent
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
    CovalentMessageModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
