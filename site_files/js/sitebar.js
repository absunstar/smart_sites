var app = app || angular.module('myApp', []);

/*let btn = document.querySelector('.sitebar .tab-link');
if (btn) {
    btn.click();
}*/

site.showTabs(event, '#main_tabs');


app.controller('sitebar', ($scope, $http) => {


    $scope.notifi = 0;
    $scope.getOrderNotifiList = function () {
        $scope.error = '';
        $http({
            method: "POST",
            url: "/api/order_status/all",
            data: {
                where: {
                    'notifi': { $ne: true }
                }
            }
        }).then(
            function (response) {
                $scope.busy = false;
                if (response.data.done && response.data.list.length > 0) {
                    $scope.notifi = response.data.count;
                } else {
                    $scope.error = '##word.err_order##';
                }
            },
            function (err) {
                $scope.error = err;
            }

        )

    };


    $scope.getOrderNotifiList();



    $scope.register = function () {
        site.showModal('#registerModal');
    };

    $scope.showRegisterModal = function () {
        $scope.customer = {
            image_url: '/images/customer.png'
        };

        site.showModal('#customerRegisterModal')
    };

    $scope.registerCustomer = function () {
        $scope.user = { profile: { image_url: '/images/user.png', files: [] }, permissions: [], roles: [] };
        site.showModal('#customerRegisterModal');
    };

    $scope.login = function () {
        site.showModal('#loginModal');
    };

    $scope.showBranches = function () {
        site.showModal('#branchesModal');
    };

    $scope.logout = function () {
        site.showModal('#logoutModal');
    };

    $scope.changeLang = function (lang) {
        $http({
            method: 'POST',
            url: '/@language/change',
            data: {
                name: lang
            }
        }).then(function (response) {
            if (response.data.done) {
                window.location.reload(true);
            }
        });
    };

});