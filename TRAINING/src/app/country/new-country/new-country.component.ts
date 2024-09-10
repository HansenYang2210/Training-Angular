// new-country.component.ts
import {
  Component,
  DestroyRef,
  inject,
  signal,
  ViewChild,
} from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CountriesService } from '../country.service';
import { Router } from '@angular/router';
import { SuccessDialogComponent } from '../../success-dialog/success-dialog.component';
import { ErrorDialogComponent } from '../../error-dialog/error-dialog.component';

@Component({
  selector: 'app-new-country',
  standalone: true,
  templateUrl: './new-country.component.html',
  styleUrls: ['./new-country.component.css'],
  imports: [ReactiveFormsModule, SuccessDialogComponent, ErrorDialogComponent],
})
export class NewCountryComponent {
  private router = inject(Router);
  private destroyRef = inject(DestroyRef);
  private countriesService = inject(CountriesService);
  @ViewChild(SuccessDialogComponent) modal!: SuccessDialogComponent;
  @ViewChild(ErrorDialogComponent) modalError!: ErrorDialogComponent;

  CountryId = signal('');

  form = new FormGroup({
    country: new FormGroup({
      name: new FormControl('', {
        validators: [Validators.required],
        //validators: [Validators.required, Validators.pattern('^[a-zA-Z ]*$')],
      }),
      callingCode: new FormControl('', {
        validators: [Validators.required],
        //validators: [Validators.required, Validators.pattern('^[a-zA-Z ]*$')],
      }),
    }),
  });

  onSubmit() {
    if (this.form.invalid) {
      return;
    }

    const name = this.form.value.country?.name ?? '';
    const callingCode = this.form.value.country?.callingCode ?? '';

    const subscription = this.countriesService
      .addCountry({
        name: name,
        callingCode: callingCode,
      })
      .subscribe({
        next: (resData) => {
            this.modal.onOpen(`${name} has been added with ID = ${resData.Id}`);
        },
        error: (error) => {
          this.modalError.onOpen(error.Message, error.Title);
        },
        complete: () => {
          this.form.reset();
          this.destroyRef.onDestroy(() => subscription.unsubscribe());
        },
      });
  }

  onBack() {
    this.form.reset();
    this.router.navigate([''], {
      replaceUrl: true,
    });
  }
}
