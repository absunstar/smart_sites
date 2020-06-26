app.controller("order_status", function ($scope, $http, $timeout) {
  $scope._search = {};

  $scope.order_status = {};


  $scope.addCustomerOpenion = function () {
    $scope.error = '';
    const v = site.validated('#customerOpenionAddModal');
    if (!v.ok) {
      $scope.error = v.messages[0].ar;
      return;
    }
    $scope.busy = true;
    $http({
      method: "POST",
      url: "/api/order_status/add",
      data: $scope.order_status
    }).then(
      function (response) {
        $scope.busy = false;
        if (response.data.done) {
          site.hideModal('#customerOpenionAddModal');
          $scope.getCustomerOpenionList();
        } else {
          $scope.error = response.data.error;
        }
      },
      function (err) {
        console.log(err);
      }
    )
  };


 
  $scope.getCustomerOpenionList = function (where) {
    $scope.busy = true;
    $scope.list = [];
    $http({
      method: "POST",
      url: "/api/order_status/all",
      data: {
        where: where
      }
    }).then(
      function (response) {
        $scope.busy = false;
        if (response.data.done && response.data.list.length > 0) {
          $scope.list = response.data.list;
          $scope.count = response.data.count;
          site.hideModal('#customerOpenionSearchModal');
          $scope.search = {};

        }
      },
      function (err) {
        $scope.busy = false;
        $scope.error = err;
      }

    )

  };

  $scope.getCustomerOpenionList();

});