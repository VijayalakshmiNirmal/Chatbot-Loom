import { Component, EventEmitter, Output } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-popup-window',
  templateUrl: './popup-window.component.html',
  styleUrls: ['./popup-window.component.css']
})
export class PopupWindowComponent {
  userName: string = '';

  @Output() close = new EventEmitter<void>();
  @Output() nameSubmitted = new EventEmitter<string>();
  showPopup: boolean | undefined;

  closePopup() {
    this.close.emit();
  }

  saveName() {
    if (this.userName) {
      this.nameSubmitted.emit(this.userName);
      this.closePopup();
    } else {
      alert('Please enter your name');
    }
  }
  handleNameSubmitted(name: string) {
    this.userName = name;
    this.showPopup = false;  // Close the popup after the name is submitted
  }
}