myApp.controller('ChatCtrl', function ($scope, TemplateService, NavigationService, $timeout, toastr, $uibModal, apiService) {
    $scope.template = TemplateService.getHTML("content/chat.html");
    TemplateService.title = "Chat"; //This is the Title of the Website
    TemplateService.header = "";
    TemplateService.footer = "";

    $scope.name = $.jStorage.get("name");

    $scope.navigation = NavigationService.getNavigation();
    var modalInstance;
    $scope.usernamePopup = function () {
        modalInstance = $uibModal.open({
            templateUrl: "views/modal/name.html",
            size: "md",
            windowClass: "take-modal",
            scope: $scope
        });
    };

    $scope.saveName = function (name) {
        $scope.name = name;
        $.jStorage.set("name", name);
        modalInstance.close();
    };

    if (_.isEmpty($scope.name)) {
        $scope.usernamePopup();
    }
});