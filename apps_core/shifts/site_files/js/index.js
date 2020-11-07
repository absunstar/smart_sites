app.controller("shifts", function ($scope, $http, $timeout) {
  $scope._search = {};

  $scope.shift = {};

  $scope.displayAddShift = function () {
    $scope.is_shift_open((yes) => {
      if (!yes) {
        $scope.error = '';
        $scope.shift = {
          image_url: '/images/shift.png',
          from_date: new Date(),
          from_time: {
            hour: new Date().getHours(),
            minute: new Date().getMinutes()
          },
          active: true
        };

        site.showModal('#shiftAddModal');
      } else {
        $scope.error = '##word.must_close_shift##'
      };
    });
  };

  $scope.addShift = function () {
    $scope.error = '';
    const v = site.validated('#shiftAddModal');
    if (!v.ok) {
      $scope.error = v.messages[0].ar;
      return;
    }
    $scope.busy = true;
    $http({
      method: "POST",
      url: "/api/shifts/add",
      data: $scope.shift
    }).then(
      function (response) {
        $scope.busy = false;
        if (response.data.done) {
          site.hideModal('#shiftAddModal');
          $scope.getShiftList();
        } else {
          $scope.error = response.data.error;
        }
      },
      function (err) {
        console.log(err);
      }
    )
  };

  $scope.displayUpdateShift = function (shift) {
    $scope.error = '';
    $scope.viewShift(shift);
    $scope.shift = {};
    site.showModal('#shiftUpdateModal');
  };

  $scope.updateShift = function () {
    $scope.error = '';
    const v = site.validated('#shiftUpdateModal');
    if (!v.ok) {
      $scope.error = v.messages[0].ar;
      return;
    }
    $scope.busy = true;
    $http({
      method: "POST",
      url: "/api/shifts/update",
      data: $scope.shift
    }).then(
      function (response) {
        $scope.busy = false;
        if (response.data.done) {
          site.hideModal('#shiftUpdateModal');
          $scope.getShiftList();
        } else {
          $scope.error = 'Please Login First';
        }
      },
      function (err) {
        console.log(err);
      }
    )
  };

  $scope.displayDetailsShift = function (shift) {
    $scope.error = '';
    $scope.viewShift(shift);
    $scope.shift = {};
    site.showModal('#shiftViewModal');
  };

  $scope.viewShift = function (shift) {
    $scope.busy = true;
    $scope.error = '';
    $http({
      method: "POST",
      url: "/api/shifts/view",
      data: {
        id: shift.id
      }
    }).then(
      function (response) {
        $scope.busy = false;
        if (response.data.done) {
          $scope.shift = response.data.doc;
        } else {
          $scope.error = response.data.error;
        }
      },
      function (err) {
        console.log(err);
      }
    )
  };

  $scope.displayDeleteShift = function (shift) {
    $scope.error = '';
    $scope.viewShift(shift);
    $scope.shift = {};
    site.showModal('#shiftDeleteModal');
  };

  $scope.deleteShift = function () {
    $scope.busy = true;
    $scope.error = '';

    $http({
      method: "POST",
      url: "/api/shifts/delete",
      data: {
        id: $scope.shift.id
      }
    }).then(
      function (response) {
        $scope.busy = false;
        if (response.data.done) {
          site.hideModal('#shiftDeleteModal');
          $scope.getShiftList();
        } else {
          $scope.error = response.data.error;
        }
      },
      function (err) {
        console.log(err);
      }
    )
  };

  $scope.getShiftList = function (where) {
    $scope.error = '';
    $scope.busy = true;
    $scope.list = [];
    $http({
      method: "POST",
      url: "/api/shifts/all",
      data: {
        where: where
      }
    }).then(
      function (response) {
        $scope.busy = false;
        if (response.data.done && response.data.list.length > 0) {
          $scope.list = response.data.list;
          $scope.count = response.data.count;
          site.hideModal('#shiftSearchModal');
          $scope.search = {};

        }
      },
      function (err) {
        $scope.busy = false;
        $scope.error = err;
      }
    )
  };

  $scope.displaySearchModal = function () {
    $scope.error = '';
    site.showModal('#shiftSearchModal');

  };

  $scope.is_shift_open = function (callback) {
    $scope.error = '';
    $scope.busy = true;
    $http({
      method: "POST",
      url: "/api/shifts/is_shift_open"
    }).then(
      function (response) {
        $scope.busy = false;
        callback(response.data.is_open);
      }, function (err) {
        callback(true);
        $scope.busy = false;
        $scope.error = err;
      }
    )
  };

  $scope.searchAll = function () {
    $scope.error = '';

    $scope.getShiftList($scope.search);
    site.hideModal('#shiftSearchModal');
    $scope.search = {};
  };

  $scope.shifStart = function () {
    $scope.error = '';

    $scope.shift.from_date = new Date();
    $scope.shift.from_time = {
      hour: new Date().getHours(),
      minute: new Date().getMinutes()
    };

  };

  $scope.close_shift = function (shift) {
    $scope.error = '';

    shift.to_date = new Date();
    shift.to_time = {
      hour: new Date(shift.to_date).getHours(),
      minute: new Date(shift.to_date).getMinutes()
    };
    shift.active = false;

    $scope.busy = true;
    $http({
      method: "POST",
      url: "/api/shifts/update",
      data: shift
    }).then(
      function (response) {
        $scope.busy = false;
        if (response.data.done) {
          site.hideModal('#shiftUpdateModal');
          $scope.getShiftList();
          $scope.getOpenShiftList();
        } else $scope.error = 'Please Login First';
      },
      function (err) {
        console.log(err);
      }
    )
  };

  $scope.shifOpen = function (shift) {
    $scope.error = '';
    if ($scope.openShift) {

      shift.to_date = null;
      shift.to_time = null;

      $scope.busy = true;
      $http({
        method: "POST",
        url: "/api/shifts/update",
        data: shift
      }).then(
        function (response) {
          $scope.busy = false;
          if (response.data.done) {
            site.hideModal('#shiftUpdateModal');
            $scope.getShiftList();
          } else {
            $scope.error = 'Please Login First';
          }
        },
        function (err) {
          console.log(err);
        }
      )
    } else $scope.error = '##word.must_close_shift##';

  };


  $scope.getShiftList();
});