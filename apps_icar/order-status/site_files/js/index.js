app.controller("order_status", function ($scope, $http, $timeout) {
  $scope._search = {};

  $scope.order_status = {};


  $scope.addOrderStatus = function () {
    $scope.error = '';
    const v = site.validated('#orderStatusAddModal');
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
          site.hideModal('#orderStatusAddModal');
        } else {
          $scope.error = response.data.error;
        }
      },
      function (err) {
        console.log(err);
      }
    )
  };



  $scope.getOrderStatusList = function (where) {
    $scope.busy = true;
    $scope.list = [];
    let code = { code: where };

    $http({
      method: "POST",
      url: "/api/order_status/all",
      data: {
        where: code
      }
    }).then(
      function (response) {
        $scope.busy = false;
        if (response.data.done && response.data.list.length > 0) {
          $scope.list = response.data.list;
          $scope.count = response.data.count;
          $scope.search = {};

        }
      },
      function (err) {
        $scope.busy = false;
        $scope.error = err;
      }

    )

  };


});