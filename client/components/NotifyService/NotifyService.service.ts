'use strict';

  export function NotifyService($uibModal, $rootScope) {
    var NS =  {

      setData: function (title, textAlert) {
        $rootScope.dlgData = {
          boldTextTitle: title,
          textAlert: textAlert,
          mode: 'success'
        }
      },

      open: function (mode) {

        $rootScope.dlgData.mode = mode;

        $rootScope.modalInstance = $uibModal.open({
          templateUrl: 'components/NotifyService/notify.html',
          controller: NotifyService,
          controllerAs: 'notify',
          backdrop: true,
          keyboard: true,
          backdropClick: true,
          size: 'lg',
          resolve: {
            data: function () {
              return $rootScope.dlgData;
            }
          }
        });

      },

      close: function () {
        $rootScope.modalInstance.close($rootScope.dlgData);

      }
    };

    return NS;
  }

export default angular.module('rlmsApp.NotifyService', [])
  .service('NotifyService', NotifyService)
  .name;

