var app = app || angular.module('myApp', []);



app.controller('sitebottom', ($scope, $http) => {

    $scope.register = function () {
        site.showModal('#registerModal');
    };

    $scope.login = function () {
        site.showModal('#loginModal');
    };

    $scope.logout = function () {
        site.showModal('#logoutModal');
    };

    $scope.addCustomerOpenion = function (customer_openion) {
        $scope.error = '';
        const v = site.validated('#customerOpenionAdd');
        if (!v.ok) {
            $scope.error = v.messages[0].ar;
            return;
        }
        $scope.busy = true;
        $http({
            method: "POST",
            url: "/api/customer_openion/add",
            data: customer_openion
        }).then(
            function (response) {
                $scope.busy = false;
                if (response.data.done) {
                    customer_openion = {};
                } else {
                    $scope.error = response.data.error;
                }
            },
            function (err) {
                console.log(err);
            }
        )
    };

    $scope.changeLang = function (lang) {
        $http({
            method: 'POST',
            url: '/@language/change',
            data: { name: lang }
        }).then(function (response) {
            if (response.data.done) {
                window.location.reload(true);
            }
        });
    };

});