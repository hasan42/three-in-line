import { Injectable } from '@angular/core';
import { Observable, of, BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GameService {

  colors: any = ["yellow", "red", "green", "aqua", "blue", "orange"];
  freeColor: string = "white";
  areaSize: number = 8;

  items: any = [];
  observableItems = new BehaviorSubject<any[]>(this.items);
  items$ = this.observableItems.asObservable();

  score: number = null;
  observableScore = new BehaviorSubject<number>(this.score);
  score$ = this.observableScore.asObservable();
  scoreComare: number = null;

  selectItem: any = null;
  compareItem: any = null;
  comapreArrX: any = [];
  comapreArrY: any = [];

  constructor() {
    let intViewportWidth = window.innerWidth;
      console.log(intViewportWidth, this.areaSize, this.colors);
    if(intViewportWidth <= 600) {
      this.areaSize = 5
      this.colors.splice(-2,2)
      console.log(intViewportWidth, this.areaSize, this.colors);
    }
    this.newGame();
  }

  newGame(){
    this.score = null;
    this.items = [];
    this.selectItem = null;
    this.compareItem = null;
    this.generateArea();
    this.checkAreaColor();
  }

  getRandomColor(){
    return this.colors[Math.floor(Math.random() * this.colors.length)];
  }

  generateArea(){
    for (let i = 0; i <= this.areaSize; i++) {
      for (let j = 0; j <= this.areaSize; j++) {
        let color = this.getRandomColor(),
            item = { x: i, y: j, color:color, selected: false };
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
      let firstItem = this.getIndexItemByCoords(x, y);
      this.items[firstItem].selected = true;
    }else{
      this.compareItem = { x, y, color }
      let secondItem = this.getIndexItemByCoords(x, y);
      this.items[secondItem].selected = true;
      if( this.canReplace() ){
        this.changePlaceChecked('replace');
        this.scoreComare = this.score;
        this.checkAreaColor();
        if(this.scoreComare === this.score){
          this.changePlaceChecked('comeback');
        }
      }
      this.resetChecked();
    }
  }

  resetChecked(){
    if(this.selectItem !== null){
      let firstItem = this.getIndexItemByCoords(this.selectItem.x, this.selectItem.y ),
          secondItem = this.getIndexItemByCoords(this.compareItem.x, this.compareItem.y );

      this.items[firstItem].selected = false;
      this.items[secondItem].selected = false;
    }
    this.selectItem = null;
    this.compareItem = null;
  }

  changePlaceChecked(place){
    if(this.selectItem !== null){
      let firstItem = this.getIndexItemByCoords(this.selectItem.x, this.selectItem.y ),
          secondItem = this.getIndexItemByCoords(this.compareItem.x, this.compareItem.y );

      if(place === 'replace'){
        this.items[firstItem].color = this.compareItem.color;
        this.items[secondItem].color = this.selectItem.color;
      }
      if(place === 'comeback'){
        this.items[firstItem].color = this.selectItem.color;
        this.items[secondItem].color = this.compareItem.color;
      }
    }
    
  }

  canReplace(): boolean {
    let aX = this.selectItem.x,
        aY = this.selectItem.y,
        bX = this.compareItem.x,
        bY = this.compareItem.y;
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
        this.checkOnAxis('x',el.x,el.y,el.color);
        this.checkOnAxis('y',el.x,el.y,el.color);
        this.hideColor();
      }
    });
    setTimeout( ()=>{this.checkFreeTile();} ,500);
    
  }
  checkOnAxis(axis,x,y,color){
    let arr;

    if(axis === 'y') {
      arr = [
        { x:x, y:y+1, active:null },
        { x:x, y:y-1, active:null }
      ];
    }
    if(axis === 'x') {
      arr = [
        { x:x+1, y:y, active:null },
        { x:x-1, y:y, active:null }
      ];
    }

    arr.forEach(el=>{
      if(el.x>=0 && el.x<=this.areaSize && el.y>=0 && el.y<=this.areaSize ){
        let compare = this.getIndexItemByCoords(el.x,el.y);
        if(this.items[compare].color !== this.freeColor){
          if(color === this.items[compare].color){
            el.active = true;
            let find;
            if(axis === 'y'){ find = this.comapreArrY.find(elf=>elf.x===el.x && elf.y===el.y ) }
            if(axis === 'x'){ find = this.comapreArrX.find(elf=>elf.x===el.x && elf.y===el.y ) }

            if(!find){
              if(axis === 'y'){ this.comapreArrY.push({x:el.x,y:el.y}) }
              if(axis === 'x'){ this.comapreArrX.push({x:el.x,y:el.y}) }
              this.checkOnAxis(axis,el.x,el.y,color);
            }
          }else{
            el.active = false;
          }
        }
        
      }
    });
  }

  hideColor(){
    let compareArr = [];
    if(this.comapreArrX.length >= 3){
      compareArr = compareArr.concat(this.comapreArrX);
    }
    if(this.comapreArrY.length >= 3){
      compareArr = compareArr.concat(this.comapreArrY);
    }
    
    this.comapreArrY = [];
    this.comapreArrX = [];
    if(compareArr.length >= 3){
      this.increaseScore(compareArr.length);
      compareArr.forEach(el=>{
        let hidden = this.getIndexItemByCoords(el.x,el.y);
        this.items[hidden].color = this.freeColor;
      });
      return true;
    }else{
      return false;
    }
  }

  checkFreeTile(){
    let nullTile = this.items.filter(el=>el.color===this.freeColor)
    if(nullTile.length > 0){
      this.moveTileOnFreeSpace();
    }
  }

  moveTileOnFreeSpace(){
    let tempLine = [],
        tempArr: Array<any> = [];
    for (let i = 0; i <= this.areaSize; i++) {
      tempLine = [];

      for (let j = 0; j <= this.areaSize; j++) {
        let tileColor = this.getIndexItemByCoords(j,i);
        if(this.items[tileColor].color !== this.freeColor){
          let item = { x: j, y: i, color:this.items[tileColor].color, selected: false };
          tempLine.push(item);
        }
      }

      if(tempLine.length !== this.areaSize+1 ){
        let needAddTile = this.areaSize - tempLine.length;
        for (let m = 0; m <= needAddTile; m++) {
          let color = this.getRandomColor(),
              item = {x: m, y: i, color:color};
          tempLine.unshift(item);
        }
        tempLine.forEach((el,idx)=>{
          el.x = idx;
        });
      }
      tempArr = tempArr.concat(tempLine);
    }
    // tempArr = tempArr.flat();
    tempArr.sort((a, b)=>{
      let keyA = a.x,
          keyB = b.x;
      if(keyA < keyB) return -1;
      if(keyA > keyB) return 1;
      return 0;
    });
    // this.items = tempArr;

    this.items.forEach((el)=>{
      const color = tempArr.find(elf=>elf.x===el.x && elf.y===el.y ).color;
      if(el.color !== color) 
        el.color = color;
    })

    this.observableItems.next(this.items);
    setTimeout( ()=>{this.checkAreaColor()} ,500);
    // ;
  }

  increaseScore(num){
    this.score += num;
    this.observableScore.next(this.score);
  }
}
