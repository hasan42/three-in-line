import { Component, OnInit, HostListener } from '@angular/core';
import { GameService } from '../game.service';
import { Subscription, BehaviorSubject } from 'rxjs';
import { take, finalize } from 'rxjs/operators';

@Component({
  selector: 'app-area',
  templateUrl: './area.component.html',
  styleUrls: ['./area.component.scss']
})
export class AreaComponent implements OnInit {

  items: any;
  private subscription: Subscription;

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    const currentWidthMobile = event.target.innerWidth <= 600 ? true : false;
    if(this.service.nowMobile !== currentWidthMobile){
      this.service.newGame();
    }
  }

  constructor(private service: GameService) { }

  ngOnInit(): void {
    this.subscription = this.service.observableItems.subscribe(
        value => {
          this.items = value;
        },
        error => console.log(error)
      );
  }

}
