'use strict';
const angular = require('angular');
const uiRouter = require('angular-ui-router');

export class AdminlotlistComponent {
  LotService;
  $location;
  $http;
  $state;
  NotifyService;
  lots = [];
  displayedLots = [];
  searchCriteria = null;
  lotCount = 0;
  tableState = null;
  isLoading = false;
  currStatus = "All";
  statusList = ['All', 'Waiting', 'Open', 'Closed', 'Archived'];

  constructor($http, LotService, socket, $location, NotifyService, $state) {
    'ngInject';
    this.LotService = LotService;
    this.$location = $location;
    this.$http = $http;
    this.$state = $state;
    this.NotifyService = NotifyService;
    this.getLots();

  }

  getLots()
  {
    var that = this;
    if (this.currStatus == 'All') {
      this.$http.get('/api/lots').then(response => {
        that.lots = response.data;
        that.lotCount = response.data.length;

        var number = 20;
        if (that.lotCount < number)
          number = that.lotCount;

        that.isLoading = false;
        that.displayedLots = [];
        for (var i = 0; i < number; i++)
          that.displayedLots.push(that.lots[i]);

        if (that.tableState) {
          that.tableState.pagination.numberOfPages = Math.ceil(that.lotCount / that.tableState.pagination.number);
        }
      });
    } else {
      var params = {
        status : this.currStatus
      };
      this.$http.put('/api/lots', params).then(response => {
        that.lots = response.data;
        that.lotCount = response.data.length;

        var number = 20;
        if (that.lotCount < number)
          number = that.lotCount;

        that.isLoading = false;
        that.displayedLots = [];
        for (var i = 0; i < number; i++)
          that.displayedLots.push(that.lots[i]);

        if (that.tableState) {
          that.tableState.pagination.numberOfPages = Math.ceil(that.lotCount / that.tableState.pagination.number);
        }
      });
    }
  }

  clearSearch()
  {
    this.searchCriteria = null;
    this.getLots();
  }

  lotSearch()
  {
    var that=this;
    var params = {
      search : this.searchCriteria
    };

    this.$http.put('/api/lots', params).then(response => {
      that.lotCount = response.data.length;
      that.lots = response.data;

      var number = this.tableState.pagination.number;
      if (that.lotCount < number)
        number = this.lotCount;

      that.isLoading = false;
      that.displayedLots = [];
      for (var i=0; i<number; i++)
        that.displayedLots.push(that.lots[that.tableState.pagination.start+i]);

      that.tableState.pagination.numberOfPages = Math.ceil(that.lotCount/that.tableState.pagination.number);//set the number of pages so the pagination ca
    });
  }

  showLot(lotID) {
    this.LotService.setCurrLot(lotID);
    this.$state.go('adminlot');

  }

  addLot() {
    this.LotService.setCurrLot(undefined);
    this.$state.params.status = 'new';
    this.$state.go('adminlot');

  }

  openLot(lot)
  {
    lot.status = "Open";
    this.changeLotStatus(lot._id, "Open");
  }

  closeLot(lot)
  {
    lot.status = "Closed";
    this.changeLotStatus(lot._id, "Closed");

    // Send messages
    var params = {
      to: 'sconrad1@gmail.com',
      subject: 'Lot closed',
      message: '<h1>RLMS</h1><p>Lot ' + lot.lot_name + ' is now closed</p>'
    };
    this.$http.post('/email', params).then;
  }

  changeLotStatus(lotID, status) {
    var that=this;
    this.LotService.setCurrLot(lotID);
    var payload = { status: null };
    payload.status = status;
    this.$http.post('/api/lots/status/'+lotID, payload).then(response => {
      if (response.status == 200) {
        that.NotifyService.setData("Saved", "Lot saved successfully");
        that.NotifyService.open("success");
      }
    });
  }

  removeLot(lot) {
    var that=this;
    this.LotService.setCurrLot(lot._id);
    this.$http.delete('/api/lots/id/'+this.LotService.getCurrLot()).then(response => {
      if (response.status == 204) {
        that.NotifyService.setData("Deleted", "Lot Removed");
        that.NotifyService.open("success");
        that.displayedLots = that.displayedLots.filter(function(el) {
          return el._id != lot._id;
        });
      }
    });

  }

  setLotStat(status) {
    this.currStatus = status;
    this.getLots();
  }
}

export default angular.module('rlmsApp.adminlotlist', [uiRouter])
  .controller('AdminlotlistComponent', AdminlotlistComponent)
  .name;
