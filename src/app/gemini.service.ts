import { Injectable } from '@angular/core';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GeminiService {
  private userName: string = '';

  public setUserName(name: string): void {
    this.userName = name;
    console.log('User name set in GeminiService:', this.userName);
  }

  public getUserName(): string {
    return this.userName;
  }

  private generativeAI: GoogleGenerativeAI;
  private responseText: BehaviorSubject<string> = new BehaviorSubject<string>('');
  private conversationHistory: string[] = [];
  private currentPart: number = 1; 
  private testCompleted: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  private initialInstructions: string[] = [
    "You are an IELTS speaking examiner. Start by welcoming the candidate. Ask the candidate to introduce themselves. Then, ask 5-6 questions about common topics such as family, work, studies, and hobbies. Wait for the candidate's response before asking the next question. Conclude by thanking the candidate and saying goodbye."
  ];

  constructor() {
    this.generativeAI = new GoogleGenerativeAI('your-api-key');
    this.initializeExam();
  }

  public initializeExam() {
    this.conversationHistory = [];
    this.currentPart = 1;
    this.testCompleted.next(false);
  }

  public constructPrompt(userInput: string): string {
    const userName = this.getUserName();
    let prompt = `The conversation is in progress.\n`;
    prompt += `Candidate Name: ${userName}\n`;

    this.initialInstructions.forEach(instruction => {
      prompt += `${instruction}\n`;
    });

    if (this.conversationHistory.length > 0) {
      prompt += `Conversation history so far:\n`;
      this.conversationHistory.forEach((entry, index) => {
        prompt += `${index % 2 === 0 ? 'Candidate' : 'Examiner'}: ${entry}\n`;
      });
    }

    prompt += `Candidate: "${userInput}"\n`;
    prompt += `Please respond naturally to the candidate's input without repeating questions or generating conversations on your own. Analyse this conversation history above. If you feel you have asked around 5-6 questions, Conclude with "Thank you for taking this test, goodbye" after the user answers your last question.`;

    console.log('Prompt sent to AI:', prompt);

    return prompt;
  }

  public updateConversationHistory(userInput: string, response: string) {
    this.conversationHistory.push(userInput);
    this.conversationHistory.push(response);
  }

  public async generateText(userInput: string): Promise<void> {
    try {
      const prompt = this.constructPrompt(userInput);

      const model = this.generativeAI.getGenerativeModel({ model: 'gemini-1.5-flash-latest' });
      const result = await model.generateContent(prompt);
      const response = await result.response.text();

      console.log('AI Response:', response);
      this.responseText.next(response);
      this.updateConversationHistory(userInput, response);

      this.updateCurrentPart(response);

    } catch (error) {
      console.error('Error generating AI response:', error);
      this.responseText.next('An error occurred while generating the response.');
    }
  }

  private updateCurrentPart(response: string) {
    if (response.toLowerCase().includes('goodbye')) {
      this.testCompleted.next(true); 
    }
  }

  private formatResponse(response: string): string {
    response = response.replace(/[\*#]/g, '');
    // Format the Overall band score as an H1 tag
    response = response.replace(/Overall band score: (\d+\.\d)/, '<h1 class = "h1">Overall Band Score: $1</h1>');
  
    // Format each section with a numbered heading and the corresponding score
    response = response.replace(/1\. Fluency and Coherence: (\d+)/, '<h2 class = "h2">1. Fluency and Coherence: $1</h2>');
    response = response.replace(/2\. Lexical Resource: (\d+)/, '<h2 class = "h2">2. Lexical Resource: $1</h2>');
    response = response.replace(/3\. Grammatical Range and Accuracy: (\d+)/, '<h2 class = "h2">3. Grammatical Range and Accuracy: $1</h2>');
    response = response.replace(/4\. Pronunciation: (\d+)/, '<h2 class = "h2">4. Pronunciation: $1</h2>');
  
    // Format the detailed result pointers as a list
    response = response.replace(/Detailed Result pointers:/g, '<h3 class = "h3">Detailed Result Pointers:</h3>');
    
    // Format the additional sections
    response = response.replace(/Skill level based on IELTS Band Score:/, '<h2 class = "h2">Skill Level Based on IELTS Band Score:</h2>');
    response = response.replace(/Areas for Improvement:/, '<h2 class = "h2">Areas for Improvement:</h2>');
    
    return response;
  }
  

  public async getResults(): Promise<void> {
    const conversationHistory = this.conversationHistory.map((entry, index) => {
      return `${index % 2 === 0 ? 'Candidate' : 'Examiner'}: ${entry}`;
    }).join('\n');

    const finalPrompt = `
      Here is the complete conversation so far:\n${conversationHistory}\n
      Please evaluate the candidate's performance based on the IELTS Speaking criteria and provide detailed feedback along with an overall band score.

      Give the response in the following format:

      Overall band score: (score)
      1. Fluency and Coherence: (Score)
      . Detailed Result pointers
      2. Lexical Resource: (Score)
      . Detailed Result pointers
      3. Grammatical Range and Accuracy: (Score)
      . Detailed Result pointers
      4. Pronunciation: (Score)
      . Detailed Result pointers

      Skill level based on IELTS Band Score :  
    `;

    console.log('Final Prompt for Evaluation:', finalPrompt);

    try {
      const model = this.generativeAI.getGenerativeModel({ model: 'gemini-1.5-flash-latest' });
      const result = await model.generateContent(finalPrompt);
      const response = await result.response.text();

      console.log('AI Response:', response);
      const formattedResponse = this.formatResponse(response);
      this.responseText.next(formattedResponse);

    } catch (error) {
      console.error('Error generating final evaluation:', error);
      this.responseText.next('An error occurred while generating the final evaluation.');
    }
  }

  public getResponseText(): Observable<string> {
    return this.responseText.asObservable();
  }

  public getConversationHistory(): string[] {
    return this.conversationHistory;
  }

  public getTestCompletedStatus(): Observable<boolean> {
    return this.testCompleted.asObservable();
  }
}
