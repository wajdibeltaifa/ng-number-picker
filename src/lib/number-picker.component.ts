import { Component, OnInit, Input, Output, EventEmitter, HostListener } from '@angular/core';
import { buttonsOrientationType, sizeType, CustomClasses } from './number-picker.config';
import { NumberPickerService } from '../public_api';

@Component({
  selector: 'ng-number-picker',
  template: `
  <div class="input-group mb-3 input-{{size}} {{customClass.container}}">
  <!-- Horizontal decrease button orientation -->
  <div class="input-group-prepend" *ngIf="isHorizontal() && showDownButton">
    <span class="input-group-text decrease {{customClass.down}}" (click)="onDecrease($event)"
    (mouseup)="onMouseUp($event, false)" (mousedown)="onMouseDown($event, false)">-</span>
  </div>
  <!-- Input prefix -->
  <div *ngIf="prefix" class="input-group-prepend">
    <span class="input-group-text {{customClass.prefix}}">{{prefix}}</span>
  </div>
  <input type="number" class="form-control" name="input-spin-val"
  [(ngModel)]="value"
  [readOnly]="inputReadOnly"
  (blur)="onBlur($event)"
  (focus)="onFocus($event)"
  (mousewheel)="mouseWheel && onMouseWheel($event)"
  (keyup)="arrowKeys && onKeyUp($event)"
  (keydown)="arrowKeys && onKeyDown($event)"
  (keydown.arrowup)="arrowKeys && onIncrease($event)"
  (keydown.arrowdown)="arrowKeys && onDecrease($event)"
  (change)="onValueChange($event)"
  [placeholder]="placeholder"
  >
  <!-- Input postfix -->
  <div *ngIf="postfix" class="input-group-prepend">
    <span class="input-group-text {{customClass.postfix}}" [style.borderLeft]="'0'">{{postfix}}</span>
  </div>
  <!-- Horizontal increase button orientation -->
  <div class="input-group-prepend" *ngIf="isHorizontal() && showUpButton">
    <span class="input-group-text increase {{customClass.up}}" [style.borderLeft]="(!postfix) ? '0' : ''" (click)="onIncrease($event)"
    (mouseup)="onMouseUp($event)" (mousedown)="onMouseDown($event)">+</span>
  </div>
  <!-- Vertical buttons orientation -->
  <div class="input-group-append" *ngIf="!isHorizontal()">
    <span class="input-group-text vertical p-0">
      <span *ngIf="showUpButton" class="{{customClass.up}}" (click)="onIncrease($event)" (mouseup)="onMouseUp($event)"
      (mousedown)="onMouseDown($event)">+</span>
      <span *ngIf="showDownButton" class="{{customClass.down}}" (click)="onDecrease($event)" (mouseup)="onMouseUp($event, false)"
      (mousedown)="onMouseDown($event, false)">-</span>
    </span>
  </div>
</div>
  `,
  styleUrls: ['./number-picker.css']
})
export class NumberPickerComponent implements OnInit {
  private precision: number;
  private eventHolder = null;
  private countInterval = null;
  private isInputFocused = false;

  @Input() min: number;
  @Input() max: number;
  @Input() step: number;
  @Input() value: number;
  @Input() pickStartAfter: number;
  @Input() pickTimer: number;
  @Input() prefix: string;
  @Input() postfix: string;
  @Input() placeholder: string;
  @Input() buttonsOrientation: buttonsOrientationType;
  @Input() size: sizeType = 'md';
  @Input() customClass: CustomClasses = {};
  @Input() mouseWheel = false;
  @Input() arrowKeys = true;
  @Input() inputReadOnly = false;
  @Input() showUpButton = true;
  @Input() showDownButton = true;
  @Output() valueChange: EventEmitter<number> = new EventEmitter();
  @Output() minReached: EventEmitter<boolean> = new EventEmitter();
  @Output() maxReached: EventEmitter<boolean> = new EventEmitter();
  @Output() pickStarted: EventEmitter<boolean> = new EventEmitter();
  @Output() pickStoped: EventEmitter<boolean> = new EventEmitter();
  @Output() pickUpStarted: EventEmitter<boolean> = new EventEmitter();
  @Output() pickUpStoped: EventEmitter<boolean> = new EventEmitter();
  @Output() pickDownStarted: EventEmitter<boolean> = new EventEmitter();
  @Output() pickDownStoped: EventEmitter<boolean> = new EventEmitter();

  constructor(private numberPickerService: NumberPickerService) { }

  ngOnInit() {
    this.initPicker();
  }

  isHorizontal(): boolean {
    return (this.buttonsOrientation !== 'v' && this.buttonsOrientation !== 'vertical');
  }

  onFocus(event: FocusEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.isInputFocused = true;
  }

  onBlur(event: Event) {
    event.preventDefault();
    event.stopPropagation();
    this.isInputFocused = false;
  }

  onMouseWheel(event: MouseWheelEvent) {
    if (this.isInputFocused) {
      event.preventDefault();
      let wheelUp = null;
      let delta = null;

      if (event.wheelDelta) {
        delta = event.wheelDelta / 60;
      } else if (event.detail) {
        delta = -event.detail / 2;
      }

      if (delta !== null) {
        wheelUp = delta > 0;
      }

      this.afterMouseWheels(wheelUp, event);
      event.stopPropagation();
    }
  }

