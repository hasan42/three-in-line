import { Injectable } from '@angular/core';
import { Observable, of, BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GameService {

  colors: any = ["yellow", "red", "green", "blue", "orange"];
  areaSize: number = 8;

  items: any = [];
  observableItems = new BehaviorSubject<any[]>(this.items);
  items$ = this.observableItems.asObservable();

  selectItem: any = null;
  compareItem: any = null;

  constructor() {
    this.generateArea()
  }

  getRandomColor(){
    return this.colors[Math.floor(Math.random() * this.colors.length)];
  }

  generateArea(){
    for (let i = 0; i <= this.areaSize; i++) {
      for (let j = 0; j <= this.areaSize; j++) {
        let color = this.getRandomColor();
        let item = {x: i, y: j, color:color};
        this.items.push(item);
      }
    }
  }

  onClickTile(x, y, color){
    if(this.selectItem === null){
      this.selectItem = { x, y, color }
    }else{
      this.compareItem = { x, y, color }
      this.replaceItems();
    }
  }

  replaceItems(){
    if( this.checkPlace() ){
      let firstItem = this.items.findIndex(el=>el.x===this.selectItem.x && el.y===this.selectItem.y )
      let secondItem = this.items.findIndex(el=>el.x===this.compareItem.x && el.y===this.compareItem.y )

      this.items[firstItem].color = this.compareItem.color;
      this.items[secondItem].color = this.selectItem.color;
    }
    this.selectItem = null;
    this.compareItem = null;
  }

  checkPlace(): boolean {
    let aX = this.selectItem.x;
    let aY = this.selectItem.y;
    let bX = this.compareItem.x;
    let bY = this.compareItem.y;
    if( (aX === bX && (aY === bY + 1 || aY === bY - 1)) || (aY === bY && (aX === bX + 1 || aX === bX - 1)) ){
      return true
    }else{
      return false
    }
  }
  
}
