
function chatController($scope, $http) {
	$scope.history = ["Bot: Hi!"]
	$scope.img_src = "img\\3.png"
	$scope.getAnswer = function($http, question)
	{
		$http.get("http://localhost:8080/?text=" + question)
    	     .success(function(response) { 
    	     	$scope.history.push("Bot: " + response.answer_text);

    	     	if (response.sentiment == 6) 
    	     		$scope.img_src = "img\\3.png"
    	     	if (response.sentiment == 7 || response.sentiment == 8) 
    	     		$scope.img_src = "img\\4.png"
    	     	 if (response.sentiment > 8) 
    	     		$scope.img_src = "img\\4.png"
    	     	if (response.sentiment == 5 || response.sentiment == 4) 
    	     		$scope.img_src = "img\\2.png"    
    	     	if (response.sentiment < 4) 
    	     		$scope.img_src = "img\\1.png"   
    	     })
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
