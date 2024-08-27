import { Component} from '@angular/core';
import { GeminiService } from '../gemini.service';
import { ActivatedRoute } from '@angular/router';
import { NgxSpinner, NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-intro',
  templateUrl: './intro.component.html',
  styleUrls: ['./intro.component.css']
})
export class IntroComponent {
  responseText: string = ''; // For displaying AI responses
  testCompleted: boolean = false;
  isRecording: boolean = false;
  recognition: any; // Type to `any` to avoid TypeScript errors
  finalTranscript: string = '';
  interimTranscript: string = '';
  

  constructor(public geminiService: GeminiService, private route: ActivatedRoute,  private spinner: NgxSpinnerService) {
    // Subscribe to responseText observable
    this.geminiService.getResponseText().subscribe(text => {
      this.responseText = text;
      if (!this.testCompleted) {
        this.speakResponse(text); // Speak intermediate AI responses
      }
    });

    // Subscribe to test completed status
    this.geminiService.getTestCompletedStatus().subscribe(status => {
      console.log('Test Completed Status:', status);
      this.testCompleted = status;
    });

    // Initialize speech recognition
    this.initializeSpeechRecognition();
  }

  public async onGetResultsClick(): Promise<void> {
    console.log('Get Results Button Clicked');
    if (this.testCompleted) {
      console.log('Fetching results...');
      
      this.spinner.show(); // Show the spinner before starting the request

      try {
        await this.geminiService.getResults(); // Await the results generation
        this.geminiService.getResponseText().subscribe(response => {
          this.responseText = response || ''; // Handle possible undefined
        });
      } catch (error) {
        console.error('Error fetching results:', error);
        this.responseText = 'An error occurred while fetching results.';
      } finally {
        this.spinner.hide(); // Hide the spinner when the request is complete
      }
    } else {
      console.warn('Test is not yet completed.');
    }
  }

  // onGetResultsClick() {
  //   console.log('Get Results Button Clicked');
  //   if (this.testCompleted) {
  //     console.log('Fetching results...');
  //     this.geminiService.getResults();
  //   } else {
  //     console.warn('Test is not yet completed.');
  //   }
  // }

  // Method to handle mic start and stop recording
  toggleRecording() {
    if (this.isRecording) {
      this.stopRecording();
    } else {
      this.startRecording();
    }
    this.isRecording = !this.isRecording;
  }

  startRecording() {
    if (this.recognition) {
      this.recognition.start();
      console.log('Starting recording...');
    }
  }

  stopRecording() {
    if (this.recognition) {
      this.recognition.stop();
      console.log('Stopping recording...');
      this.processAndSendInput(); // Process and send the transcript to AI
    }
  }

  initializeSpeechRecognition() {
    if (!('webkitSpeechRecognition' in window)) {
      console.error('Speech recognition not supported');
      return;
    }

    this.recognition = new (window as any).webkitSpeechRecognition();
    this.recognition.continuous = true;
    this.recognition.interimResults = true;
    this.recognition.lang = 'en-US';

    this.recognition.onresult = (event: { resultIndex: any; results: string | any[]; }) => {
      let transcript = '';
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        transcript += event.results[i][0].transcript;
      }
      this.interimTranscript = transcript;
    };

    this.recognition.onend = () => {
      if (this.isRecording) {
        console.log('Speech recognition ended unexpectedly. Restarting...');
        this.recognition.start();
      }
    };

    this.recognition.onerror = (event: { error: any; }) => {
      console.error('Speech recognition error:', event.error);
    };
  }

  speakResponse(text: string) {
    const utterance = new SpeechSynthesisUtterance(text);
    speechSynthesis.speak(utterance);
    console.log('Speaking response:', text);
  }

  processAndSendInput() {
    // Process the new input only if the final transcript is different from the interim transcript
    if (this.finalTranscript.trim() !== this.interimTranscript.trim()) {
      this.finalTranscript = this.interimTranscript;
      console.log('Final Transcript:', this.finalTranscript);
      this.geminiService.generateText(this.finalTranscript).catch(error => {
        console.error('Error:', error);
      });
      this.interimTranscript = ''; // Clear interim transcript
    }
  }
  
}
