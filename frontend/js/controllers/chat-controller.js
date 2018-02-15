myApp.controller('ChatCtrl', function ($scope, TemplateService, NavigationService, $timeout, toastr, $uibModal, apiService) {
    $scope.template = TemplateService.getHTML("content/chat.html");
    TemplateService.title = "Chat"; //This is the Title of the Website
    TemplateService.header = "";
    TemplateService.footer = "";

    $scope.message = {};

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

    io.socket.on("chatUpdate", function (data) {
        $scope.allChats = data;
        scrollBottom();
        $scope.$apply();
    });



    function scrollBottom() {
        $timeout(function () {
            $(".chat-history").animate({
                scrollTop: $(".chat-history ul").height() -
                    $(".chat-history").height()
            }, 400);
        }, 300);
    };


    $scope.reloadChat = function () {
        apiService.getAll(function (data) {
            $scope.allChats = data.data.data;
            scrollBottom();
        });
    };
    $scope.reloadChat();

    $scope.saveName = function (name) {
        $scope.name = name;
        $.jStorage.set("name", name);
        modalInstance.close();
    };

    //  Send typed message

    $scope.sendMessage = function (chatText) {
        apiService.saveText(chatText, function (res) {
            $scope.message.chatText = "";
        });
    };

    //  Clear the message

    $scope.clearMessage = function () {
        apiService.clearText(function (res) {
            console.log(res);
        });
    };

    if (_.isEmpty($scope.name)) {
        $scope.usernamePopup();
    }


    $scope.goToLink = function (placeId) {
        var url = "https://www.google.com/maps/place/?q=place_id:" + placeId;
        window.open(url, '_blank');
    };
});