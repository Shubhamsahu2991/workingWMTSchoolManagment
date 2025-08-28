import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class QuizService {
  private questions = [
    {
      question: 'What is the capital of France?',
      options: ['Paris', 'London', 'Rome', 'Berlin'],
      answer: 'Paris'
    },
    {
      question: 'Which language is used for web apps?',
      options: ['Python', 'JavaScript', 'C++', 'Java'],
      answer: 'JavaScript'
    },
    {
      question: 'Angular is developed by?',
      options: ['Google', 'Facebook', 'Microsoft', 'Amazon'],
      answer: 'Google'
    }
  ];

  getQuestions() {
    return this.questions;
  }
}
