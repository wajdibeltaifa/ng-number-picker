import { Injectable } from '@angular/core';
import { buttonsOrientationType, sizeType } from './number-picker.config';

@Injectable({
  providedIn: 'root'
})
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
  pickerStartAfter = 500;
  /**
   * Delay betweens each pick
   */
  pickerTimer = 100;
  /**
   * value precision
   */
  precision = 1;
  /**
   * Inital picker value
   */
  value = null;
  /**
   * Encrease / decrease buttons orientation (h |v | horizontal | vertical)
   */
  buttonOrientation: buttonsOrientationType = 'h';
  /**
   * Input size (md | sm | lg | xlg)
   */
  size: sizeType = 'md';
  /**
   * Enable pick numbers with mouse wheel
   */
  mouseWheel = false;
  /**
   * Enable pick numbers with arrowKeys (up | down)
   */
  arrowKeys = true;
  /**
   * Postix input data
   */
  postfix = null;
  /**
   * Prefix input data
   */
  prefix = null;
}
