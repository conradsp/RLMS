'use strict';
const angular = require('angular');

export class DashboardComponent {
  users;
  lotsapproval;
  lotsclosing;
  lotsclosed;
  usersapproval;
  LotService;
  $location;
  $http;
  socket;
  NotifyService;
  User;
  mymessages;
  allmessages;
  messageCount = 0;
  totalMessages = 0;
  currentUser;
  tableState = null;
  isLoading = false;
  showMessageForm = false;
  messageText;

  constructor(User, $http, LotService, $location, NotifyService, socket, $scope, Auth) {
    'ngInject';
    // Use the User $resource to fetch all users
    this.LotService = LotService;
    this.$location = $location;
    this.$http = $http;
    this.socket = socket;
    this.NotifyService = NotifyService;
    this.User = User;

    $scope.$on('$destroy', function() {
      socket.unsyncUpdates('lotsapproval');
      socket.unsyncUpdates('lotsclosing');
      socket.unsyncUpdates('usersapproval');
      socket.unsyncUpdates('lotsclosed');
    });

    $http.get('/api/lots/approval').then(response => {
      this.lotsapproval = response.data;
      this.socket.syncUpdates('lotsapproval', this.lotsapproval);
    });

    $http.get('/api/lots/closing').then(response => {
      this.lotsclosing = response.data;
      this.socket.syncUpdates('lotsclosing', this.lotsclosing);
    });

    $http.get('/api/lots/closed').then(response => {
      this.lotsclosed = response.data;
      this.socket.syncUpdates('lotsclosed', this.lotsclosed);
    });

    $http.get('/api/users/approval').then(response => {
      this.usersapproval = response.data;
      this.socket.syncUpdates('usersapproval', this.usersapproval);
    });

    if (Auth.isLoggedIn()) {
      this.currentUser = Auth.getCurrentUserSync();
    }
    $http.get('/api/users/'+this.currentUser._id+'/message').then(response => {
      var that = this;
      this.allmessages = response.data.messages;
      this.allmessages.forEach(function(message) {
        message.reply=false;
        if (message.status == "New")
          that.messageCount++;
      });
      this.totalMessages = this.allmessages.length;
    });

    if (this.tableState) {
      this.tableState.pagination.numberOfPages = Math.ceil(this.totalMessages / this.tableState.pagination.number);
    }
  }

  showMessage(row) {
    row.expanded = !row.expanded;

    if (row.expanded && (row.status == "New")) {
      // Update the status to Read and save in DB
      row.status = "Read";
      this.$http.put('/api/users/'+this.currentUser._id+'/message', row);
      this.messageCount--;
    }
  }

  deleteMessage(row) {
    if (row.status == "New")
      this.messageCount--;
    this.$http.delete('/api/users/'+this.currentUser._id+'/message/'+ row._id).then(response => {
      if (response.status == 200) {
        this.allmessages = this.allmessages.filter(function(el) {
          return el._id != row._id;
        });

      }
    });
  }

  replyMessage(row) {
    row.reply=true;
  }

  sendReply(row) {
    var that = this;
    // The seller_id in the lot is the user to send the message to
    var myMessage = {
      from_user_id: this.currentUser._id,
      username: this.currentUser.username,
      subject: row.subject,
      message: this.messageText,
      send_date: new Date(),
      status: 'New'
    };

    that.$http.post('/api/users/'+row.from_user_id+'/message', myMessage).then(response => {
      this.NotifyService.setData("Sent", "Message sent");
      this.NotifyService.open("success");
      row.reply = false;
    });


  }

  showLot(lotID) {
    this.LotService.setCurrLot(lotID);
    this.$location.path('/adminlot');
  }

  showUser(userId) {
    this.User._id = userId;
    this.$location.path('/adminuser/'+userId);
  }

  removeElement(lot, whichList) {
    if (whichList == "Approve") {
      this.lotsapproval = this.lotsapproval.filter(function(el) {
        return el._id !== lot._id;
      });
    }
    if (whichList == "Closing") {
      this.lotsclosing = this.lotsclosing.filter(function(el) {
        return el._id !== lot._id;
      });
    }
    if (whichList == "Closed") {
      this.lotsclosed = this.lotsclosed.filter(function(el) {
        return el._id !== lot._id;
      });
    }
  }

  openLot(lot, whichList)
  {
    this.changeLotStatus(lot._id, "Open");
    this.removeElement(lot, whichList);
  }

  closeLot(lot, whichList)
  {
    this.changeLotStatus(lot._id, "Closed");
    this.removeElement(lot, whichList);
  }

  changeLotStatus(lotID, status) {
    this.LotService.setCurrLot(lotID);
    var payload = { status: null };
    payload.status = status;
    this.$http.post('/api/lots/status/'+this.LotService.getCurrLot(), payload).then(response => {
      if (response.status == 200) {
        this.NotifyService.setData("Saved", "Lot saved successfully");
        this.NotifyService.open("success");
      }
    });
  }

  removeLot(lot, whichList) {
    this.LotService.setCurrLot(lot._id);
    this.$http.delete('/api/lots/id/'+this.LotService.getCurrLot()).then(response => {
      if (response.status == 200) {
        this.NotifyService.setData("Deleted", "Lot Removed");
        this.NotifyService.open("success");
      }
    });
    this.removeElement(lot, whichList);

  }

  approveUser(user) {
    this.$http.put('/api/users/status/'+user._id, status).then(response => {
      if (response.status == 200) {
        this.NotifyService.setData("Saved", "User updated successfully");
        this.NotifyService.open("success");
      }
    });
    this.usersapproval = this.usersapproval.filter(function(el) {
      return el._id !== user._id;
    });
  }

  removeUser(user) {

    this.$http.delete('/api/users/id/'+user._id).then(response => {
      if (response.status == 200) {
        this.NotifyService.setData("Deleted", "User Removed");
        this.NotifyService.open("success");
      }
    });

  }
}

export default angular.module('rlmsApp.dashboard', [])
  .controller('DashboardComponent', DashboardComponent)
  .name;


