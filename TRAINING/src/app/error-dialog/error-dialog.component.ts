import { CommonModule } from '@angular/common';
import { Component, inject, Input } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-error-dialog',
  standalone:true,
  templateUrl: './error-dialog.component.html',
  styleUrls: ['./error-dialog.component.css'],
  imports:[CommonModule]
})
export class ErrorDialogComponent {
  @Input() message: string = '';
  @Input() title: string = '';
  isVisible: boolean = false;

  onOpen(message: string, title : string) {
    this.message = message;
    this.title = title;
    this.isVisible = true;
  }

  onClose() {
    this.isVisible = false;
    
  }
}
