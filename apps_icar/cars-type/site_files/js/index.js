app.controller("cars_type", function ($scope, $http, $timeout) {
  $scope._search = {};

  $scope.cars_type = {};

  $scope.displayAddCarsType = function () {
    $scope._search = {};
    $scope.error = '';
    $scope.cars_type = {
      image_url: '/images/cars_type.png',
      active: true
    };
    site.showModal('#carsTypeAddModal');
  };

  $scope.addCarsType = function () {
    if ($scope.busy) {
      return;
    }
    $scope.error = '';
    $scope.busy = true;

    const v = site.validated('#carsTypeAddModal');
    if (!v.ok) {
      $scope.error = v.messages[0].ar;
      return;
    };

    $http({
      method: "POST",
      url: "/api/cars_type/add",
      data: $scope.cars_type
    }).then(
      function (response) {
        $scope.busy = false;
        if (response.data.done) {
          site.hideModal('#carsTypeAddModal');
          $scope.getCarsTypeList();
        } else {
          $scope.error = response.data.error;
          if (response.data.error.like('*duplicate key error*')) {
            $scope.error = "##word.code_exisit##"
          } else if (response.data.error.like('*Please write code*')) {
            $scope.error = "##word.enter_code_inventory##"
          }
        }
      },
      function (err) {
        console.log(err);
      }
    )
  };

  $scope.displayUpdateCarsType = function (cars_type) {
    $scope._search = {};

    $scope.error = '';
    $scope.detailsCarsType(cars_type);
    $scope.cars_type = {
      image_url: '/images/vendor_logo.png',

    };
    site.showModal('#carsTypeUpdateModal');
  };

  $scope.updateCarsType = function () {
    if ($scope.busy) {
      return;
    }
    $scope.error = '';
    $scope.busy = true;

    const v = site.validated('#carsTypeUpdateModal');
    if (!v.ok) {
      $scope.error = v.messages[0].ar;
      return;
    }
    $http({
      method: "POST",
      url: "/api/cars_type/update",
      data: $scope.cars_type
    }).then(
      function (response) {
        $scope.busy = false;
        if (response.data.done) {
          site.hideModal('#carsTypeUpdateModal');
          $scope.list.forEach((b, i) => {
            if (b.id == response.data.doc.id) {
              $scope.list[i] = response.data.doc;
            }
          });
        } else {
          $scope.error = response.data.error;
        }
      },
      function (err) {
        console.log(err);
      }
    )
  };

  $scope.displayDetailsCarsType = function (cars_type) {
    $scope.error = '';
    $scope.detailsCarsType(cars_type);
    $scope.cars_type = {};
    site.showModal('#carsTypeDetailsModal');
  };

  $scope.detailsCarsType = function (cars_type) {
    $scope.busy = true;
    $http({
      method: "POST",
      url: "/api/cars_type/view",
      data: {
        id: cars_type.id
      }
    }).then(
      function (response) {
        $scope.busy = false;
        if (response.data.done) {
          response.data.doc.date = new Date(response.data.doc.date);
          $scope.cars_type = response.data.doc;
        } else {
          $scope.error = response.data.error;
        }
      },
      function (err) {
        console.log(err);
      }
    )
  };

  $scope.displayDeleteCarsType = function (cars_type) {
    $scope.error = '';
    $scope.detailsCarsType(cars_type);
    $scope.cars_type = {};
    site.showModal('#carsTypeDeleteModal');
  };

  $scope.deleteCarsType = function () {
    $scope.error = '';
    $scope.busy = true;
    $http({
      method: "POST",
      url: "/api/cars_type/delete",
      data: {
        id: $scope.cars_type.id

      }
    }).then(
      function (response) {
        $scope.busy = false;
        if (response.data.done) {
          site.hideModal('#carsTypeDeleteModal');
          $scope.list.forEach((b, i) => {
            if (b.id == response.data.doc.id) {
              $scope.list.splice(i, 1);
              $scope.count -= 1;
            }
          });
        } else {
          $scope.error = response.data.error;
        }
      },
      function (err) {
        console.log(err);
      }
    )
  };

  $scope.getCarsTypeList = function (where) {
    $scope.busy = true;
    $scope.list = [];
    $scope.count = 0;
    $http({
      method: "POST",
      url: "/api/cars_type/all",
      data: {
        where: where
      }
    }).then(
      function (response) {
        $scope.busy = false;
        if (response.data.done && response.data.list.length > 0) {
          $scope.list = response.data.list;
          $scope.count = response.data.count;
        }
      },
      function (err) {
        $scope.busy = false;
        $scope.error = err;
      }
    )
  };

  $scope.searchAll = function () {
    $scope._search = {};
    $scope.getCarsTypeList($scope.search);
    site.hideModal('#carsTypeSearchModal');
    $scope.search = {}

  };

  $scope.getScreenType = function () {
    $scope.busy = true;

    $http({
      method: "POST",
      url: "/api/numbering_transactions_status/get",
      data: {
        screen_name: "cars_type"
      }
    }).then(
      function (response) {
        $scope.busy = false;
        if (response.data) {
          $scope.disabledCode = response.data.doc == 'auto' ? true : false;
        }
      },
      function (err) {
        $scope.busy = false;
        $scope.error = err;
      }
    )
  };
  $scope.getScreenType();
  $scope.getCarsTypeList();

});