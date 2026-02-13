import { Directive, ElementRef, inject, OnInit, OnDestroy, input } from '@angular/core';
import { NumpadService } from './numpad.service';

@Directive({
  selector: 'ion-input[appNumpadInput]',
  standalone: true
})
export class NumpadInputDirective implements OnInit, OnDestroy {
  precision = input<number | undefined>(undefined);
  private el: ElementRef<HTMLIonInputElement> = inject(ElementRef);
  private numpadService = inject(NumpadService);

  ngOnInit(): void {
    const inputElement = this.el.nativeElement;
    
    inputElement.addEventListener('ionFocus', this.onFocus);
    inputElement.addEventListener('ionBlur', this.onBlur);
    // inputElement.setAttribute('readonly', 'true');
    inputElement.setAttribute('inputmode', 'none');
  }

  ngOnDestroy(): void {
    const inputElement = this.el.nativeElement;
    inputElement.removeEventListener('ionFocus', this.onFocus);
    inputElement.removeEventListener('ionBlur', this.onBlur);
  }

  private onFocus = (): void => {
    this.numpadService.setActiveInput(
      this.el.nativeElement, 
      this.precision()
    );
  };

  private onBlur = (): void => {
    // this.numpadService.setActiveInput(null);
  };
}