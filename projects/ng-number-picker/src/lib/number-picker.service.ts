import { Injectable } from '@angular/core';
import { buttonsOrientationType, sizeType } from './number-picker.config';
import { CustomClasses } from './number-picker.config';

@Injectable()
export class NumberPickerService {
  /**
   * Min picker value
   */
  min = 0;
  /**
   * Max picker value
   */
  max = 100;
  /**
   * Pick step value
   */
  step = 1;
  /**
   * Delay for start picking values
   */
  pickStartAfter = 500;
  /**
   * Delay betweens each pick
   */
  pickTimer = 100;
  /**
   * value precision
   */
  precision = 1;
  /**
   * Inital picker value
   */
  value = null;
}
