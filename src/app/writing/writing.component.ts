import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { HttpClient } from '@angular/common/http';
import { WritingAsticaService } from '../writing-astica.service';

@Component({
  selector: 'app-writing',
  templateUrl: './writing.component.html',
  styleUrls: ['./writing.component.css']
})
export class WritingComponent implements OnInit {

  userDescription: string = '';
  evaluationResult: string = '';
  imagePreview: any = 'assets/img/writingQuestion.png'; // Static image URL

  constructor(private writingAsticaService: WritingAsticaService, private sanitizer: DomSanitizer) { }

  ngOnInit(): void {
    this.writingAsticaService.getResponseText().subscribe(
      response => this.evaluationResult = response  // Directly assign the response
    );
  }

  async analyzeImage(): Promise<void> {
    // Use static image URL for analysis
    const staticImageUrl = 'assets/img/writingQuestion.png';
    const imageBase64 = await this.convertImageUrlToBase64(staticImageUrl);
  
    if (typeof imageBase64 === 'string') {
      const asticaDescription = await this.writingAsticaService.getAsticaDescription(imageBase64);
  
      if (asticaDescription) {
        const response = await this.writingAsticaService.evaluateDescription(this.userDescription, asticaDescription);  // Ensure this returns a string
        this.evaluationResult = response;  // Directly assign the result
      } else {
        this.evaluationResult = 'Could not retrieve description from Astica API.';
      }
    } else {
      this.evaluationResult = 'Image conversion to Base64 failed.';
    }
  }

  private convertImageUrlToBase64(url: string): Promise<string | ArrayBuffer> {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.onload = () => {
        const reader = new FileReader();
        reader.onloadend = () => {
          resolve(reader.result as string);
        };
        reader.readAsDataURL(xhr.response);
      };
      xhr.onerror = () => reject('Error fetching image');
      xhr.open('GET', url);
      xhr.responseType = 'blob';
      xhr.send();
    });
  }
}