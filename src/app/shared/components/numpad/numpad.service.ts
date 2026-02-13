import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'any',
})
export class NumpadService {
  private activeInputElement = signal<HTMLIonInputElement | null>(null);
  private currentPrecision = signal<number>(0);

  setActiveInput(
    element: HTMLIonInputElement | null,
    precision?: number,
  ): void {
    precision = precision ?? 0;
    this.activeInputElement.set(element);
    this.currentPrecision.set(precision);
  }

  getActiveInput(): HTMLIonInputElement | null {
    return this.activeInputElement();
  }

  getCurrentPrecision(): number {
    return this.currentPrecision();
  }

  appendToActiveInput(value: string): void {
    const input = this.activeInputElement();
    if (input) {
      const currentValue = input.value;
      const newValue = currentValue + value;
      input.value = newValue;
      input.dispatchEvent(new Event('ionInput', { bubbles: true }));
    }
  }

  deleteFromActiveInput(): void {
    const input = this.activeInputElement();
    if (typeof input?.value === 'string') {
      if (input && input.value.length > 0) {
        input.value = input.value.slice(0, -1);
        input.dispatchEvent(new Event('ionInput', { bubbles: true }));
      }
    }
  }
}
