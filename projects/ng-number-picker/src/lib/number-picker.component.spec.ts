import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';

import { NumberPickerComponent } from './number-picker.component';
import { NumberPickerService } from './number-picker.service';

describe('NumberPickerComponent', () => {
  let component: NumberPickerComponent;
  let fixture: ComponentFixture<NumberPickerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ FormsModule ],
      providers: [NumberPickerService],
      declarations: [ NumberPickerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NumberPickerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
