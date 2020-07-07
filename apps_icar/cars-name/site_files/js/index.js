app.controller("cars_name", function ($scope, $http, $timeout) {
  $scope._search = {};

  $scope.cars_name = {};

  $scope.displayAddCarsName = function () {
    $scope._search = {};
    $scope.error = '';
    $scope.cars_name = {
      image_url: '/images/cars_name.png',
      active: true
    };
    site.showModal('#carsNameAddModal');
  };

  $scope.addCarsName = function () {
    if ($scope.busy) {
      return;
    }
    $scope.error = '';
    $scope.busy = true;

    const v = site.validated('#carsNameAddModal');
    if (!v.ok) {
      $scope.error = v.messages[0].ar;
      return;
    };

    $http({
      method: "POST",
      url: "/api/cars_name/add",
      data: $scope.cars_name
    }).then(
      function (response) {
        $scope.busy = false;
        if (response.data.done) {
          site.hideModal('#carsNameAddModal');
          $scope.getCarsNameList();
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

  $scope.displayUpdateCarsName = function (cars_name) {
    $scope._search = {};

    $scope.error = '';
    $scope.detailsCarsName(cars_name);
    $scope.cars_name = {
      image_url: '/images/vendor_logo.png',

    };
    site.showModal('#carsNameUpdateModal');
  };

  $scope.updateCarsName = function () {
    if ($scope.busy) {
      return;
    }
    $scope.error = '';
    $scope.busy = true;

    const v = site.validated('#carsNameUpdateModal');
    if (!v.ok) {
      $scope.error = v.messages[0].ar;
      return;
    }
    $http({
      method: "POST",
      url: "/api/cars_name/update",
      data: $scope.cars_name
    }).then(
      function (response) {
        $scope.busy = false;
        if (response.data.done) {
          site.hideModal('#carsNameUpdateModal');
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

  $scope.displayDetailsCarsName = function (cars_name) {
    $scope.error = '';
    $scope.detailsCarsName(cars_name);
    $scope.cars_name = {};
    site.showModal('#carsNameDetailsModal');
  };

  $scope.detailsCarsName = function (cars_name) {
    $scope.busy = true;
    $http({
      method: "POST",
      url: "/api/cars_name/view",
      data: {
        id: cars_name.id
      }
    }).then(
      function (response) {
        $scope.busy = false;
        if (response.data.done) {
          response.data.doc.date = new Date(response.data.doc.date);
          $scope.cars_name = response.data.doc;
        } else {
          $scope.error = response.data.error;
        }
      },
      function (err) {
        console.log(err);
      }
    )
  };

  $scope.displayDeleteCarsName = function (cars_name) {
    $scope.error = '';
    $scope.detailsCarsName(cars_name);
    $scope.cars_name = {};
    site.showModal('#carsNameDeleteModal');
  };

  $scope.deleteCarsName = function () {
    $scope.error = '';
    $scope.busy = true;
    $http({
      method: "POST",
      url: "/api/cars_name/delete",
      data: {
        id: $scope.cars_name.id

      }
    }).then(
      function (response) {
        $scope.busy = false;
        if (response.data.done) {
          site.hideModal('#carsNameDeleteModal');
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

  $scope.getCarsNameList = function (where) {
    $scope.busy = true;
    $scope.list = [];
    $scope.count = 0;
    $http({
      method: "POST",
      url: "/api/cars_name/all",
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
    $scope.getCarsNameList($scope.search);
    site.hideModal('#carsNameSearchModal');
    $scope.search = {}

  };


  $scope.getCArsTypeList = function () {
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


/*   $scope.getScreenName = function () {
    $scope.busy = true;

    $http({
      method: "POST",
      url: "/api/numbering_transactions_status/get",
      data: {
        screen_name: "cars_name"
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
  $scope.getScreenName(); */
  $scope.getCarsNameList();
  $scope.getCArsTypeList();
});