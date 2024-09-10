import { Component, EventEmitter, Output} from "@angular/core";
import { FormsModule } from "@angular/forms";
import { CommonModule } from "@angular/common";

@Component({
    selector: 'app-user-input',
    standalone:true,
    templateUrl : './user-input.component.html',
    styleUrl:'./user-input.component.css',
    imports:[FormsModule,CommonModule]
})


export class UserInputComponent {

  dropdownOpen: boolean = false;
  
  selectedFields = {
    id: false,
    name: false,
    versionnumber: false,
    callingcode: false
  };

  toggleDropdown() {
    this.dropdownOpen = !this.dropdownOpen;
  }

  searchId: string = '';
  select: string = ''
  @Output() search = new EventEmitter<{searchId:string, select :string}>();
  @Output() reset = new EventEmitter();

  onSearch() {
    if(this.selectedFields.id == true){
      if(this.select == ''){
        this.select = 'id';
      }else{
        this.select+= ',id'
      }
    }

    if(this.selectedFields.name == true){
      if(this.select == ''){
        this.select = 'name';
      }else{
        this.select+= ',name'
      }
    }

    if(this.selectedFields.versionnumber == true){
      if(this.select == ''){
        this.select = 'versionNumber';
      }else{
        this.select+= ',versionNumber'
      }
    }

    if(this.selectedFields.callingcode == true){
      if(this.select == ''){
        this.select = 'callingCode';
      }else{
        this.select+= ',callingCode'
      }
    }

      this.search.emit({
        searchId: this.searchId,
        select: this.select.trim()
      });
      console.log(this.select)
      this.select = "";

  }

  onReset() {
      this.reset.emit();
      this.select = "";
      this.searchId = "";
      this.selectedFields.callingcode = false
      this.selectedFields.id = false
      this.selectedFields.name = false
      this.selectedFields.versionnumber = false
  }
}