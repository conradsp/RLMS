'use strict';
const angular = require('angular');
const uiRouter = require('angular-ui-router');

import routes from './category.routes';

export class CategoryComponent {
  LotService;
  $location;
  $http;
  NotifyService;
  lots = [];
  displayedLots = [];
  searchCriteria = null;
  lotCount = 0;
  tableState = null;
  isLoading = false;
  currType = "All";
  lotTypes;

  constructor($http, LotService, socket, $location, NotifyService) {
    this.LotService = LotService;
    this.$location = $location;
    this.$http = $http;
    this.NotifyService = NotifyService;

    this.lotTypes = ["All", "Cattle", "Sheep", "Goats", "Pigs", "Wildlife", "Machinery and Vehicles"];

    this.lotSearch(false);

  }

  clearSearch()
  {
    this.searchCriteria = null;
    this.lotSearch(false);
  }

  // isSearch=true means we are searching from the search bar.  False means we are doing a search by livestockType
  lotSearch(isSearch) {
    var searchParams = '?';
    if (this.currType != "All")
      searchParams+='livestockType='+this.currType+'&';
    if (isSearch) {
      searchParams+='&search='+this.searchCriteria;
    }

    this.$http.get('/api/lots'+ searchParams).then(response => {
      this.lotCount = response.data.length;
      this.lots = response.data;

      if (this.tableState) {
        var number = this.tableState.pagination.number;
        if (this.lotCount < number)
          number = this.lotCount;

        this.isLoading = false;
        this.displayedLots = [];
        for (var i = 0; i < number; i++)
          this.displayedLots.push(this.lots[this.tableState.pagination.start + i]);

        this.tableState.pagination.numberOfPages = Math.ceil(this.lotCount / this.tableState.pagination.number);//set the number of pages so the pagination ca
      }
    });
  }

  showLot(lotID) {
    this.LotService.setCurrLot(lotID);
    this.$location.path('/lot');

  }

  setLotType(lotType) {
    this.currType = lotType;
    // Go get the lots that match this type
    this.lotSearch(false);
  }
}

export default angular.module('rlmsApp.category', [uiRouter])
  .config(routes)
  .component('category', {
    template: require('./category.pug'),
    controller: CategoryComponent,
    controllerAs: 'lotlist'
  })
  .name;
