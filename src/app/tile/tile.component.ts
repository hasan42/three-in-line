import { Component, OnInit, Input } from '@angular/core';
import { GameService } from '../game.service';

@Component({
  selector: 'app-tile',
  templateUrl: './tile.component.html',
  styleUrls: ['./tile.component.scss']
})
export class TileComponent implements OnInit {

  @Input() x: number;
  @Input() y: number;
  @Input() color: string;

  constructor(private service: GameService) { }

  ngOnInit(): void {
  }

  onClick(){
    this.service.onClickTile(this.x, this.y, this.color);
  }

}
