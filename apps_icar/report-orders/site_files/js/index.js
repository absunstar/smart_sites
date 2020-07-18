app.controller("report_orders", function ($scope, $http, $timeout) {
  $scope._search = {};

  $scope.report_orders = {};
  $scope.messages = '';
  $scope.statusId = {
    under_pricing: true,
    under_delivery: true,
    accepted: true,
    delivered: false,
    cancelled_order: false
  };

  $scope.status_list = [
    { id: 1, en: 'Under pricing', ar: 'قيد التسعير' },
    { id: 2, en: 'Under delivery', ar: 'قيد التوصيل' },
    { id: 3, en: 'Sent delivered', ar: 'تم التسليم' },
  ];

  $scope.getReportOrdersList = function (where) {
    $scope.busy = true;
    $scope.list = [];
    $scope.count = 0;

    if (!where) where = {};

    if ($scope.statusId.under_pricing) where.under_pricing = 1;

    if ($scope.statusId.under_delivery) where.under_delivery = 2;

    if ($scope.statusId.delivered) where.delivered = 3;

    if ($scope.statusId.cancelled_order) where.cancelled_order = 4;
    if ($scope.statusId.accepted) where.accepted = 5;

    $scope.statusId.cancelled_order = false;
    

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
      c.status = { id: 1, en: 'Under pricing', ar: 'قيد التسعير' }

    } else if (c.status.id == 2) {
      c.status = { id: 2, en: 'Under delivery', ar: 'قيد التوصيل' }

    } else if (c.status.id == 3) {
      c.status = { id: 3, en: 'Sent delivered', ar: 'تم التسليم' }

    } else if (c.status.id == 4) {
      c.status = { id: 4, en: 'Cancelled', ar: 'ملغي' }

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


  $scope.sendMessage = function (report_orders) {
    $scope.error = '';
    if ($scope.message) {

      report_orders.messages.push({ type: 'admin', msg: $scope.message, date: new Date() });
      $scope.message = '';

      $http({
        method: "POST",
        url: "/api/order_status/update",
        data: report_orders
      }).then(
        function (err) {
          console.log(err);
        }
      )
    }
  };

  $scope.deleteMessage = function (report_orders) {
    $scope.error = '';

    $http({
      method: "POST",
      url: "/api/order_status/update",
      data: report_orders
    }).then(
      function (err) {
        console.log(err);
      }
    )
  };



  /*   $scope.sendMessage = function (ev, report_orders) {
      if (ev.which !== 13) {
        return;
      }
  
      report_orders.messages.push({ type: 'admin', msg: $scope.message, date: new Date() });
      $scope.message = '';
    };
   */

  $scope.displayDetailsReportOrdersList = function (report_orders) {
    $scope.error = '';
    $scope.viewReportOrdersList(report_orders);
    $scope.report_orders = {};
    site.showModal('#reportOrdersViewModal');
  };

  $scope.viewReportOrdersList = function (report_orders) {
    $scope.busy = true;
    $scope.error = '';

    if (!report_orders.notifi) {
      report_orders.notifi = true;

      $http({
        method: "POST",
        url: "/api/order_status/update",
        data: report_orders
      }).then(
        function (err) {
          console.log(err);
        }
      )
    }


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

  /*  $scope.getAreaList = function (city) {
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
  */
  $scope.getCArsTypeList = function (where) {
    $scope.busy = true;
    $http({
      method: "POST",
      url: "/api/cars_type/all",
      data: {
        where: {
          active: true
        },
        select: { id: 1, name_ar: 1, name_en: 1 }
      }
    }).then(
      function (response) {
        $scope.busy = false;
        if (response.data.done && response.data.list.length > 0) {
          $scope.carsTypeList = response.data.list;

        }
      },
      function (err) {
        $scope.busy = false;
        $scope.error = err;
      }
    )
  };

  $scope.getCArsNameList = function (car_type) {
    $scope.busy = true;
    $http({
      method: "POST",
      url: "/api/cars_name/all",
      data: {
        where: {
          'car_type.id': car_type.id,
          active: true
        },
        select: { id: 1, name_ar: 1, name_en: 1 }
      }
    }).then(
      function (response) {
        $scope.busy = false;
        if (response.data.done && response.data.list.length > 0) {
          $scope.carsNameList = response.data.list;
        }
      },
      function (err) {
        $scope.busy = false;
        $scope.error = err;
      }
    )
  };

  $scope.getReportOrdersList({ date: new Date() });
  $scope.getCArsTypeList();
  $scope.getGovList();

});