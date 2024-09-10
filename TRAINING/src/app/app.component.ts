import { Component } from '@angular/core';
import { HeaderComponent } from './header/header.component';
import { UserInputComponent } from './user-input/user-input.component';
import { CountryComponent } from './country/country.component';
import { NewCountryComponent } from "./country/new-country/new-country.component";
import { RouterOutlet } from '@angular/router';


@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  imports: [UserInputComponent, CountryComponent, HeaderComponent, NewCountryComponent, RouterOutlet],
})
export class AppComponent {
}
