import { Component, OnInit } from '@angular/core';
import { QuizService } from '../quiz.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-quiz',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './quiz.component.html',
  styleUrl: './quiz.component.css'
})
export class QuizComponent implements OnInit {
  questions: any[] = [];
  currentQuestionIndex = 0;
  selectedOption: string = '';
  score = 0;
  showResult = false;

  constructor(private quizService: QuizService) {}

  ngOnInit() {
    this.questions = this.quizService.getQuestions();
  }

  selectOption(option: string) {
    this.selectedOption = option;
  }

  next() {
    const correctAnswer = this.questions[this.currentQuestionIndex].answer;
    if (this.selectedOption === correctAnswer) {
      this.score++;
    }
    this.selectedOption = '';
    this.currentQuestionIndex++;
    if (this.currentQuestionIndex >= this.questions.length) {
      this.showResult = true;
    }
  }

  restart() {
    this.currentQuestionIndex = 0;
    this.score = 0;
    this.showResult = false;
  }
}
