import { Album } from '../../models/album.model';
import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-gesture-slider',
  templateUrl: './gesture-slider.component.html',
  styleUrls: ['./gesture-slider.component.scss']
})
export class GestureSliderComponent implements OnInit {
  private currentPage = 1;
  private maxPages = 0;
  private itemsPerPage = 3;
  public showArray: Album[] = [];
  private fullData: any[];

  @Input() set data(value: any[]) {
    this.fullData = value;
    const intPages = Math.trunc(this.data.length / this.itemsPerPage);
    this.maxPages = (this.data.length % this.itemsPerPage) === 0 ? intPages : intPages + 1;
    this.showArray = this.data.slice(this.currentPage - 1, this.currentPage + this.itemsPerPage - 1);
 }

 get data(): any[] {
  return this.fullData;
}

  constructor() { }

  ngOnInit(): void {}

  onSwipeRight() {
    if (this.currentPage > 1) {
      this.currentPage = --this.currentPage;
      const start =  (this.currentPage - 1) * this.itemsPerPage;
      const end = this.currentPage * this.itemsPerPage;
      this.showArray = this.data.slice(start, end);
    }
  }

  onSwipeLeft() {
    if (this.currentPage < this.maxPages) {
      this.currentPage = ++this.currentPage;
      const start =  (this.currentPage - 1) * this.itemsPerPage;
      const end = this.currentPage * this.itemsPerPage;
      this.showArray = this.data.slice(start, end);
    }
  }

}
