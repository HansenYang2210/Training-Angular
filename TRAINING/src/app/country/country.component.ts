import { Component, DestroyRef, OnChanges, OnInit, SimpleChanges, ViewChild, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { type Country } from './country.model';
import { UserInputComponent } from '../user-input/user-input.component';
import { CountriesService } from './country.service';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { ErrorDialogComponent } from '../error-dialog/error-dialog.component';

@Component({
  selector: 'app-countries',
  standalone: true,
  imports: [CommonModule, UserInputComponent, FormsModule, RouterLink, RouterLinkActive, ErrorDialogComponent],
  templateUrl: './country.component.html',
  styleUrls: ['./country.component.css'],
})
export class CountryComponent implements OnInit, OnChanges {
  ngOnChanges(changes: SimpleChanges): void {
    this.bindcountryData();
  }
  @ViewChild(ErrorDialogComponent) modal!: ErrorDialogComponent;

  private countriesService = inject(CountriesService);
  private destroyRef = inject(DestroyRef);
  private router = inject(Router);

  countryID = signal('');
  pageNumber = signal(0);
  pageSize = signal(0);
  next = signal<boolean>(false);

  isFetching = signal(false);
  error = signal('');
  countries = signal<Country[] | undefined>(undefined); 
  searchResult = signal<Country[] | undefined>(undefined);

  ngOnInit() {
    this.bindcountryData();
  }

  bindcountryData() {
    this.isFetching.set(true);
    this.countriesService.GetList({id:this.countryID(), pageNumber: this.pageNumber(), pageSize: this.pageSize(),select:'' }).subscribe({
      next: (response) => {
        
        this.countries.set(response.Data);
        this.next.set(response.Next);
        this.pageNumber.set(response.PageNumber)
        this.pageSize.set(response.PageSize)
      },
      error: (error: Error) => {
        this.modal.onOpen(error.message, '');
        this.error.set(error.message);
      },
      complete: () => {
        this.isFetching.set(false);
      },
    });
  }

  onRemovecountry(country: Country) {
    const subscription = this.countriesService.removeCountry(country).subscribe({
      next: (countries) => {
        //this.countrys.set(countrys);  // Refresh the list
        //this.bindcountryData()
      },
      error: (error: Error) => {
        this.error.set(error.message);
      },
      complete:()=> {
        this.bindcountryData();
      }
    });

    this.destroyRef.onDestroy(() => subscription.unsubscribe());
  }

  onSubmit(data : {
    searchId : string,
    select : string
  }){
    const subscription = this.countriesService.GetList({id:data.searchId, pageNumber: this.pageNumber(), pageSize: this.pageSize(),select:data.select }).subscribe({
      next: (response) => {
        this.countries.set(response.Data);
        this.next.set(response.Next);
        this.pageNumber.set(response.PageNumber)
        this.pageSize.set(response.PageSize)
      },
      error: (error) => {
        this.modal.onOpen(error.Message, error.Title);
        this.error.set(error.message);
      },
      complete: () => {
        this.isFetching.set(false);
      },
    });
    this.destroyRef.onDestroy(() => subscription.unsubscribe());

  }

  onReset(){
    this.error.set('')
    this.pageNumber.set(0);
    this.pageSize.set(0);
    this.bindcountryData();
  }

  onUpdateCountry(countryID :string){
    this.router.navigate(['/country/',countryID], {
      replaceUrl: true
    });
  }

  previousPage(){
    this.pageNumber.set(this.pageNumber() - 1);
    this.bindcountryData();
  }

  nextPage(){
    this.pageNumber.set(this.pageNumber() + 1);
    this.bindcountryData();
  }

  onPageSizeChange(){
    this.bindcountryData();

  }
}
