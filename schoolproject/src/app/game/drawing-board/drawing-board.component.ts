import { CommonModule } from '@angular/common';
import { Component, HostListener, OnInit } from '@angular/core';
import { AfterViewInit, ElementRef, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';

interface Point {
  x: number;
  y: number;
}

interface ScoreEntry {
  name: string;
  score: number;
}





@Component({
  selector: 'app-drawing-board',
  standalone: true,
  imports: [FormsModule,CommonModule],
  templateUrl: './drawing-board.component.html',
  styleUrl: './drawing-board.component.css'
})

export class DrawingBoardComponent implements OnInit {
  canvasWidth = 400;
  canvasHeight = 400;
  cellSize = 20;

  snake: Point[] = [];
  direction: string = 'RIGHT';
  food: Point = { x: 0, y: 0 };
  score: number = 0;
  gameOver: boolean = false;
  intervalId: any;

  leaderboard: ScoreEntry[] = [];
  playerName: string = '';

  ngOnInit() {
    this.loadLeaderboard();
    this.startGame();
  }

  startGame() {
    this.snake = [
      { x: 3, y: 10 },
      { x: 2, y: 10 },
      { x: 1, y: 10 },
    ];
    this.direction = 'RIGHT';
    this.score = 0;
    this.gameOver = false;
    this.placeFood();

    if (this.intervalId) clearInterval(this.intervalId);
    this.intervalId = setInterval(() => this.gameLoop(), 150);
  }

  @HostListener('window:keydown', ['$event'])
  handleKeyDown(event: KeyboardEvent) {
    const key = event.key;
    if (key === 'ArrowUp' && this.direction !== 'DOWN') this.direction = 'UP';
    else if (key === 'ArrowDown' && this.direction !== 'UP') this.direction = 'DOWN';
    else if (key === 'ArrowLeft' && this.direction !== 'RIGHT') this.direction = 'LEFT';
    else if (key === 'ArrowRight' && this.direction !== 'LEFT') this.direction = 'RIGHT';
  }

  gameLoop() {
    if (this.gameOver) return;

    const head = { ...this.snake[0] };

    if (this.direction === 'RIGHT') head.x++;
    else if (this.direction === 'LEFT') head.x--;
    else if (this.direction === 'UP') head.y--;
    else if (this.direction === 'DOWN') head.y++;

    // Check wall collision
    if (
      head.x < 0 ||
      head.x >= this.canvasWidth / this.cellSize ||
      head.y < 0 ||
      head.y >= this.canvasHeight / this.cellSize ||
      this.snake.some(segment => segment.x === head.x && segment.y === head.y)
    ) {
      this.gameOver = true;
      clearInterval(this.intervalId);
      alert('Game Over! Your score: ' + this.score);
      if(this.playerName.trim()) this.saveScore(this.playerName, this.score);
      return;
    }

    this.snake.unshift(head);

    // Eat food?
    if (head.x === this.food.x && head.y === this.food.y) {
      this.score++;
      this.placeFood();
    } else {
      this.snake.pop();
    }

    this.draw();
  }

  placeFood() {
    const maxX = this.canvasWidth / this.cellSize;
    const maxY = this.canvasHeight / this.cellSize;

    let newFood: Point;
    do {
      newFood = {
        x: Math.floor(Math.random() * maxX),
        y: Math.floor(Math.random() * maxY),
      };
    } while (this.snake.some(segment => segment.x === newFood.x && segment.y === newFood.y));

    this.food = newFood;
  }

  draw() {
    const canvas = document.getElementById('gameCanvas') as HTMLCanvasElement;
    const ctx = canvas.getContext('2d')!;
    ctx.clearRect(0, 0, this.canvasWidth, this.canvasHeight);

    // Draw snake
    ctx.fillStyle = '#2d3748';
    for (const segment of this.snake) {
      ctx.fillRect(segment.x * this.cellSize, segment.y * this.cellSize, this.cellSize, this.cellSize);
    }

    // Draw food
    ctx.fillStyle = '#e53e3e';
    ctx.fillRect(this.food.x * this.cellSize, this.food.y * this.cellSize, this.cellSize, this.cellSize);

    // Draw score
    ctx.fillStyle = '#2d3748';
    ctx.font = '20px Arial';
    ctx.fillText('Score: ' + this.score, 10, 20);
  }

  saveScore(name: string, score: number) {
    this.leaderboard.push({ name, score });
    this.leaderboard.sort((a, b) => b.score - a.score);
    if (this.leaderboard.length > 5) this.leaderboard = this.leaderboard.slice(0, 5);
    localStorage.setItem('snakeLeaderboard', JSON.stringify(this.leaderboard));
  }

  loadLeaderboard() {
    const data = localStorage.getItem('snakeLeaderboard');
    if (data) {
      this.leaderboard = JSON.parse(data);
    }
  }
}