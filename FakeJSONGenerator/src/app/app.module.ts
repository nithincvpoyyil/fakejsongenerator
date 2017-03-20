import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { AppComponent } from './app.component';
import { InputComponent } from './inputComponent/input.component';
import { PouchService } from "./pouchdb.service";
import {SharedService} from "./coreModule/shared.service"

@NgModule({
    declarations: [
        AppComponent,
        InputComponent
    ],
    entryComponents:[InputComponent],
    imports: [
        BrowserModule,
        FormsModule,
        HttpModule
    ],
    providers: [PouchService,SharedService],
    bootstrap: [AppComponent]
})
export class AppModule { }
