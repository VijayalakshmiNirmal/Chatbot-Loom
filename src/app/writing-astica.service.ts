import { Injectable } from '@angular/core';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { HttpClientModule } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class WritingAsticaService {
  private generativeAI: GoogleGenerativeAI;
  private responseText: BehaviorSubject<string> = new BehaviorSubject<string>('');

  constructor(private http: HttpClient) { 
    this.generativeAI = new GoogleGenerativeAI('api-key');
  }

  async getAsticaDescription(imageUrl: string): Promise<string> {
    const asticaApiKey = '9CCD2895-9B90-4489-A22D-40E59CA44D6191AF750B-522B-4BC4-A452-095B5BC3DCD4';
    const asticaApiUrl = `https://vision.astica.ai/describe`;

    const payload = {
      tkn: asticaApiKey,
      modelVersion: '2.1_full', 
      visionParams: 'gpt,description,objects,faces',
      input: imageUrl
    };

    try {
      const response = await this.http.post<any>(asticaApiUrl, payload).toPromise();
      return response.caption?.text || ''; 
    } catch (error) {
      console.error('Error fetching description from Astica:', error);
      return '';
    }
  }

  async evaluateDescription(userDescription: string, extractedContent: string): Promise<string> {
    const model = this.generativeAI.getGenerativeModel({ model: 'gemini-pro' });
  
    try {
      const prompt = `
        **Evaluate the following user description against the AI-generated description:**
  
        **AI-Generated Description**:
        ${extractedContent}
  
        **User Description**:
        ${userDescription}
  
        **Feedback**:
        Provide feedback on grammar and content relevancy, considering the AI-generated description.
  
        **Evaluation Criteria**:
  
      1. Grammar and Punctuation: Identify any grammatical errors or issues with punctuation in the description.
      2. Corrected passage: 
      3. Content Relevancy:
         - Does the description accurately reflect the key information in the visual representation?
         - Are all important features and trends in the visual correctly described?
      4. IELTS Academic Writing Task 1 Criteria:
         - **Task Achievement (TA)**: Does the description provide a clear overview, highlight key features, trends, and make comparisons where relevant?
         - **Coherence and Cohesion (CC)**: Is the information well-organized, with logical paragraphing and flow?
         - **Lexical Resource (LR)**: Does the description use a wide range of vocabulary accurately and appropriately?
         - **Grammatical Range and Accuracy (GRA)**: Are there any issues with sentence structure, tense, or accuracy in grammar and punctuation?
         
      Provide your feedback below:
      `;
  
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const evaluationResult = await response.text();
  
      return evaluationResult;  // Return the result as a string
    } catch (error) {
      console.error('Error evaluating description:', error);
      return 'Error evaluating description.';  // Return an error message as a string
    }
  }
  
  public getResponseText(): Observable<string> {
    return this.responseText.asObservable();
  }
}