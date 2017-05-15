'use strict';
const angular = require('angular');

const uiRouter = require('angular-ui-router');

export class AdminotherComponent {
  content;
  $http;
  $timeout;
  currContent;
  showContents = false;
  NotifyService;
  Upload;

  constructor($http, NotifyService, $timeout, Upload) {
    this.$http = $http;
    this.NotifyService = NotifyService;
    this.$timeout = $timeout;
    this.Upload = Upload;

    $http.get('/api/contents').then(response => {
      this.content = response.data;
    });
  }

  setActive(currContent, isactive) {
    currContent.active = isactive;
    this.$http.put('/api/contents/'+currContent._id, currContent).then(response => {
      if (response.status == 200) {

      }
    });
  }

  showContent(row) {
    this.currContent = row;
    this.showContents = true;
  }

  addContent() {
    this.currContent = {};
    this.showContents = true;
  }

  removeImage() {
    this.currContent.image = null;
  }

  saveCurrContent() {
    if (this.currContent._id) {
      this.$http.put('/api/contents/' + this.currContent._id, this.currContent).then(response => {
        if (response.status == 200) {
          this.NotifyService.setData("Saved", "Content saved");
          this.NotifyService.open("success");
        }
      });
      this.showContents = false;
    } else {
      // This is a new one
      this.currContent.active = false;
      this.$http.post('/api/contents/', this.currContent).then(response => {
        if (response.status == 201) {
          this.NotifyService.setData("Saved", "Content saved");
          this.NotifyService.open("success");
        }
      });
    }
  }

  removeContent(content) {
    this.$http.delete('/api/contents/'+content._id).then(response => {
      if (response.status == 200) {
        this.NotifyService.setData("Saved", "Content removed");
        this.NotifyService.open("success");

      }
    });

    this.$http.get('/api/contents').then(response => {
      this.content = response.data;
    });
  }

  uploadPhoto(dataUrl, name) {
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
          that.currContent.image = photo.filename;
          //console.log(that.lot.photos);
        }
      });
    });
  }
}

export default angular.module('rlmsApp.adminother', [uiRouter])
  .controller('AdminotherComponent', AdminotherComponent)
  .name;
