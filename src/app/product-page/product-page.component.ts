import { Component, OnInit } from '@angular/core';
import { dataSource } from '../data-source.constant';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-product-page',
  templateUrl: './product-page.component.html',
  styleUrls: ['./product-page.component.css']
})
export class ProductPageComponent implements OnInit {

  bookList: any = dataSource.data;
  unfilteredData: any = dataSource.data;
  queriedData: any = [];
  filteredData: any = [];

  startDate: any = "";
  endDate: any = "";
  priceMinValue: any;
  priceMaxValue: any;
  mainFilterArray: BehaviorSubject<any> = new BehaviorSubject([]);
  secondaryFilter: any = [];



  constructor() { }

  ngOnInit(): void {
    this.filteredData = this.unfilteredData;
    this.handleChangesInMainFilter();
  }

  handleChangesInMainFilter() {
    this.mainFilterArray.subscribe((res) => {
      if (this.secondaryFilter.length <= 0) {
        this.filteredData = this.unfilteredData;
      } else {
        this.applyFilterConditions();
      }
    })
  }

  applyFilterConditions() {
    
    this.queriedData = [];
    this.secondaryFilter.forEach((conditionItem: any) => {
      if (conditionItem.filterType == "date") {
        let tempJsonData = this.getSourceJsonData();
        console.log("Date Filter source data: ", tempJsonData.length)
        this.queriedData = [];
        let startDateFormatted = new Date(conditionItem.startDate);
        let endDateFormatted = new Date(conditionItem.endDate);
        tempJsonData.forEach((jsonItem: any) => {
          let existingDate = new Date(jsonItem.published_date);
          if ((existingDate >= startDateFormatted) && (existingDate <= endDateFormatted)) {
            this.queriedData.push(jsonItem);
          }
        });
      }
      else if (conditionItem.filterType == "inStock") {
        let tempJsonData = this.getSourceJsonData();
        console.log("Instock Filter source data: ", tempJsonData.length)
        this.queriedData = [];
        tempJsonData.forEach((item: any) => {
          if (item.availability === "available") {
            this.queriedData.push(item);
          }
        });
      }
      else if (conditionItem.filterType == "outOfStock") {
        let tempJsonData = this.getSourceJsonData();
        console.log("outOfStock Filter source data: ", tempJsonData.length)
        this.queriedData = [];
        tempJsonData.forEach((item: any) => {
          if (item.availability === "not-available") {
            this.queriedData.push(item);
          }
        });
      }
    });

    this.filteredData = [];
    this.filteredData = this.queriedData;
  }


  getSourceJsonData() {
    if (this.queriedData.length <= 0) {
      console.log('return unfilteredData ');
      return this.unfilteredData;
    } else {
      console.log('return queriedData ');
      return this.queriedData;
    }
  }


  showInStockItems(event: any) {
    // this.mainFilterArray.push();
    if (event.target.checked === true) {

      this.secondaryFilter.push({
        "filterType": "inStock",
      });

    } else {

      this.secondaryFilter.forEach((filterItem: any, index: any) => {
        if (filterItem.filterType == "inStock") {
          this.secondaryFilter.splice(index, 1);
        }
      });

    }

    this.mainFilterArray.next(this.secondaryFilter);
  }


  showOutOfStockItems(event: any) {
    if (event.target.checked === true) {

      this.secondaryFilter.push({
        "filterType": "outOfStock",
      });

    } else {

      this.secondaryFilter.forEach((filterItem: any, index: any) => {
        if (filterItem.filterType == "outOfStock") {
          this.secondaryFilter.splice(index, 1);
        }
      });

    }

    this.mainFilterArray.next(this.secondaryFilter);
  }


  applyDateFilter() {
    if (this.startDate !== "" && this.endDate !== "") {

      this.secondaryFilter.forEach((filterItem: any, index: any) => {
        if (filterItem.filterType == "date") {
          this.secondaryFilter.splice(index, 1);
        }
      });

      this.secondaryFilter.push({
        "filterType": "date",
        "startDate": this.startDate,
        "endDate": this.endDate,
      })


      this.mainFilterArray.next(this.secondaryFilter);
    }
  }

  removeFilterCondition(filterType: any, index: any){
    this.secondaryFilter.splice(index, 1);
    this.mainFilterArray.next(this.secondaryFilter);

    if(filterType == "date"){
      this.startDate = "";
      this.endDate = "";
    }
    else if(filterType == "inStock"){
      // document.getElementById("inStock").check
    }
  }



}
