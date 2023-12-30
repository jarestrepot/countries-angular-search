import { Component, ElementRef, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { Subject, Subscription, debounceTime } from 'rxjs';

@Component({
  selector: 'shared-search-box',
  templateUrl: './search-box.component.html',
})
export class SearchBoxComponent implements OnInit, OnDestroy {

  private debouncerDescription?: Subscription;

  @ViewChild('inputTerm')
  public valueTerm!: ElementRef<HTMLInputElement>;

  private deBouncer: Subject<string> = new Subject<string>();

  @Input()
  public placeholder: string = 'Search by ...';

  @Input()
  public initialValue?:string;

  @Output()
  public onValue: EventEmitter<string> = new EventEmitter();

  @Output()
  public onDebounce: EventEmitter<string> = new EventEmitter();

  ngOnInit(): void {
    this.debouncerDescription = this.deBouncer
      .pipe(
        // Barrera para enmitir el nuevo valor. en este caso solo emite el valor cada segundo, si cambia
        debounceTime(400)
      )
      .subscribe(
        {
          next: ( value ) =>{
            this.onDebounce.emit( value )
          },
          error: ( error ) => {
            console.error( error );
          }
        }
      )
  }

  ngOnDestroy(): void {
    this.debouncerDescription?.unsubscribe();
  }

  sendTerm( valueTerm:string ): void {
    if( valueTerm.length <= 0 ){
      this.clearValues();
      return;
    }
    this.onValue.emit( valueTerm );
    this.clearValues();
  }

  private clearValues():void {
    this.valueTerm.nativeElement.value = '';
  }

  onKeyPress( searchTerm:string ):void {
    this.deBouncer.next( searchTerm );
  }
}
