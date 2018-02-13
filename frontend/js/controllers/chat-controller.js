myApp.controller('ChatCtrl', function ($scope, TemplateService, NavigationService, $timeout, toastr, $http, $uibModal) {
    $scope.template = TemplateService.getHTML("content/chat.html");
    TemplateService.title = "Chat"; //This is the Title of the Website
    TemplateService.header = "";
    TemplateService.footer = "";
    $scope.navigation = NavigationService.getNavigation();

    $scope.usernamePopup = function () {
        $uibModal.open({
            templateUrl: "views/modal/name.html",
            size: "md",
            windowClass: "take-modal",
            scope: $scope
        });
    };

    $scope.usernamePopup();

    // $timeout({
    //     $('#myModal').on('shown.bs.modal', function () {
    //         $('#myInput').trigger('focus')
    //     });
    // }, 300)
})