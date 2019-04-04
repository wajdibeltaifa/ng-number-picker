import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';

import { NumberPickerModule } from 'ng-number-picker';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    NumberPickerModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
