// import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
// import { DomSanitizer } from '@angular/platform-browser';
// import { GeminiService } from '../gemini.service';
// import { NgxSpinnerService } from 'ngx-spinner';

// interface Message {
//   sender: 'user' | 'ai';
//   text: string;
// }

// @Component({
//   selector: 'app-chat-ai',
//   templateUrl: './chat-ai.component.html',
//   styleUrls: ['./chat-ai.component.css']
// })
// export class ChatAiComponent implements OnInit, OnDestroy {
//   transcription: string = '';
//   recognition: any;
//   recording = false;
//   responses: Message[] = [];
//   isLoading: boolean = false;

//   constructor(
//     private domSanitizer: DomSanitizer,
//     private cdr: ChangeDetectorRef,
//     private geminiService: GeminiService,
//     private spinner: NgxSpinnerService
//   ) {}

//   ngOnInit() {
//     this.initializeSpeechRecognition();
//   }

//   ngOnDestroy() {
//     if (this.recording) {
//       this.stopRecording();
//     }
//   }

//   // Initialize audio recording and speech recognition
//   initiateAudioRecording() {
//     this.recording = true;
//   }

//   startRecording() {
//     if (this.recognition) {
//       this.recognition.start();
//     }
//     this.initiateAudioRecording();
//   }

//   stopRecording() {
//     if (this.recognition) {
//       this.recognition.stop();
//     }
//     this.recording = false;

//     // After stopping recording, process the transcription
//     this.processTranscription();
//   }

//   initializeSpeechRecognition() {
//     const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
//     if (!SpeechRecognition) {
//       console.error('Speech Recognition API is not supported in this browser.');
//       return;
//     }

//     this.recognition = new SpeechRecognition();
//     this.recognition.interimResults = false;
//     this.recognition.continuous = false; // Set to false to get only final results
//     this.recognition.lang = 'en-US';

//     this.recognition.onresult = (event: any) => {
//       let finalTranscript = '';

//       for (const result of event.results) {
//         if (result.isFinal) {
//           finalTranscript += result[0].transcript + ' ';
//         }
//       }

//       this.transcription = finalTranscript.trim();
//       console.log('Full Transcription:', this.transcription);
//       this.cdr.detectChanges();
//     };

//     this.recognition.onerror = (event: any) => {
//       console.error('Speech recognition error:', event.error);
//     };
//   }

//   processTranscription() {
//     if (this.transcription.trim()) {
//       this.isLoading = true; // Show loading state
//       // Push user message
//       this.responses.push({ sender: 'user', text: this.transcription });

//       // Call Gemini service to get AI response
//       this.geminiService.generateText(this.transcription).then(() => {
//         this.isLoading = false; // Hide loading state
//       }).catch(error => {
//         console.error('Error generating AI response:', error);
//         this.isLoading = false; // Hide loading state on error
//       });

//       // Subscribe to AI response updates
//       this.geminiService.getResponseText().subscribe(response => {
//         if (response) {
//           // Push AI response
//           this.responses.push({ sender: 'ai', text: response });
//           this.cdr.detectChanges(); // Update the view
//         }
//       });

//       // Clear transcription after processing
//       this.transcription = '';
//     }
//   }

//   stop() {
//     this.stopRecording();
//   }
// }

// new
import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { GeminiService } from '../gemini.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { Subscription } from 'rxjs';

interface Message {
  sender: 'user' | 'ai';
  text: string;
}

