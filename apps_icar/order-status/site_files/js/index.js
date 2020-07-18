app.controller("order_status", function ($scope, $http, $timeout) {
  $scope._search = {};

  $scope.order_status = {};
  $scope.message = '';
  $scope.reference_number = '';

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

  $scope.received = function (c) {
    $scope.error = '';
    c.status = { id: 3, en: 'Sent delivered', ar: 'تم التسليم' };
    $http({
      method: "POST",
      url: "/api/order_status/update",
      data: c
    }).then(
      function (response) {
        if (response.data.done) {

        } else {
          $scope.error = 'Please Login First';
        }
      },
      function (err) {
        console.log(err);
      }
    )
  };


  /*   $scope.viewMessages = function (order_status) {
      $scope.error = '';
      $scope.order_status = order_status;
      site.showModal('#orderStatusMessageModal')
    }; */

  $scope.sendMessage = function (order_status) {

    $scope.error = '';

    if ($scope.message) {


      order_status.messages.push({ type: 'customer', msg: $scope.message, date: new Date() });
      $scope.message = '';

      $http({
        method: "POST",
        url: "/api/order_status/update",
        data: order_status
      }).then(
        function (err) {
          console.log(err);
        }
      )
    }
  };

  $scope.acceptOrder = function (order_status) {
    $scope.error = '';

    if (order_status.convirm == 'cancel' && !order_status.cancel) {
      $scope.error = "##word.reason_cancel_order##";
      return;
    };

    if (order_status.convirm == 'accept') {
      order_status.status = { id: 5, en: 'Accepted', ar: 'تم التأكيد' }
    };


    order_status.accept_buy = true;

    $http({
      method: "POST",
      url: "/api/order_status/update",
      data: order_status
    }).then(
      function (err) {
        console.log(err);
      }
    )

  };


  $scope.acceptEvaluation = function (order_status) {

    $scope.error = '';

    order_status.accept_evaluation = true;

    $http({
      method: "POST",
      url: "/api/order_status/update",
      data: order_status
    }).then(
      function (response) {
        if (response.data.done) {
          if (order_status.evaluation && order_status.evaluation.vote) {
            if (order_status.evaluation.vote == 'satisfied' || order_status.evaluation.vote == 'acceptable') {

              let obj = {
                date: new Date(),
                vote: order_status.evaluation.vote,
                full_name: order_status.customer_name,
                your_opinion: order_status.evaluation.your_opinion
              };

              $http({
                method: "POST",
                url: "/api/customer_opinion/add",
                data: obj
              })

            }
          }


        } else {
          $scope.error = 'Please Login First';
        }
      },
      function (err) {
        console.log(err);
      }
    )


  };


  $scope.getOrderCustomerList = function () {
    $scope.error = '';

    $scope.busy = true;
    $scope.ordersList = [];
    let customerId = { customerId: site.toNumber('##user.id##') };

    $http({
      method: "POST",
      url: "/api/order_status/all",
      data: {
        where: customerId
      }
    }).then(
      function (response) {
        $scope.busy = false;
        if (response.data.done && response.data.list.length > 0) {
          $scope.ordersList = response.data.list;
          $scope.count = response.data.count;
          $scope.search = {};

        } else {
          $scope.error = '##word.err_order##';
        }
      },
      function (err) {
        $scope.busy = false;
        $scope.error = err;
      }

    )

  };

  $scope.getOrderStatusList = function (where) {
    $scope.error = '';

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

        } else {
          $scope.error = '##word.err_order##';
        }
      },
      function (err) {
        $scope.busy = false;
        $scope.error = err;
      }

    )

  };


  $scope.displayDetailsReportOrdersList = function (report_orders) {
    $scope.error = '';
    $scope.viewReportOrdersList(report_orders);
    $scope.report_orders = {};
    site.showModal('#reportOrdersViewModal');
  };



  if ('##user.type##' == 'customer') $scope.getOrderCustomerList();
});