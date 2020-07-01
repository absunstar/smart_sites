app.controller("report_orders", function ($scope, $http, $timeout) {
  $scope._search = {};

  $scope.report_orders = {};


  $scope.getReportOrdersList = function (where) {
    $scope.busy = true;
    $scope.list = [];
    $scope.count = 0;
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
          $scope.count = $scope.list.length;

        }
      },
      function (err) {
        $scope.busy = false;
        $scope.error = err;
      }
    )
  };

  $scope.updateReportOrdersList = function (c) {
    $scope.error = '';


    if (c.status.id == 1) {
      c.status = {
        id: 1,
        en: 'hold',
        ar: 'معلق'
      }

    } else if (c.status.id == 2) {
      c.status = {
        id: 2,
        en: 'Under Delivery',
        ar: 'قيد التوصيل'
      }
    } else if (c.status.id == 3) {
      c.status = {
        id: 3,
        en: 'Delivered',
        ar: 'تم التوصيل'
      }
    }


    $scope.busy = true;
    $http({
      method: "POST",
      url: "/api/order_status/update",
      data: c
    }).then(
      function (response) {
        $scope.busy = false;
        if (response.data.done) {
          $scope.getReportOrdersList({ date: new Date() });

        } else {
          $scope.error = 'Please Login First';
        }
      },
      function (err) {
        console.log(err);
      }
    )
  };


  $scope.displayDetailsReportOrdersList = function (report_orders) {
    $scope.error = '';
    $scope.viewReportOrdersList(report_orders);
    $scope.report_orders = {};
    site.showModal('#reportOrdersViewModal');
  };

  $scope.viewReportOrdersList = function (report_orders) {
    $scope.busy = true;
    $scope.error = '';
    $http({
      method: "POST",
      url: "/api/order_status/view",
      data: {
        id: report_orders.id
      }
    }).then(
      function (response) {
        $scope.busy = false;
        if (response.data.done) {
          $scope.report_orders = response.data.doc;
        } else {
          $scope.error = response.data.error;
        }
      },
      function (err) {
        console.log(err);
      }
    )
  };

  $scope.displayDeleteReportOrdersList = function (report_orders) {
    $scope.error = '';
    $scope.viewReportOrdersList(report_orders);
    $scope.report_orders = {};
    site.showModal('#reportOrdersDeleteModal');
  };

  $scope.deleteReportOrdersList = function () {
    $scope.busy = true;
    $scope.error = '';

    $http({
      method: "POST",
      url: "/api/order_status/delete",
      data: {
        id: $scope.report_orders.id
      }
    }).then(
      function (response) {
        $scope.busy = false;
        if (response.data.done) {
          site.hideModal('#reportOrdersDeleteModal');
          $scope.getReportOrdersList();
        } else {
          $scope.error = response.data.error;
        }
      },
      function (err) {
        console.log(err);
      }
    )
  };




  $scope.searchAll = function () {
    $scope._search = {};
    $scope.getReportOrdersList($scope.search);
    site.hideModal('#reportOrdersSearchModal');
    $scope.search = {}
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



  $scope.getReportOrdersList({ date: new Date() });
  $scope.getGovList();

});