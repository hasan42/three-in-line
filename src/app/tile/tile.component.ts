import { Component, OnInit, Input } from '@angular/core';
import {
  trigger,
  state,
  style,
  animate,
  transition,
  keyframes
} from '@angular/animations';
import { GameService } from '../game.service';


@Component({
  selector: 'app-tile',
  templateUrl: './tile.component.html',
  styleUrls: ['./tile.component.scss'],
  animations: [
    trigger('selected', [
      state('true', style({ transform: 'scale(0.8)' })),
    ]),
    trigger('anim', [
      // state('*', style({ opacity: 1 })),
      // state('false', style({ transform: 'scale(1)' })),
      // void => *
      transition(':enter', animate(500, style({ opacity: 1 }))),
      // * => void
      transition(':leave', animate(500, style({ opacity: 0 }))),
    ]),
  ],
})
export class TileComponent implements OnInit {

  @Input() x: number;
  @Input() y: number;
  @Input() color: string = 'black';
  @Input() selected: boolean;

  constructor(private service: GameService) { }

  ngOnInit(): void {
  }

  onClick(){
    this.service.onClickTile(this.x, this.y, this.color);
  }

  animationStarted(event: AnimationEvent) {
    console.log('animationStarted', event)
  }

  animationDone(event: AnimationEvent) {
    console.log('animationDone', event)
  }

}
