var app = angular.module('currencyApp', ['currencyApp.services', 'currencyApp.directives']);

app.controller('currencyController', function($scope, currencyService) {
    $scope.SCData = {};
    $scope.trackData = [];
    $scope.errors = {
        invalidGenre : "Ошибка. Уточните ваш поисковой запрос.",
        noResult : "К сожалению ничего не найдено. Попробуйте выбрать другой жанр."
    };
    $scope.timeMass = ["Все результаты","Короткие","Средняя длительность","Длинные"];
    $scope.simpleView = false;
    $scope.showSearch = true;
    $scope.clearFlag = false;
    $scope.genreForSearch = "";
    $scope.curRank = "";
    $scope.viewButtonTexts = {
        full : "Переключить на развернутый вид",
        simple : "Переключить на упрощенный вид"
    }
    $scope.viewButton = $scope.viewButtonTexts.simple;
    $scope.aRank = {
        aSearch : "",
        aReverse : false
    };  
    $scope.tRank = {
        tSearch : "",
        tReverse : false
    };
    $scope.dRank = {
        dSearch : $scope.timeMass[0],
        dReverse : false,
        Min : 0,
        Max : 1000*1000*60
    };

    $scope.$watch('genreForSearch', function (newVal, oldVal) {     
       if (!newVal.length) {
        $scope.clearResults();
       }
   });

    $scope.$watch('dRank.dSearch', function (newVal, oldVal) {  
        if (newVal == $scope.timeMass[0]) {
            $scope.dRank.Min = 0;
            $scope.dRank.Max = 1000*60*1000;
       }   
       if (newVal == $scope.timeMass[1]) {
            $scope.dRank.Min = 0;
            $scope.dRank.Max = 2*60*1000;
       }
       if (newVal == $scope.timeMass[2]) {
            $scope.dRank.Min = 2*60*1000;
            $scope.dRank.Max = 5*60*1000;
       }
        if (newVal == $scope.timeMass[3]) {
            $scope.dRank.Min = 5*60*1000;
            $scope.dRank.Max = 1000*60*1000;
       }
   });

    $scope.timeFn = function(item) {
            return item.duration >  $scope.dRank.Min && item.duration < $scope.dRank.Max
    }

    
    $scope.clearResults = function() {
        $scope.viewButton = $scope.viewButtonTexts.simple;
        $scope.trackData = [];
        $scope.genreForSearch = "";
        $scope.errMessage = "";
        $scope.tableShow = false;
        $scope.clearFlag = false;
        $scope.simpleView = false;
        $scope.clearSearch();

    }

    $scope.clearSearch = function() {
        $scope.dRank.dSearch = $scope.timeMass[0];
        $scope.aRank.aSearch = "";
        $scope.tRank.tSearch = "";
    }

    $scope.viewSwitch = function() {
        $scope.simpleView = !$scope.simpleView; 
        $scope.getTemplateURL();
        if (!$scope.simpleView) {
            $scope.viewButton = $scope.viewButtonTexts.simple;
        }
        else{
            $scope.viewButton = $scope.viewButtonTexts.full;
        }
    }

    $scope.connectButton = function() {
        $scope.clearSearch();
        $scope.getTemplateURL();
        if (!$scope.genreForSearch) {
            $scope.errMessage = $scope.errors.invalidGenre;
            $scope.tableShow = false;
        }
        else{  
            $scope.errMessage = "";
            currencyService.getMusic($scope.genreForSearch).then(function(data) {
                $scope.SCData = data;

                if (!$scope.SCData.length) {
                    $scope.errMessage = $scope.errors.noResult;
                    $scope.trackData = [];
                    $scope.tableShow = false;
                    $scope.clearFlag = true;
                }
                else{
                    if (!$scope.simpleView) {
                        $scope.showSearch = true;  
                        $scope.clearFlag = true;  
                    };
                    $scope.errMessage = "";
                    angular.forEach($scope.SCData, function(value, key){
                        $scope.trackData[key] = {
                            id : (key + 1),
                            picURL : value.artwork_url || "http://www.sitindia.com/res/img/img-not-found.png",
                            title : value.title,
                            author : value.user.username,
                            duration : value.duration,
                            src : value.permalink_url
                        };
                        $scope.tableShow = true;
                    });
                }
            });
        }    
    } 
});

app.config(['$httpProvider', function($httpProvider) {
        $httpProvider.defaults.useXDomain = true;
        delete $httpProvider.defaults.headers.common['X-Requested-With'];
    }
]);