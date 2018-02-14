myApp.factory('apiService', function ($http, $q, $timeout) {
    return {
        // This is a demo Service for POST Method.
        saveText: function (text, callback) {
            $http({
                url: adminurl + 'bots/saveText',
                method: 'POST',
                data: {
                    user: $.jStorage.get("name"),
                    text: text
                }
            }).then(callback);
        },
        clearText: function (callback) {
            $http({
                url: adminurl + 'bots/clearText',
                method: 'POST',
                data: {
                    user: $.jStorage.get("name"),
                    text: "clear all"
                }
            }).then(callback);
        },
        getAll: function (callback) {
            $http({
                url: adminurl + 'bots/getAll',
                method: 'POST',
                data: {
                    user: $.jStorage.get("name"),
                    text: "clear all"
                }
            }).then(callback);
        }
        // This is a demo Service for POST Method.
    };
});