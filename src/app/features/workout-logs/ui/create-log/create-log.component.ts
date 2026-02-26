import { AfterViewInit, Component, inject, Input, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import {
  ModalController,
  IonItem,
  IonInput,
  IonSelect,
  IonSelectOption,
  IonFooter,
  IonToolbar,
  IonButtons,
  IonButton,
  IonHeader,
  IonTitle,
} from '@ionic/angular/standalone';
import { NumpadComponent, NumpadInputDirective } from '@shared/components';
import { DummyLog, WorkoutLog } from '@feat/workout-logs/models';

enum CreateLogStep {
  WEIGHT,
  REPS,
}

@Component({
  selector: 'app-create-log',
  templateUrl: './create-log.component.html',
  styleUrls: ['./create-log.component.scss'],
  imports: [
    IonTitle,
    IonHeader,
    IonButton,
    IonButtons,
    IonToolbar,
    IonFooter,
    ReactiveFormsModule,
    NumpadInputDirective,
    IonInput,
    IonItem,
    TranslateModule,
    NumpadComponent,
    IonSelect,
    IonSelectOption,
  ],
})
export class CreateLogComponent implements OnInit, AfterViewInit {
  private modalController = inject(ModalController);
  private formBuilder = inject(FormBuilder);

  @ViewChild('weightInput', { read: IonInput })
  private weightInput?: IonInput;

  @ViewChild('repsInput')
  private repsInput?: IonInput;

  @Input()
  private log?: WorkoutLog;

  form = this.createForm();
  focused: 'weight' | 'reps' = 'weight';
  showNumpad = false;
  step = CreateLogStep.WEIGHT;

  ngOnInit(): void {
    if (this.log) {
      this.form.patchValue({
        reps: String(this.log.reps),
        weight: String(this.log.weight)
      })
    }
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.weightInput?.setFocus();
    }, 0);
  }

  createForm() {
    return this.formBuilder.nonNullable.group({
      weight: ['', [Validators.required, Validators.pattern(/^(?!0+(\.0+)?$)(0|[1-9]\d*)(\.\d+)?$/)]],
      reps: ['', [Validators.required, Validators.pattern(/^[1-9]\d*$/)]],
    });
  }

  get f() {
    return this.form.controls;
  }

  onSubmit() {
    if (this.form.invalid) {
      throw new Error('Form is invalid');
    }

    const parsedFormValue = this.parseDummyLog();

    if (this.log) {
      this.confirm(parsedFormValue, 'update');
    } else {
      this.confirm(parsedFormValue);
    }
  }

  onValueChange(value: string) {
    this.f[this.focused].setValue(value);
  }

  onFocus(focus: 'weight' | 'reps') {
    this.focused = focus;
    this.showNumpad = true;
  }

  nextStep() {
    this.step = CreateLogStep.REPS;

    setTimeout(() => {
      this.repsInput?.setFocus();
    }, 1);
  }

  parseDummyLog(): DummyLog {
    return {
      weight: +this.f.weight.value,
      reps: +this.f.reps.value,
      oneRm: 0,
    };
  }

  cancel(action = 'cancel') {
    return this.modalController.dismiss(null, action);
  }

  confirm(result: DummyLog, action: 'create' | 'update' = 'create') {
    return this.modalController.dismiss(result, action);
  }
}
