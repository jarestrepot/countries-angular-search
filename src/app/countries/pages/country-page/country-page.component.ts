import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CountriesService } from '../../services/countries.service';
import { switchMap } from 'rxjs';
import { Country } from '../../interfaces/country';

@Component({
  selector: 'countries-country-page',
  templateUrl: './country-page.component.html',
  styles: [
  ]
})
export class CountryPageComponent implements OnInit {

  public country?: Country;

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private countriesSerive: CountriesService,
  ){}

  ngOnInit(): void {
    this.activatedRoute.params
      .pipe(
        switchMap(({ id }) => this.countriesSerive.serachCountyByAlphaCode( id ) ),
      )
      .subscribe(
        {
          next: ( res:Country | null  ) => {
            !res ? this.router.navigateByUrl('/countries/by-capital') : this.country = res;
          },
          error: err => console.log( err)
        },
      );
  }

}
