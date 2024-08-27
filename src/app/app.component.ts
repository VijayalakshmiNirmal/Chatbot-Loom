import { Component,inject } from '@angular/core';
import { GeminiService } from './gemini.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterOutlet } from '@angular/router';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'languageAI';
 

  // prompt: string = '';

  // geminiService: GeminiService = inject(GeminiService);

  // loading: boolean = false;

  // chatHistory: any[] = [];
  // constructor() {
  //   // this.geminiService.getMessageHistory().subscribe((res) => {
  //   //   if(res) {
  //   //     this.chatHistory.push(res);
  //   //   }
  //   // })
  // }

  // async sendData() {
  //   if(this.prompt && !this.loading) {
  //     this.loading = true;
  //     const data = this.prompt;
  //     this.prompt = '';
  //     await this.geminiService.generateText(data);
  //     this.loading = false;
  //   }
  // }

  // formatText(text: string) {
  //   const result = text.replaceAll('*', '');
  //   return result;
  // }
}
