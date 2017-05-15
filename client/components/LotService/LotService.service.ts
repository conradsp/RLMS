'use strict';
const angular = require('angular');

/*@ngInject*/
export function LotService() {
  'ngInject';
  var LS = {
    uploadPhoto(lotID){
      this.lot = {};

    },
    setCurrLot(lotID) {
      this.lotID = lotID;
    },
    getCurrLot() {
      return this.lotID;
    }
    createLotFullName(lot) {
      var lotFullName = lot.lot_name + ' ' + lot.district + ' ' + lot.quantity + ' ' + lot.livestock_type + ' ESTLW ' + lot.avg_weight + ' (' + lot.bottom_weight + '-' + lot.top_weight + ') ';
      if (lot.teeth != undefined) {
        if (lot.teeth.mt > 0 ) {
          lotFullName += 'MT ';
        }
        if (lot.teeth.twot > 0) {
          lotFullName += '2T ';
        }
        if (lot.teeth.fourt > 0) {
          lotFullName += '4T ';
        }
        if (lot.teeth.sixt > 0) {
          lotFullName += '6T ';
        }
        if (lot.teeth.fm > 0) {
          lotFullName += 'FM ';
        }
      }
      return lotFullName;
    }
  };
  return LS;
}

export default angular.module('rlmsApp.LotService', [])
  .service('LotService', LotService)
  .name;
