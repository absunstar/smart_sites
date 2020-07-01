app.controller("customer_opinion", function ($scope, $http, $timeout) {
  $scope._search = {};

  $scope.customer_opinion = {};


  $scope.addCustomerOpinion = function () {
    $scope.error = '';
    const v = site.validated('#customerOpinionAddModal');
    if (!v.ok) {
      $scope.error = v.messages[0].ar;
      return;
    }
    $scope.busy = true;
    $http({
      method: "POST",
      url: "/api/customer_opinion/add",
      data: $scope.customer_opinion
    }).then(
      function (response) {
        $scope.busy = false;
        if (response.data.done) {
          site.hideModal('#customerOpinionAddModal');
          $scope.getCustomerOpinionList();
        } else {
          $scope.error = response.data.error;
        }
      },
      function (err) {
        console.log(err);
      }
    )
  };



  $scope.deleteCustomerOpinion = function (c) {
    $scope.busy = true;
    $scope.error = '';

    $http({
      method: "POST",
      url: "/api/customer_opinion/delete",
      data: {
        id: c.id
      }
    }).then(
      function (response) {
        $scope.busy = false;
        if (response.data.done) {
          $scope.getCustomerOpinionList()
        } else {
          $scope.error = response.data.error;
        }
      },
      function (err) {
        console.log(err);
      }
    )
  };



  $scope.getCustomerOpinionList = function (where) {
    $scope.busy = true;
    $scope.list = [];
    $http({
      method: "POST",
      url: "/api/customer_opinion/all",
      data: {
        where: where
      }
    }).then(
      function (response) {
        $scope.busy = false;
        if (response.data.done && response.data.list.length > 0) {
          $scope.list = response.data.list;
          $scope.count = response.data.count;
          site.hideModal('#customerOpinionSearchModal');
          $scope.search = {};

        }
      },
      function (err) {
        $scope.busy = false;
        $scope.error = err;
      }

    )

  };

  $scope.getCustomerOpinionList();

});