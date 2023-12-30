import { Component, OnInit } from '@angular/core';
import { Country } from '../../interfaces/country';
import { CountriesService } from '../../services/countries.service';

@Component({
  selector: 'countries-by-country-page',
  templateUrl: './by-country-page.component.html',
  styles: [
  ]
})
export class ByCountryPageComponent implements OnInit {

  public country: Country[] = [];
  public isLoading: boolean = false;
  public initialValue: string = '';

  constructor(private countriesService: CountriesService ){}

  ngOnInit(): void {
    this.country = this.countriesService.cacheStore.byCountry.countries;
    this.initialValue = this.countriesService.cacheStore.byCountry.term;
  }

  searchByCountry( term:string ){
    this.isLoading = true;
    this.countriesService.searchCountry( term ).subscribe(
      {
        next: ( response:Country[] ) => {
          this.country = response
        },
        error: ( error ) => {
          console.error( error );
        },
        complete: () => this.isLoading = false
      }
    );
  }
}