@Component({
  selector: 'app-chat-ai',
  templateUrl: './chat-ai.component.html',
  styleUrls: ['./chat-ai.component.css']
})
export class ChatAiComponent {
//   transcription: string = '';
//   recognition: any;
//   recording = false;
//   responses: Message[] = [];
//   isLoading: boolean = false;
//   testStarted: boolean = false;
//   private responseSubscription: Subscription | null = null;
//   private hasProcessedTranscription: boolean = false;

//   constructor(
//     private cdr: ChangeDetectorRef,
//     private geminiService: GeminiService,
//     private spinner: NgxSpinnerService
//   ) {}

//   ngOnInit() {
//     this.initializeSpeechRecognition();
//     this.responseSubscription = this.geminiService.getResponseText().subscribe(response => {
//       if (response) {
//         this.responses.push({ sender: 'ai', text: response });
//         this.cdr.detectChanges();
//       }
//     });
//   }

//   ngOnDestroy() {
//     // if (this.recording) {
//     //   this.stopRecording();
//     // }
//     if (this.responseSubscription) {
//       this.responseSubscription.unsubscribe();
//     }
//   }

//   startTest() {
//     this.testStarted = true;
//     this.responses.push({ sender: 'ai', text: 'Welcome, how are you doing?' });
//   }

//   initiateAudioRecording() {
//     this.recording = true;
//     this.hasProcessedTranscription = false; // Reset flag at the start of recording
//   }

//   startRecording() {
//     if (this.recognition) {
//       this.transcription = ''; // Clear previous transcription before starting
//       this.recording = true;
//       this.hasProcessedTranscription = false; // Reset flag at the start of recording
//       this.recognition.start();
//     }
//   }
  
//   stopRecording() {
//     if (this.recognition) {
//       this.recognition.stop(); // This will trigger onend event
//     }
//     this.recording = false;
  
//     // Process the accumulated transcription after stopping
//     // if (!this.hasProcessedTranscription && this.transcription.trim()) {
//     //   this.processTranscription();
//     //   this.hasProcessedTranscription = true; // Ensure it is processed only once
//     // }
//   }
  

//   initializeSpeechRecognition() {
//     const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
//     if (!SpeechRecognition) {
//       console.error('Speech Recognition API is not supported in this browser.');
//       return;
//     }
  
//     this.recognition = new SpeechRecognition();
//     this.recognition.interimResults = false; // Only get final results
//     this.recognition.continuous = false;
//     this.recognition.lang = 'en-US';
  
//     this.recognition.onresult = (event: any) => {
//       let finalTranscript = '';
  
//       for (const result of event.results) {
//         if (result.isFinal) {
//           finalTranscript += result[0].transcript + ' ';
//         }
//       }
  
//       if (this.recording) {
//         this.transcription = finalTranscript.trim(); // Accumulate final results only
//       }
//     };
  
//     this.recognition.onerror = (event: any) => {
//       console.error('Speech recognition error:', event.error);
//     };
  
//     this.recognition.onend = () => {
//       // Optional: Handle actions when recognition ends (e.g., clean-up or logging)
//     };
//   }
  

//   // processTranscription() {
//   //   if (this.transcription.trim()) {
//   //     this.isLoading = true;
//   //     this.responses.push({ sender: 'user', text: this.transcription });
  
//   //     this.geminiService.generateText(this.transcription).finally(() => {
//   //       this.isLoading = false;
//   //       this.transcription = ''; // Clear transcription after processing
//   //     });
//   //   }
//   // }
  
//   // }
//   // processTranscription() {
//   //   if (this.transcription.trim()) {
//   //     this.isLoading = true;
//   //     this.responses.push({ sender: 'user', text: this.transcription });
  
//   //     this.geminiService.generateText(this.transcription).finally(() => {
//   //       this.isLoading = false;
//   //       this.transcription = ''; // Clear transcription after processing
  
//   //       // Check if a transition to the next part is needed
//   //       if (this.responses[this.responses.length - 1].text.includes('Please proceed to Part 2')) {
//   //         this.testStarted = false; // End the test or prompt the user to start the next part
//   //       }
//   //     });
//   //   }
//   // }
// }

// // 14/08
// // import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
// // import { GeminiService } from '../gemini.service';
// // import { NgxSpinnerService } from 'ngx-spinner';
// // import { Subscription } from 'rxjs';

// // @Component({
// //   selector: 'app-chat-ai',
// //   templateUrl: './chat-ai.component.html',
// //   styleUrls: ['./chat-ai.component.css']
// // })
// // export class ChatAiComponent implements OnInit, OnDestroy {
// //   transcription: string = '';
// //   recognition: any;
// //   recording = false;
// //   responses: { sender: 'user' | 'ai'; text: string }[] = [];
// //   isLoading: boolean = false;
// //   testStarted: boolean = false;
// //   private responseSubscription: Subscription | null = null;
// //   private hasProcessedTranscription: boolean = false;

// //   constructor(
// //     private cdr: ChangeDetectorRef,
// //     private geminiService: GeminiService,
// //     private spinner: NgxSpinnerService
// //   ) {}

// //   ngOnInit() {
// //     this.initializeSpeechRecognition();
// //     this.responseSubscription = this.geminiService.getResponseText().subscribe(response => {
// //       if (response) {
// //         this.responses.push({ sender: 'ai', text: response });
// //         this.cdr.detectChanges();
// //       }
// //     });
// //   }

// //   ngOnDestroy() {
// //     if (this.recording) {
// //       this.stopRecording();
// //     }
// //     if (this.responseSubscription) {
// //       this.responseSubscription.unsubscribe();
// //     }
// //   }

// //   startTest() {
// //     this.testStarted = true;
// //     this.responses.push({ sender: 'ai', text: 'Welcome, how are you doing?' });
// //     // this.geminiService.initializeExaminer().then(() => {
// //     //   this.responses.push({ sender: 'ai', text: 'You are going to be evaluated in three parts. Let’s start with some introductory questions.' });
// //     // });
// //   }

// //   startRecording() {
// //     if (this.recognition) {
// //       this.transcription = '';
// //       this.recognition.start();
// //       this.recording = true;
// //       this.hasProcessedTranscription = false;
// //     }
// //   }

// //   stopRecording() {
// //     if (this.recognition) {
// //       this.recognition.stop();
// //     }
// //     this.recording = false;
// //   }

// //   initializeSpeechRecognition() {
// //     const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
// //     if (!SpeechRecognition) {
// //       console.error('Speech Recognition API is not supported in this browser.');
// //       return;
// //     }

// //     this.recognition = new SpeechRecognition();
// //     this.recognition.interimResults = false;
// //     this.recognition.continuous = false;
// //     this.recognition.lang = 'en-US';

// //     this.recognition.onresult = (event: any) => {
// //       if (!this.hasProcessedTranscription) {
// //         let finalTranscript = '';

// //         for (const result of event.results) {
// //           if (result.isFinal) {
// //             finalTranscript += result[0].transcript + ' ';
// //           }
// //         }

// //         this.transcription = finalTranscript.trim();
// //         console.log('Full Transcription:', this.transcription);
// //         this.processTranscription();
// //         this.hasProcessedTranscription = true;
// //         this.cdr.detectChanges();
// //       }
// //     };

// //     this.recognition.onerror = (event: any) => {
// //       console.error('Speech recognition error:', event.error);
// //     };
// //   }

// //   processTranscription() {
// //     if (this.transcription.trim()) {
// //       this.isLoading = true;
// //       this.responses.push({ sender: 'user', text: this.transcription });

// //       this.geminiService.generateText(this.transcription).finally(() => {
// //         this.isLoading = false;
// //         this.transcription = '';
// //       });
// //     }
// //   }

// //   getConversationHistory() {
// //     return this.geminiService.getConversationHistory();
// //   }
// // }
}