const angular = require('angular');
const uiRouter = require('angular-ui-router');
import routing from './main.routes';

  class MainController {
    $http;
    $q;
    socket;
    $location;
    lots;
    contents;
    newLot;
    component;
    LotService;
    searchCriteria = "";
    lotLabel = "Recently listed lots";

    constructor($http, $scope, socket, $location, LotService, $q) {
      this.$http = $http;
      this.socket = socket;
      this.$location = $location;
      this.lots = [];
      this.contents = [];
      this.LotService = LotService;
      this.$q = $q;

      $scope.$on('$destroy', function() {
        socket.unsyncUpdates('content');
        socket.unsyncUpdates('lot');
      });

      var params = {
        status : "Open"
      };
      this.loadLots(params).then(result => {
        this.lots = result;
        this.socket.syncUpdates('lot', this.lots);
      });
      this.loadContents().then(result => {
        this.contents = result;
        this.socket.syncUpdates('content', this.contents);
      });
         
    }

    lotSearch()
    {
      var params = {
        search : this.searchCriteria
      };

      this.loadLots(params).then(result => {
        this.lots = result;
      });

      this.lotLabel = "Lots";
    }

    clearSearch()
    {
      this.searchCriteria = null;
      var params = {
        search : this.searchCriteria
      };
      this.loadLots(params).then(result => {
        this.lots = result;
      });
    }

    loadLots(params, callback?: Function)
    {
      var deferredLots = this.$q.defer();
      var currLots = {};
      this.$http.put('/api/lots', params).then(response => {
        if (response.data.length <= 9) {
          currLots = response.data;
        } else {
          for (var i=0; i<9; i++)
            currLots.push(response.data[i]);
        }
        currLots.forEach(function(lot) {
          lot.full_lot_name = lot.lot_name + ' ' + lot.district + ' ' + lot.quantity + ' ' + lot.livestock_type + ' ESTLW ' + lot.avg_weight + ' (' + lot.bottom_weight + '-' + lot.top_weight + ') ';

        });
        deferredLots.resolve(currLots);
      })
      return deferredLots.promise;
    }

    loadContents() 
    {
      var deferredContents = this.$q.defer();
      var currContents;
      this.$http.get('/api/contents/active').then(response => {
        currContents = response.data;
        for(var i=0; i<currContents.length;i++) {
          currContents[i].id = i;
        }
        deferredContents.resolve(currContents);
      });

      return deferredContents.promise;;
    }

    showLot(lotId) {
      this.LotService.setCurrLot(lotId);
      this.$location.path('/lot');
    }

    redirect(link) {
      this.$location.path(link);
    }
  }

export default angular.module('rlmsApp.main', [
  uiRouter])
  .config(routing)
  .component('main', {
    template: require('./main.pug'),
    controller: MainController,
    controllerAs: 'main'
  })
  .name;

