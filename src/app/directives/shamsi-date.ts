import { Directive, ElementRef, Input, OnChanges, SimpleChanges } from '@angular/core';
import { gregorianToShamsi, toShamsiDisplay } from '../utils/shamsi_data';

@Directive({
  selector: '[appShamsiDate]',
})
export class ShamsiDate implements OnChanges {
    // ورودی به همون اسم selector → استفاده: [appJalaliDate]="..."
  @Input('appShamsiDate') value: string = '';


 
 constructor(private elment: ElementRef<HTMLElement>) {}



  ngOnChanges(): void {
  this.elment.nativeElement.textContent = this.value ? toShamsiDisplay(this.value) : '';
  }

}
