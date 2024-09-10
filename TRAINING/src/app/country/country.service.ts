import { inject, Injectable, signal, ViewChild } from "@angular/core";
import { Country } from "./country.model";
import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { catchError, map, throwError } from "rxjs";
import { InputModel } from "../user-input/user-input.model";
import { ErrorDialogComponent } from "../error-dialog/error-dialog.component";

@Injectable({
  providedIn: 'root',
})
export class CountriesService {
  private httpClient = inject(HttpClient);
  //private userPlaces = signal<Country[]>([]);
  @ViewChild(ErrorDialogComponent) modal!: ErrorDialogComponent;

  countries = signal<Country[] | undefined>(undefined);

  loadedCountries = this.countries.asReadonly();

  GetList(data : InputModel){
    const {id,pageNumber, pageSize, select} = data;
    let url = '';
    
    if(pageNumber==0 &&pageSize == 0){
      url = 'https://localhost:44321/api/v2/countries';
    }else{
      url = 'https://localhost:44321/api/v2/countries?PageNumber='+pageNumber+'&PageSize='+pageSize;
    }
    

    if(id!=''){
      url = 'https://localhost:44321/api/v2/countries?PageNumber='+pageNumber+'&PageSize='+pageSize+'&id='+id;
    }

    if(select!=''){
      if(url=='https://localhost:44321/api/v2/countries'){
        url = url + '?select=id,'+select;
      }else{
        url = url + '&select=id,'+select;
      }
    }

    return this.httpClient.get<{ Data: Country[],Next:boolean,PageNumber:number, PageSize:number }>(url)
    .pipe(
      map((response) => response),
      catchError((error : HttpErrorResponse) => {
        const errorCustom={
          Message : error.error?.Message,
          Title : error.error?.Title
        }
        return throwError(() => errorCustom);
    })
    )
    ;
  }

  removeCountry(country: Country) {
    const prevCountries = this?.countries();

    if (prevCountries?.some((p) => p.Id === country.Id)) {
      this.countries.set(prevCountries.filter(p => p.Id !== country.Id));
    }

    return this.httpClient.delete('https://localhost:44321/api/v2/countries/' + country.Id)
      .pipe(
        map(() => this.countries()),
        catchError(error => {
          this.countries.set(this.countries());
          return throwError(() => new Error('Failed to remove selected place.'));
        })
      );
  }

  addCountry(data : {name:string, callingCode:string}){
    const {name,callingCode} = data;
    
    return this.httpClient.post<{ Id: string,CallingCode :string }>('https://localhost:44321/api/v2/countries',{
      Name : name,
      CallingCode : callingCode
    }).pipe(
      map((response) => response),
      catchError((error : HttpErrorResponse) => {
          const errorCustom={
            Message : error.error?.Message,
            Title : error.error?.Title
          }
          return throwError(() => errorCustom);
      })
    )
  }

  getCountryById(id: string) {
    return this.httpClient.get<{ Id :string, VersionNumber : string, Name: string, CallingCode : string }>('https://localhost:44321/api/v2/countries/' + id)
    .pipe(
      map((response) => response),
      catchError((error : HttpErrorResponse) => {
        const errorCustom={
          Message : error.error?.Message,
          Title : error.error?.Title
        }
        return throwError(() => errorCustom);
    })
    )
    ;
  }

  updateCountry(data : {id :string,name:string, callingCode:string, versionNumber : string}){
    const {id,name,callingCode,versionNumber} = data;
    
    return this.httpClient.patch<{ Id: string, Operations :{
      op : string, path:string, value : string
    }[] }>('https://localhost:44321/api/v2/countries/' + id,{
      VersionNumber: versionNumber,
      Operations: [
        { op: 'replace', path: 'name', value: name },
        { op: 'replace', path: 'callingCode', value: callingCode }
      ]
    }).pipe(
      map((response) => response),
      catchError((error : HttpErrorResponse) => {
        const errorCustom={
          Message : error.error?.Message,
          Title : error.error?.Title
        }
        return throwError(() => errorCustom);
    })
    )
  }

}
