import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, map, of, tap } from 'rxjs';
import { Country } from '../interfaces/country';
import { CacheStore } from '../interfaces/cache-store.interface';
import { Region } from '../interfaces/region.type';

@Injectable({
  providedIn: 'root'
})
export class CountriesService {

  private apiUrl: string = 'https://restcountries.com/v3.1';

  public cacheStore: CacheStore = {
    byCapital: { term: '', countries: [] },
    byCountry: { term: '', countries: [] },
    byRegion: { region: '', countries: [] },
  };

  constructor( private http: HttpClient ) {
    // Realizar acciones cuando carga e servicico
    this.loadFromLocalStorage();
  }

  private saveToLocalStorage():void {
    localStorage.setItem( 'cacheStore', JSON.stringify( this.cacheStore ) );
  }

  private loadFromLocalStorage() {
    if ( !localStorage.getItem( 'cacheStore' ) ) return;
    this.cacheStore = JSON.parse( localStorage.getItem( 'cacheStore' )! );
  }

  private getHttpCountriesRequest( url: string ): Observable<Country[]> {
    return this.http.get<Country[]>( url ).pipe(
      catchError( () => of([]) )
    )
  }

  serachCountyByAlphaCode( code:string ):Observable<Country | null> {
    return this.http.get< Country[] >(`${ this.apiUrl }/alpha/${ code }` ).pipe(
      map( country => country.length > 0 ? country[0] : null ),
      catchError( () => of(null) )
    )
  }

  searchCapital( term:string ):Observable<Country[]> {
    return this.getHttpCountriesRequest( `${this.apiUrl}/capital/${term}` )
      .pipe(
        tap(countries => this.cacheStore.byCapital = { term, countries } ), // Guardamos el valor de la busqueda
        tap( () => this.saveToLocalStorage() )
      );
  }

  searchCountry( term: string ): Observable<Country[]> {
    return this.getHttpCountriesRequest( `${this.apiUrl}/name/${term}` )
      .pipe(
        tap(countries => this.cacheStore.byCountry = { term, countries}),
        tap( () => this.saveToLocalStorage() )
      )
  }

  searchregion( region: Region ): Observable<Country[]> {
    return this.getHttpCountriesRequest( `${this.apiUrl}/region/${region}` )
      .pipe(
        tap( countries => this.cacheStore.byRegion = { region, countries } ),
        tap( () => this.saveToLocalStorage() )
      )
  }

}