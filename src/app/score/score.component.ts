import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { GeminiService } from '../gemini.service';

@Component({
  selector: 'app-score',
  templateUrl: './score.component.html',
  styleUrls: ['./score.component.css']
})
export class ScoreComponent implements OnInit {
  finalEvaluation: string = '';

  constructor(private router: Router, private geminiService: GeminiService) {}

  ngOnInit() {
    // this.getFinalEvaluation();
  }

  // getFinalEvaluation() {
  //   this.geminiService.getFinalEvaluation()
  //     .then(() => {
  //       this.geminiService.getResponseText().subscribe(response => {
  //         this.finalEvaluation = response;
  //       });
  //     })
  //     .catch(error => console.error('Error getting final evaluation:', error));
  // }

  restartExam() {
    this.router.navigate(['/part1']);
  }
}
