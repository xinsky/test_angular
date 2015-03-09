angular.module('currencyApp.directives', [])
.directive('contentView', function(){
    return {
            link: function($scope, elem, attrs) {
	            $scope.getTemplateURL = function() {
                    if (!$scope.simpleView) {
                        $scope.template = "template/full.html";    
                    }
                    else{
                        $scope.template = "template/simple.html";    
                    }
	        		
	    		}	
            },
            restrict: 'EA',
            replace: true,
            template: '<div ng-include="template"></div>' 
    };
});


           