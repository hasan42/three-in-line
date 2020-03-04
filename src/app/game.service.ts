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
  comapreArr: any = [];

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

  getIndexItemByCoords(fX,fY):number{
    return this.items.findIndex(el=>el.x===fX && el.y===fY )
  }
  getItemByCoords(fX,fY):number{
    return this.items.find(el=>el.x===fX && el.y===fY )
  }

  onClickTile(x, y, color){
    if(this.selectItem === null){
      this.selectItem = { x, y, color }
    }else{
      this.compareItem = { x, y, color }
      this.replaceItems();
      this.checkAreaColor();
    }
  }

  replaceItems(){
    if( this.canReplace() ){
      let firstItem = this.getIndexItemByCoords(this.selectItem.x, this.selectItem.y )
      let secondItem = this.getIndexItemByCoords(this.compareItem.x, this.compareItem.y )

      this.items[firstItem].color = this.compareItem.color;
      this.items[secondItem].color = this.selectItem.color;
    }
    this.selectItem = null;
    this.compareItem = null;
  }

  canReplace(): boolean {
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

  checkAreaColor(){
    let arr = []
    this.items.forEach(el=>{
      if(el.color){
        this.checkOnY(el.x,el.y,el.color);
          console.log(this.comapreArr);
        if(this.comapreArr.length >= 3){
          this.hideColor();
          this.comapreArr = [];
        }else{
          this.comapreArr = [];
        }
      }
    });
  }
  checkOnY(x,y,color){
    // console.log(x,y,color);
    let arr = [
      { x:x, y:y+1, active:null },
      // { x:x, y:y, active:null },
      { x:x, y:y-1, active:null }
    ];
    arr.forEach(el=>{
      if(el.x>=0 && el.x<=this.areaSize && el.y>=0 && el.y<=this.areaSize ){
        let compare = this.getIndexItemByCoords(el.x,el.y);
        if(color === this.items[compare].color){
          el.active = true;
          let find = this.comapreArr.find(elf=>elf.x===el.x && elf.y===el.y );
          if(!find){
            this.comapreArr.push({x:el.x,y:el.y});
            this.checkOnY(el.x,el.y,color);
          }
        }else{
          el.active = false;
        }
      }
      
    });
  }
  checkOnX(x,y){
    let arr = [
      { x:x+1, y:y, active:null },
      { x:x, y:y, active:null },
      { x:x-1, y:y, active:null }
    ];
  }

  hideColor(){
    this.comapreArr.forEach(el=>{
      let hidden = this.getIndexItemByCoords(el.x,el.y);
      this.items[hidden].color = null;
    });
  }
}
