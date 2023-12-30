import { Component, OnInit } from '@angular/core';
import { Country } from '../../interfaces/country';
import { CountriesService } from '../../services/countries.service';
import { Region } from '../../interfaces/region.type';



@Component({
  selector: 'countries-by-region-page',
  templateUrl: './by-region-page.component.html',
  styles: [
  ]
})
export class ByRegionPageComponent implements OnInit {

  public region: Country[] = [];
  public isLoading: boolean = false;
  public regions: Region[] = [ 'Africa', 'Americas', 'Asia', 'Europe', 'Oceania' ];
  public selectedRegion?:Region;

  constructor( private countryService: CountriesService ){}

  ngOnInit(): void {
    this.region = this.countryService.cacheStore.byRegion.countries;
    this.selectedRegion = this.countryService.cacheStore.byRegion.region;

  }
  searchByRegion( term: Region ){
    this.selectedRegion = term;
    this.isLoading = true;
    this.countryService.searchregion( term ).subscribe(
      {
        next: ( response: Country[] ) => this.region = response,
        error: ( error: Error ) => console.log( error.message ),
        complete: () => this.isLoading = false
      }
    );
  }
}
