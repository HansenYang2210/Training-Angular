import { Routes } from '@angular/router';
import { CountryComponent } from './country/country.component';
import { NewCountryComponent } from './country/new-country/new-country.component';
import { UpdateCountryComponent } from './country/update-country/update-country.component';

export const routes: Routes = [

    {
        path : '',
        component : CountryComponent,
    },
    {
        path : 'country/:countryId',
        component : UpdateCountryComponent
    },
    {
        path : 'add-country',
        component : NewCountryComponent
    },

];
