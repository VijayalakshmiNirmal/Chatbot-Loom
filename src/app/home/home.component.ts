// home.component.ts
import { Component, OnInit, OnDestroy, ChangeDetectorRef, Output } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import * as RecordRTC from 'recordrtc';
import { GeminiService } from '../gemini.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { Router } from '@angular/router';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  userName: string = '';
  constructor(private router: Router, private geminiService: GeminiService) {}

  showPopup = false;

  popup() {
    this.showPopup = true;
  }

  closePopup() {
    this.showPopup = false;
  }
  handleNameSubmitted(name: string) {
    this.userName = name;
    this.showPopup = false;

    // Pass the user's name to the GeminiService
    this.geminiService.setUserName(this.userName);

    // Navigate to the IntroComponent and pass the user's name as a query parameter
    this.router.navigate(['/speaking'], { queryParams: { name: this.userName } });
    this.geminiService.setUserName(this.userName);

  }

  navigateToWriting() {
    this.router.navigate(['/writing']);
  }
}