  private afterMouseWheels(wheelUp: any, event: WheelEvent) {
    this.onPickStarted(wheelUp);
    if (wheelUp) {
      this.onIncrease(event);
    } else {
      this.onDecrease(event);
    }
    this.onPickStoped(wheelUp);
  }

  onValueChange(event: Event) {
    if (this.value > this.max) {
      this.value = this.max;
    } else if (this.value < this.min) {
      this.value = this.min;
    }
  }

  onDecrease(event: MouseEvent | MouseWheelEvent | KeyboardEvent) {
    event.preventDefault();
    if (this.canDecrease()) {
      this.value = this.round((this.value > this.min) ? this.value -= this.step : this.value);
      this.valueChange.emit(this.value);
    } else {
      this.minReached.emit(true);
    }
    event.stopPropagation();
  }

  onIncrease(event: MouseEvent | MouseWheelEvent | KeyboardEvent) {
    event.preventDefault();
    if (this.canIncrease()) {
      this.value = this.round((this.value < this.max) ? this.value += this.step : this.value);
      this.valueChange.emit(this.value);
    } else {
      this.maxReached.emit(true);
    }
    event.stopPropagation();
  }

  onMouseDown(event: MouseEvent, increase: boolean = true) {
    this.afterMouseDown(increase, event);
  }

  private isArrowUpDown(keyCode: number): boolean {
    return keyCode === 38 || keyCode === 40;
  }

  private isArowUp(keyCode: number): boolean {
    return keyCode === 38;
  }

  private loopPick(increase: boolean, event: MouseEvent | KeyboardEvent) {
    this.onPickStarted(increase);
    this.eventHolder = setTimeout(() => {
      this.countInterval = setInterval(() => {
        if (increase) {
          this.onIncrease(event);
        } else {
          this.onDecrease(event);
        }
      }, this.pickTimer);
    }, this.pickStartAfter);
  }

  onMouseUp(event: MouseEvent, increase: boolean = true) {
    this.afterMouseUp(increase, event);
  }

  onKeyDown(event: KeyboardEvent) {
    if (this.isArrowUpDown(event.keyCode)) {
      event.preventDefault();
      if (!this.eventHolder) {
        this.loopPick(this.isArowUp(event.keyCode), event);
      }
    }
    event.stopPropagation();
  }

  onKeyUp(event: KeyboardEvent) {
    if (this.isArrowUpDown(event.keyCode)) {
      event.preventDefault();
      this.afterPick(this.isArowUp(event.keyCode));
    }
    event.stopPropagation();
  }

  private afterMouseDown(up: boolean, event: MouseEvent) {
    event.preventDefault();
    if (this.isLeftClick(event.which)) {
      this.loopPick(up, event);
    }
    event.stopPropagation();
  }

  private afterMouseUp(up: boolean, event: MouseEvent) {
    event.preventDefault();
    this.afterPick(up);
    event.stopPropagation();
  }

  private afterPick(up: boolean) {
    this.onPickStoped(up);
    this.clearTimers();
  }

  private clearTimers() {
    clearTimeout(this.eventHolder);
    clearInterval(this.countInterval);
    this.eventHolder = null;
    this.countInterval = null;
  }

  private afterArrowKeysPressed(up: boolean, event: KeyboardEvent, start: boolean) {
    if (start) {
      this.loopPick(up, event);
    } else {
      this.afterPick(up);
    }
  }

  private parseVal(value: string | number) {
    if (typeof value === 'number') {
      return value;
    }

    return parseFloat(value);
  }

  private getPrecision(step: number): number {
    return /\d*$/.exec(String(step))[0].length;
  }

  private round(value: number): number {
    return Math.round(value * Math.pow(10, this.precision)) / Math.pow(10, this.precision);
  }

  private canIncrease(): boolean {
    const canIncrease = (this.value <= this.max - this.step);
    if (!canIncrease) {
      this.value = this.max;
    }
    return canIncrease;
  }

  private canDecrease(): boolean {
    const canDecrease = (this.value >= this.min + this.step);
    if (!canDecrease) {
      this.value = this.min;
    }
    return canDecrease;
  }

  private onPickStarted(increase: boolean) {
    if (increase) {
      if (this.canIncrease()) {
        this.pickStarted.emit(true);
        this.pickUpStarted.emit(true);
      }
    } else {
      if (this.canDecrease()) {
        this.pickStarted.emit(true);
        this.pickDownStarted.emit(true);
      }
    }
  }

  private onPickStoped(increase: boolean) {
    if (increase) {
      if (this.canIncrease()) {
        this.pickUpStoped.emit(true);
        this.pickStoped.emit(true);
      }
    } else {
      if (this.canDecrease()) {
        this.pickDownStoped.emit(true);
        this.pickStoped.emit(true);
      }
    }
  }

  private isLeftClick(witch: number): boolean {
    return witch === 1;
  }

  private initPicker(): void {
    this.min = this.parseVal(this.min) || this.numberPickerService.min;
    this.max = this.parseVal(this.max) || this.numberPickerService.max;
    this.step = this.parseVal(this.step) || this.numberPickerService.step;
    this.value = this.parseVal(this.value) || this.numberPickerService.value;
    this.pickStartAfter = this.parseVal(this.pickStartAfter) || this.numberPickerService.pickStartAfter;
    this.pickTimer = this.parseVal(this.pickTimer) || this.numberPickerService.pickTimer;
    this.precision = this.getPrecision(this.step) || this.numberPickerService.precision;
    this.value = this.round(this.value);
  }

}
