'use strict';
const angular = require('angular');

const uiRouter = require('angular-ui-router');

export class AdminlotComponent {
  lot;
  lottypes;
  categories;
  livestock_types;
  statuses;
  classes;
  age_classes;
  pricing_units;
  isNew
  currentUser;
  closedate;
  format;
  formats;
  dateOptions;
  $http;
  $scope;
  $timeout;
  LotService;
  NotifyService;
  Upload;
  showBidForm = false;
  showWatchForm = false;
  showBidMessageForm = false;
  showWatchMessageForm = false;
  bidMessageText;
  watchMessageText;
  full_lot_name;

  constructor($http, $scope, socket, $stateParams, LotService, NotifyService, Upload, $timeout, $filter, Auth, $q) {
    this.$http = $http;
    this.$q = $q;
    this.LotService = LotService;
    this.NotifyService = NotifyService;
    this.Upload = Upload;
    this.$scope = $scope;
    this.$timeout = $timeout;

    this.currentUser = Auth.getCurrentUserSync();

    this.lot = { lot_type:"Individual", category:"Breeding", livestock_type:"Cattle", status:"Waiting",pricing_unit:"$/lot", close_date: new Date(), photos:[], agent: this.currentUser.username, seller_id: this.currentUser._id };
    this.lottypes = ["Individual", "Group"];
    this.categories = ["Breeding", "Slaughter", "Feeding", "Rearing"];
    this.livestock_types = ["Cattle", "Sheep", "Goats", "Pigs", "Wildlife", "Machinery and Vehicles"];
    this.statuses = ["Open", "Waiting"];
    this.pricing_units = ["$/lot", "$/head", "$/kg", "$/kg CDM"];
    this.classes = ["Bull", "Cow", "Cow in calf", "Cow with Calf", "Heifer in calf", "Heifer bulled", "Heifer pre-bulling", "Heifer long weaner", "Heifer weaner", "Calf male", "Calf female"];
    this.age_classes = ["Drop down weaner", "Long weaner", "Feeder", "Slaughter", "Draft"];
    this.isNew = true;


    this.closedate = {
      opened: false
    };
    this.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'yyyy-MM-dd', 'shortDate'];
    this.format = this.formats[2];

    this.dateOptions = {
      maxDate: new Date(2030, 12, 31),
      minDate: new Date(),
      startingDay: 1
    };

