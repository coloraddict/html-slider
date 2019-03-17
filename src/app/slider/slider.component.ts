import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { splitDepsDsl } from '@angular/core/src/view/util';
import { iif } from 'rxjs';

@Component({
  selector: 'app-slider',
  templateUrl: './slider.component.html',
  styleUrls: ['./slider.component.css']
})
export class SliderComponent implements OnInit {

  @ViewChild('slider') slider:ElementRef;
  @ViewChild('slideItems') slideItems:ElementRef;
  @ViewChild('prev') prev:ElementRef;
  @ViewChild('next') next:ElementRef;

  posX1 = 0;
  posX2 = 0;
  posInitial;
  posFinal;
  threshold=100;
  slides;
  slidesLength;
  slideSize;
  firstSlide;
  lastSlide;
  cloneFirst;
  cloneLast;
  index = 0;
  allowShift = true;

  constructor() { }

  ngOnInit() {
    this.slides = this.slideItems.nativeElement;
    this.slidesLength = this.slides.childNodes.length;
    this.slideSize = this.slides.childNodes[0].offsetWidth;
    this.firstSlide = this.slides.childNodes[0];
    this.lastSlide = this.slides.childNodes[this.slidesLength-1];
    this.cloneFirst = this.firstSlide.cloneNode(true);
    this.cloneLast = this.lastSlide.cloneNode(true);
    this.slides.appendChild(this.cloneFirst);
    this.slides.insertBefore(this.cloneLast, this.firstSlide);
    this.slider.nativeElement.classList.add('loaded');
  }

  onDragstart(e){
    e = e || window.event;
    e.preventDefault();
    this.posInitial = this.slides.offsetLeft;
    
    if(e.type == 'touchstart') {
      this.posX1 = e.clientX;
      document.onmouseup = this.onDragend;
      document.onmousemove = this.onDragaction;
    }
  }

  onDragend(e){
    this.posFinal= this.slideItems.nativeElement.offsetLeft;
    if(this.posFinal - this.posInitial < -this.threshold) {
      this.shiftSlide(1, 'drag');
    } else if ( this.posFinal - this.posInitial > this.threshold){
      this.shiftSlide(-1, 'drag');
    } else {
      this.slideItems.nativeElement.style.left = (this.posInitial) + 'px';
    }

    document.onmouseup = null;
    document.onmousemove = null;
  }

  onDragaction(e){
    // console.log('drag action');
    e = e || window.event;

    if (e.type == 'touchmove') {
      this.posX2 = this.posX1 - e.touches[0].clientX;
      this.posX1 = e.touches[0].clientX;
    } else {
      this.posX2 = this.posX1 - e.clientX;
      this.posX1 = e.clientX;
    }
    this.slideItems.nativeElement.style.left = (this.slideItems.nativeElement.offsetLeft - this.posX2) + 'px';
  }

  shiftSlide(dir, action){
    // console.log('action ' + action);
      this.slideItems.nativeElement.classList.add('shifting');

      // console.log('this.allowShift ' + this.allowShift);
      if(this.allowShift) {
        if(!action) { 
          this.posInitial = this.slideItems.nativeElement.offsetLeft;
          // console.log(this.posInitial);
        }

        if(dir == 1){
          this.slideItems.nativeElement.style.left = (this.posInitial - this.slideSize) + 'px';
          this.index++;
        } else if(dir == -1){
          this.slideItems.nativeElement.style.left = (this.posInitial + this.slideSize) + 'px';
          this.index--;
        }
      }
      this.allowShift = false;
  }

  checkIndex(){
    // console.log('checkIndex');
    this.slideItems.nativeElement.classList.remove('shifting');

    if(this.index == -1) {
      this.slideItems.nativeElement.style.left = -(this.slidesLength * this.slideSize) + 'px';
      this.index = this.slidesLength - 1;
    }

    if(this.index == this.slidesLength){
      this.slideItems.nativeElement.style.left = -(1 * this.slideSize) + 'px';
      this.index = 0;
    }
    // console.log('inside checkindex ' + this.allowShift);
    this.allowShift = true;
  }
  
}
