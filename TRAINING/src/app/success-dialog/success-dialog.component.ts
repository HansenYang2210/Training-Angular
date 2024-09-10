import { CommonModule } from '@angular/common';
import { Component, inject, Input } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-success-dialog',
  standalone:true,
  templateUrl: './success-dialog.component.html',
  styleUrls: ['./success-dialog.component.css'],
  imports:[CommonModule]
})
export class SuccessDialogComponent {
  @Input() message: string = '';
  isVisible: boolean = false;
  private router = inject(Router);

  onOpen(message: string) {
    this.message = message;
    this.isVisible = true;
  }

  onClose() {
    this.isVisible = false;
    this.router.navigate([''], {
      replaceUrl: true
    });
  }
}