    if ((LotService.getCurrLot() != undefined) && ($stateParams.status != 'new')) {
      this.isNew = false;

      this.loadLot(LotService.getCurrLot()).then(result => {
        this.lot = result;
      });
      
    } else {
      // New lot - set the agent
      this.lot.agent = this.currentUser.username;
      this.lot.seller_id = this.currentUser._id;
      this.lot.animals = [];
      this.lot.current_bid = 0.00;
      this.lot.district = this.currentUser.district;
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

  saveLot = function() {

    if (this.isNew) {
      this.$http.post('/api/lots', this.lot).then(response => {
        if (response.status == 201) {
          this.NotifyService.setData("Saved", "Lot saved successfully");
          this.NotifyService.open("success");
          this.lot = response.data;
          this.LotService.setCurrLot(this.lot._id);
          this.isNew = false;
        }
      });
    } else {
      this.$http.put('/api/lots/' + this.LotService.getCurrLot(), this.lot).then(response => {
        if (response.status == 200) {
          this.NotifyService.setData("Saved", "Lot saved successfully");
          this.NotifyService.open("success");
          this.$http.get('/api/lots/id/' + this.LotService.getCurrLot()).then(response => {
            //console.log(response.data);
            this.lot = response.data;
            this.lot.close_date = new Date(this.lot.close_date);
          }).catch(function (data) {
            console.log(data);
          });
        } else {
          this.NotifyService.setData("Error", "Error saving lot");
          this.NotifyService.open("error");
        }
      });
    }
  }

  newAnimal = function() {
    var newAnimal = { };
    this.lot.animals.push(newAnimal);
  }

  removeAnimal = function(tagNumber) {
    for(var i = this.lot.animals.length - 1; i >= 0; i--) {
      if (this.lot.animals[i].tag_number == tagNumber) {
        this.lot.animals.splice(i,1);
      }
    }
  }

  removeAnimalPhoto = function(animal) {
    animal.photo = null;
    this.removeAnimal(animal.tag_number);
    this.lot.animals.push(animal);
  }

  removePhoto(photo) {
    for(var i = this.lot.photos.length - 1; i >= 0; i--) {
      if (this.lot.photos[i].filename == photo.filename) {
        this.lot.photos.splice(i,1);
      }
    }
  }

  addAnimalPhoto(dataUrl, name, animal) {
    var that=this;
    this.Upload.upload({
      url: '/api/photos',
      data: {
        file: this.Upload.dataUrltoBlob(dataUrl, name)
      },
    }).then(function (response) {
      that.$timeout(function () {
        if (response.status == "200") {
          var photo = { filename: null };
          photo.filename = response.data;
          animal.photo = photo.filename;

          this.removeAnimal(animal.tag_number);
          this.lot.animals.push(animal);
        }
      });
    });
  }

  uploadPhoto = function (dataUrl, name) {
    var that=this;
    this.Upload.upload({
      url: '/api/photos',
      data: {
        file: this.Upload.dataUrltoBlob(dataUrl, name)
      },
    }).then(function (response) {
      that.$timeout(function () {
        that.$scope.result = response.data;
        if (response.status == "200") {
          var photo = { filename: null };
          photo.filename = response.data;
          that.lot.photos.push(photo);
          //console.log(that.lot.photos);
        }
      });
    }, function (response) {
      if (response.status > 0) this.$scope.errorMsg = response.status
        + ': ' + response.data;
    }, function (evt) {
      that.$scope.progress = parseInt((100.0 * evt.loaded / evt.total).toString());
    });
  }

  uploadMultiple = function(files, errFiles) {
    var that=this;
    this.$scope.files = files;
    this.$scope.errFiles = errFiles;
    angular.forEach(files, function(file) {
      that.Upload.upload({
        url: '/api/photos',
        data: {file: file}
      }).then(function (response) {
        that.$timeout(function () {
          file.result = response.data;
          if (response.status == "200") {
            var photo = { filename: null };
            photo.filename = response.data;
            that.lot.photos.push(photo);
            console.log(that.lot.photos);
          }
        });
      }, function (response) {
        if (response.status > 0)
          that.$scope.errorMsg = response.status + ': ' + response.data;
      }, function (evt) {
        //file.progress = Math.min(100, parseInt(100.0 * evt.loaded / evt.total)).toString();
      });
    });
  }

  messageBidders() {
    var that = this;

    var myMessage = {
      from_user_id: this.currentUser._id,
      username: this.currentUser.username,
      subject: this.lot.lot_name,
      message: this.bidMessageText,
      send_date: new Date(),
      status: 'New'
    };

    // Build bidder list
    var bidderIDs = [];
    this.lot.bids.forEach(function(bid) {
      if (bidderIDs.indexOf(bid.user_id) == -1) {
        bidderIDs.push(bid.user_id);
      }

    });

    bidderIDs.forEach(function(user_id) {
      that.$http.post('/api/users/'+user_id+'/message', myMessage);
    });

    this.NotifyService.setData("Sent", "Message sent");
    this.NotifyService.open("success");

  }

  messageWatchers() {
    var that = this;

    var myMessage = {
      from_user_id: this.currentUser._id,
      username: this.currentUser.username,
      subject: this.lot.lot_name,
      message: this.watchMessageText,
      send_date: new Date(),
      status: 'New'
    };

    // Build bidder list
    var bidderIDs = [];
    this.lot.watching.forEach(function(watch) {
      if (bidderIDs.indexOf(watch.user_id) == -1) {
        bidderIDs.push(watch.user_id);
      }

    });

    bidderIDs.forEach(function(user_id) {
      that.$http.post('/api/users/'+user_id+'/message', myMessage);
    });

    this.NotifyService.setData("Sent", "Message sent");
    this.NotifyService.open("success");

  }

  clickBid() {
    this.showBidForm = !this.showBidForm;
    this.showWatchForm = false;
  }

  clickWatch() {
    this.showBidForm = false;
    this.showWatchForm = !this.showWatchForm;
  }

  setLotType(lotType) {
    this.lot.lot_type = lotType;
  }

  setCategory(category) {
    this.lot.category = category;
  }

  setLivestockType(livestockType) {
    this.lot.livestock_type = livestockType;
  }

  setStatus(status) {
    this.lot.status = status;
  }

  setPricingUnit(pricing) {
    this.lot.pricing_unit = pricing;
  }

  setCloseDate() {
    this.closedate.opened = true;
  }

  setClass(animal, animalClass) {
    animal.class = animalClass;
  }

  setAgeClass(animal, ageClass) {
    animal.age_class = ageClass;
  }
}

export default angular.module('rlmsApp.adminlot', [uiRouter])
  .controller('AdminlotComponent', AdminlotComponent)
  .name;
