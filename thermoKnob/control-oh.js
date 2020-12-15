
/*
var app = angular.module('KnobDemoApp', ['ui.knob'])
app.controller('knobCtrl', function ($scope) {
  $scope.value = 65;
  $scope.options = {
    size: 300
    //other options
  };
});
*/

angular
    .module('KnobDemoApp', ['ui.knobthermo'])
    .controller('knobCtrlOH', monControlOH);

monControlOH.$inject = ['$scope','OHService'];
function monControlOH($scope,OHService) {
	//var yo=OHService.getItems();
	/// .item
	//console.log("OH items "+JSON.stringify(Object.keys(OHService),null,4));
	//console.log("$scope is "+JSON.stringify(Object.keys($scope),null,4));
	var hasConfig=(typeof $scope.config != 'undefined' );
	var hasLabel=false;
	if( hasConfig ) {
		hasLabel=($scope.config.label!=="");
	}
	/*
	console.log("config label is set to "+$scope.config.label+ " nonvide "+hasLabel);
	console.log("config current is set to "+$scope.config.current);
	console.log("config setpoint is set to "+$scope.config.setpoint);
	console.log("config heating is set to "+$scope.config.heating);
	*/
	//$scope.value = 21; // tracking/commanding config.setpoint
	//$scope.current=18; // tracking config.current
	//$scope.heating=0; // tracking config.heating
	$scope.options = {
		  //size: 300,
		  skin: {
			  type: 'simple',
			  color: '#919191', //'ff6060' // observed
			  width:20,
			  spaceWidth:0,
			  startAngle:-120,
			  endAngle:120
		  },
		  trackWidth: 50,
		  trackColor: '#919191',
		  trackColorFull: '#91919130',
		  barWidth: 20,
		  subText: {
			enabled: true,
			text: '21°',
		        color: '#919191', // current
		        font: 'auto'
		  },
		  min: 5,
		  max: 35,
		  step: 1,
		  prevBarColor: 'rgba(0,0,1,.2)',
		  displayPrevious: true,
		  barColor: '#FFAE1A', // setpoint
		  textColor: '#d59116', // setpoint
		  startAngle:hasLabel?-120:-150,
		  endAngle:  hasLabel? 120: 150,
		  scale: {
			enabled: true,
			type: 'lines',
			width: 4,
			spaceWidth:8,
			quantity: 31
		  },
	  	  unit: "°",
                  dynamicOptions: true,
		  label: {
			  enabled: hasLabel,
			  text: hasLabel?$scope.config.label:"",
			  color:"#e0e0e0",
			  fontSize:"auto"
		  },
		  onEnd: function () {
			if( hasConfig ) {
				OHService.sendCmd($scope.config.setpoint,$scope.value.toString());
			}else{
				console.log("value changed to "+$scope.value);
			}
		  }
                };
	if( hasConfig ) {
	//
	// item tracking... here we track current/setpoint/heating
	//
	OHService.onUpdate($scope, $scope.config.current, function () {
		var item = OHService.getItem($scope.config.current);
		if (item) {
			$scope.current = parseFloat(item.state);
			//console.log("Update! item "+$scope.config.current+" has changed to "+$scope.current);
		}
	});

	OHService.onUpdate($scope, $scope.config.setpoint, function () {
		var item = OHService.getItem($scope.config.setpoint);
		if (item) {
			$scope.value = parseFloat(item.state);
			//console.log("Update! item "+$scope.config.setpoint+" has changed to "+$scope.value);
		}
	});

	OHService.onUpdate($scope, $scope.config.heating, function () {
		var item = OHService.getItem($scope.config.heating);
		if (item) {
			$scope.heating = item.state;
			//console.log("Update! item "+$scope.config.heating+" has changed to "+$scope.heating);
		}
	});
	} // hasConfig

}



