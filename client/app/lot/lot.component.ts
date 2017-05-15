'use strict';
const angular = require('angular');

const uiRouter = require('angular-ui-router');

import routes from './lot.routes';

export class LotComponent {
  lot;
  readonly;
  isLoggedIn = false;
  showBidForm = false;
  showMessageForm = false;
  bidTerms = false;
  $http;
  $q;
  currentUser;
  NotifyService;
  LotService;
  messageText;
  full_lot_name;

  constructor($http, $stateParams, LotService, NotifyService, Upload, Auth, $q) {
    this.readonly = true;
    this.$http = $http;
    this.$q = $q;
    this.NotifyService = NotifyService;
    this.LotService = LotService;

    if ((LotService.getCurrLot() != undefined)) {
      this.loadLot(LotService.getCurrLot()).then(result => {
        this.lot = result;
      });
    }

    if (Auth.isLoggedInSync()) {
      this.isLoggedIn = true;
      this.currentUser = Auth.getCurrentUserSync();
    }
  }

  loadLot(lotID) {
    var deferredLots = this.$q.defer();
    var currLot = {};
    this.$http.get('/api/lots/id/'+lotID).then(response => {
        //console.log(response.data);
        currLot = response.data;
        currLot.new_bid = currLot.current_bid;
        //currLot.close_date = new Date(this.lot.close_date);
        currLot.full_lot_name = this.LotService.createLotFullName(currLot);
        
        deferredLots.resolve(currLot);
      }).catch(function(data) {
        deferredLots.reject(data);
        console.log(data);
      });

      return deferredLots.promise;
  }

  makeBid() {
    this.showBidForm = true;
    this.bidTerms = false;
  }

  createBid(bid_amount) {
    if (bid_amount < this.lot.current_bid) {
      this.NotifyService.setData("Bid Amount", "Bid amount must be greater than current bid");
      this.NotifyService.open("warning");
    } else {
      var bidDate = new Date();
      var newBid = {
        id: this.LotService.getCurrLot(),
        user_id: this.currentUser._id,
        bid_amount: bid_amount,
        user_name: this.currentUser.username,
        bid_date: bidDate
      };
      var userBid = {
        id: this.currentUser._id,
        lot_id: this.LotService.getCurrLot(),
        bid_amount: bid_amount,
        lot_name: this.lot.lot_name,
        bid_date: bidDate,
        close_date: this.lot.close_date
      };
      this.$http.post('/api/lots/' + this.LotService.getCurrLot() + '/bid', newBid).then(response => {
        if (response.status == 200) {
          // Add the bid to the user record as well
          this.$http.post('/api/users/' + this.currentUser._id + '/bid', userBid).then(response => {
            if (response.status == 200) {
              this.NotifyService.setData("Saved", "Bid submitted");
              this.NotifyService.open("success");
            } else {
              this.NotifyService.setData("Error", "There was a problem submitting your bid - please try again");
              this.NotifyService.open("error");
            }
          }).catch(function(data) {
            console.log(data);
          });
        }
      }).catch(function(data) {
        console.log(data);
      });

      this.lot = loadLot(this.LotService.getCurrLot());

      this.showBidForm = false;
    }
  }

  messageSeller() {
    // The seller_id in the lot is the user to send the message to
    var myMessage = {
      from_user_id: this.currentUser._id,
      username: this.currentUser.username,
      subject: this.lot.lot_name,
      message: this.messageText,
      send_date: new Date(),
      status: 'New'
    };
    this.$http.post('/api/users/'+this.lot.seller_id+'/message', myMessage).then(response => {
      if (response.status == 200) {
        this.NotifyService.setData("Sent", "Message sent");
        this.NotifyService.open("success");
      } else {
        this.NotifyService.setData("Error", "There was a problem submitting your bid - please try again");
        this.NotifyService.open("error");
      }
    });
  }

  watchLot() {
    var userWatch = {
      lot_id: this.lot._id,
      lot_name: this.lot.lot_name,
      close_date: this.lot.close_date
    };
    this.$http.post('/api/users/'+this.currentUser._id+'/watch', userWatch).then(response => {
      if (response.status == 200) {
        var lotWatch = {
          user_id: this.currentUser._id,
          user_name: this.currentUser.username
        };
        this.$http.post('/api/lots/' + this.lot._id + '/watch', lotWatch).then(response => {
          if (response.status == 200) {

            this.NotifyService.setData("Added", "Added to watch list");
            this.NotifyService.open("success");
          }
        });
      }
    });
  }
}

export default angular.module('rlmsApp.lot', [uiRouter])
  .config(routes)
  .component('lot', {
    template: require('./lot.pug'),
    controller: LotComponent,
    controllerAs: 'lotctrl'
  })
  .name;
