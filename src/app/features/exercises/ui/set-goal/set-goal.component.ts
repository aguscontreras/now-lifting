import { AfterViewInit, Component, inject, ViewChild } from '@angular/core';
import {
  ModalController,
  IonHeader,
  IonFooter,
  IonButtons,
  IonToolbar,
  IonTitle,
  IonButton,
  IonItem,
  IonInput,
  IonSelectOption,
  IonSelect,
} from '@ionic/angular/standalone';
import { NumpadComponent, NumpadInputDirective } from '@shared/components';
import { FormsModule, NgForm } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-set-goal',
  templateUrl: './set-goal.component.html',
  styleUrl: './set-goal.component.scss',
  imports: [
    IonInput,
    IonItem,
    TranslateModule,
    IonButton,
    IonTitle,
    IonToolbar,
    IonButtons,
    IonFooter,
    IonHeader,
    FormsModule,
    NumpadComponent,
    NumpadInputDirective,
    IonSelectOption,
    IonSelect,
  ],
})
export class SetGoalComponent implements AfterViewInit {
  @ViewChild('input') input!: IonInput;
  private modalController = inject(ModalController);
  goal = 0;

  ngAfterViewInit(): void {
    this.input.setFocus();
  }

  onSubmit(form: NgForm) {
    if (form.invalid) {
      throw new Error('Form is invalid');
    }

    const numberGoal = Number(form.value['goal']);

    if (!isNaN(numberGoal)) {
      this.confirm(numberGoal);
    }
  }

  confirm(goal: number) {
    this.modalController.dismiss({ goal }, 'confirm');
  }

  cancel() {
    this.modalController.dismiss(null, 'cancel');
  }
}
