app.controller("icar", function ($scope, $http, $timeout) {
  $scope._search = {};

  $scope.customer_opinion = {};
  $scope.order_status = { place: 'personal' };
  $scope.code = '';


  $scope.addCustomerOpinion = function () {

    $scope.error = '';

    const v = site.validated('#customerOpinionAddModal');
    if (!v.ok) {
      $scope.error = v.messages[0].ar;
      return;
    }

    $scope.customer_opinion.date = new Date();

    $scope.busy = true;
    $http({
      method: "POST",
      url: "/api/customer_opinion/add",
      data: $scope.customer_opinion
    }).then(
      function (response) {
        $scope.busy = false;
        if (response.data.done) {
          $scope.customer_opinion = {};

        } else {
          $scope.error = response.data.error;
        }
      },
      function (err) {
        console.log(err);
      }
    )
  };



  $scope.addOrderStatus = function () {
    $scope.error = '';
    const v = site.validated('#orderPartAddModal');
    if (!v.ok) {
      $scope.error = v.messages[0].ar;
      return;
    }

    $scope.order_status.date = new Date();
    $scope.order_status.status = { id: 1, ar: 'معلق', en: 'Hold' };

    $scope.busy = true;
    $http({
      method: "POST",
      url: "/api/order_status/add",
      data: $scope.order_status
    }).then(
      function (response) {
        $scope.busy = false;
        if (response.data.done) {
          $scope.code = response.data.doc.code;
          $scope.order_status = { place: 'personal' };

        } else {
          $scope.error = response.data.error;
        }
      },
      function (err) {
        console.log(err);
      }
    )
  };


  $scope.getGovList = function (where) {
    $scope.busy = true;
    $http({
      method: "POST",
      url: "/api/goves/all",
      data: {
        where: {
          active: true
        },
        select: { id: 1, name: 1 }
      }
    }).then(
      function (response) {
        $scope.busy = false;
        if (response.data.done && response.data.list.length > 0) {
          $scope.govList = response.data.list;
        }
      },
      function (err) {
        $scope.busy = false;
        $scope.error = err;
      }
    )
  };

  $scope.getCityList = function (gov) {
    $scope.busy = true;
    $http({
      method: "POST",
      url: "/api/city/all",
      data: {
        where: {
          'gov.id': gov.id,
          active: true
        },
        select: { id: 1, name: 1 }
      }
    }).then(
      function (response) {
        $scope.busy = false;
        if (response.data.done && response.data.list.length > 0) {
          $scope.cityList = response.data.list;
        }
      },
      function (err) {
        $scope.busy = false;
        $scope.error = err;
      }
    )
  };

  $scope.getAreaList = function (city) {
    $scope.busy = true;
    $http({
      method: "POST",
      url: "/api/area/all",
      data: {
        where: {
          'city.id': city.id,
          active: true
        },
      }
    }).then(
      function (response) {
        $scope.busy = false;
        if (response.data.done && response.data.list.length > 0) {
          $scope.areaList = response.data.list;
        }
      },
      function (err) {
        $scope.busy = false;
        $scope.error = err;
      }
    )
  };


  $scope.getGovList();
});