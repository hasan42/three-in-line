import { Component, OnInit } from '@angular/core';
import { GameService } from '../game.service';
import { Subscription, BehaviorSubject } from 'rxjs';
import { take, finalize } from 'rxjs/operators';

@Component({
  selector: 'app-stat',
  templateUrl: './stat.component.html',
  styleUrls: ['./stat.component.scss']
})
export class StatComponent implements OnInit {

  score: number;
  private subscription: Subscription;

  constructor(private service: GameService) { }

  ngOnInit(): void {
    this.subscription = this.service.observableScore.subscribe(
        value => {
          this.score = value;
        },
        error => console.log(error)
      );
  }

  onClickNewGame(){
    this.service.newGame();
  }

}
