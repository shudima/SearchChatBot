
function chatController($scope, $http) {
	$scope.history = ["Bot: Hi!"]

	$scope.getAnswer = function($http, question)
	{
		$http.get("http://localhost:8080/")
    	     .success(function(response) { $scope.history.push("Bot: " + response.answer_text);})
    		 .error(function(data, status, headers, config) { alert(status);});
	}

	$scope.questionKeyPressed = function($event)
	{
		if ($event.keyCode == 13) 
			{
				$scope.history.push("You: " + $scope.question);
				$scope.getAnswer($http, $scope.question);
				$scope.question = "";
			};		
	};

}
