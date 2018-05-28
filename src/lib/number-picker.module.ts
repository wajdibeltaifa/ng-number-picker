import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NumberPickerComponent } from './number-picker.component';
import { CommonModule } from '@angular/common';
import { NumberPickerService } from './number-picker.service';

@NgModule({
  imports: [
    CommonModule,
    FormsModule
  ],
  providers: [NumberPickerService],
  declarations: [NumberPickerComponent],
  exports: [NumberPickerComponent]
})
export class NumberPickerModule { }
