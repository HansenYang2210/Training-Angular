// new-country.component.ts
import { Component, DestroyRef, inject, input, OnInit, signal, ViewChild } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CountriesService } from '../country.service';
import { Router } from '@angular/router';
import { SuccessDialogComponent } from '../../success-dialog/success-dialog.component';
import { Country } from '../country.model';
import { ErrorDialogComponent } from "../../error-dialog/error-dialog.component";

@Component({
  selector: 'app-update-country',
  standalone: true,
  templateUrl: './update-country.component.html',
  styleUrls: ['./update-country.component.css'],
  imports: [ReactiveFormsModule, SuccessDialogComponent, ErrorDialogComponent]
})
export class UpdateCountryComponent implements OnInit{
  private router = inject(Router);
  private destroyRef = inject(DestroyRef);
  private countriesService = inject(CountriesService);
  @ViewChild(ErrorDialogComponent) modalError!: ErrorDialogComponent;

  @ViewChild(SuccessDialogComponent) modal!: SuccessDialogComponent;
  countryId = input.required<string>();
  isFetching = signal(false);
  error = signal('');
  versionNumber = signal('');

  ngOnInit(): void {
    this.countriesService.getCountryById(this.countryId()).subscribe({
      next: (response) => {
        this.versionNumber.set(response.VersionNumber);
        this.form.setValue({
          country:{
            name : response.Name,
            callingCode : response.CallingCode
          }
        })

      },
      error: (error: Error) => {
        this.error.set(error.message);
      },
      complete: () => {
        this.isFetching.set(false);
      },
    });
  }
  form = new FormGroup({
    country: new FormGroup({
      name: new FormControl('', {
        validators: [Validators.required, Validators.pattern('^[a-zA-Z ]*$')]
      }),
      callingCode: new FormControl('', {
        validators: [Validators.required, Validators.pattern('^[a-zA-Z ]*$')]
      }),
    }),
  });

  onSubmit() {
    if (this.form.invalid) {
      return;
    }

    const name = this.form.value.country?.name ?? '';
    const callingCode = this.form.value.country?.callingCode ?? '';
   
    const subscription = this.countriesService.updateCountry({
      id : this.countryId(),
      name: name,
      callingCode: callingCode,
      versionNumber : this.versionNumber()
    }).subscribe({
      next: (resData) => {
          this.modal.onOpen('Update Data Succesfully');
      },
      error: (error) => {
        this.modalError.onOpen(error.Message, error.Title);
      },
      complete: () => {
        this.form.reset();
        this.destroyRef.onDestroy(() => subscription.unsubscribe());
      }
    });
  }

  onBack() {
    this.form.reset();
    this.router.navigate([''], {
      replaceUrl: true
    });
  }
}
