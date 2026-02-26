import { Component, input, inject, OnInit, effect } from '@angular/core';
import {
  IonGrid,
  IonRow,
  IonCol,
  IonButton,
  IonIcon,
} from '@ionic/angular/standalone';
import { NumpadService } from './numpad.service';
import { addIcons } from 'ionicons';
import { arrowForwardCircle, backspace, checkmarkCircle } from 'ionicons/icons';

interface NumpadButton {
  label?: string;
  icon?: string;
  action: () => void;
}

interface NumpadRow {
  buttons: NumpadButton[];
}

interface NumpadConfig {
  rows: NumpadRow[];
}

type ActionButtonName = 'backspace' | 'check' | 'arrow';

@Component({
  selector: 'app-numpad',
  standalone: true,
  imports: [IonGrid, IonRow, IonCol, IonButton, IonIcon],
  templateUrl: './numpad.component.html',
  styleUrls: ['./numpad.component.scss'],
})
export class NumpadComponent implements OnInit {
  private numpadService = inject(NumpadService);
  actionButton = input<ActionButtonName | undefined>('backspace');

  config: NumpadConfig = {
    rows: [
      {
        buttons: [
          { label: '1', action: () => this.appendDigit('1') },
          { label: '2', action: () => this.appendDigit('2') },
          { label: '3', action: () => this.appendDigit('3') },
        ],
      },
      {
        buttons: [
          { label: '4', action: () => this.appendDigit('4') },
          { label: '5', action: () => this.appendDigit('5') },
          { label: '6', action: () => this.appendDigit('6') },
        ],
      },
      {
        buttons: [
          { label: '7', action: () => this.appendDigit('7') },
          { label: '8', action: () => this.appendDigit('8') },
          { label: '9', action: () => this.appendDigit('9') },
        ],
      },
      {
        buttons: [
          { label: '.', action: () => this.appendDecimal() },
          { label: '0', action: () => this.appendDigit('0') },
        ],
      },
    ],
  };

  private actionButtons: Map<ActionButtonName, NumpadButton> = new Map();

  constructor() {
    addIcons({ backspace, arrowForwardCircle, checkmarkCircle });

    this.actionButtons.set('backspace', {
      icon: 'backspace',
      action: () => this.deleteLastDigit(),
    });

    this.actionButtons.set('arrow', {
      icon: 'arrow-forward-circle',
      action: () => this.nextStep(),
    });

    this.actionButtons.set('check', {
      icon: 'checkmark-circle',
      action: () => this.ckeck(),
    });

    effect(() => {
      const action = this.actionButton();

      if (!!action) {
        const lastIndex = this.config.rows.length - 1;
        const lastRowButtons = this.config.rows[lastIndex].buttons;
        const button = this.actionButtons.get(action);
        if (button) lastRowButtons.push(button);
      }
    });
  }

  ngOnInit(): void {}

  private nextStep() {}

  private ckeck() {}

  private appendDigit(digit: string): void {
    const input = this.numpadService.getActiveInput();

    if (!input) return;

    const currentValue = input.value;
    const precision = this.numpadService.getCurrentPrecision();

    if (typeof currentValue === 'string') {
      const decimalIndex = currentValue.indexOf('.');

      if (decimalIndex !== -1) {
        const decimalsCount = currentValue.length - decimalIndex - 1;
        if (decimalsCount >= precision) {
          return;
        }
      }
    }

    this.numpadService.appendToActiveInput(digit);
  }

  private appendDecimal(): void {
    const input = this.numpadService.getActiveInput();
    if (!input) return;

    const currentValue = input.value;
    const precision = this.numpadService.getCurrentPrecision();

    if (precision === 0) {
      return;
    }

    if (typeof currentValue === 'string') {
      if (!currentValue.includes('.')) {
        const newValue = currentValue === '' ? '0.' : '.';
        this.numpadService.appendToActiveInput(newValue);
      }
    }
  }

  private deleteLastDigit(): void {
    this.numpadService.deleteFromActiveInput();
  }
}
