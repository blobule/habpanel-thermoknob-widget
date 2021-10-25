
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
	if( hasConfig ) { hasLabel=($scope.config.label!==""); }
	var leMin=hasConfig?parseFloat($scope.config.min):5;
	var leMax=hasConfig?parseFloat($scope.config.max):35;
	var leStep=hasConfig?parseFloat($scope.config.step):1;
	var readonly=hasConfig?($scope.config.readonly==true):false;
	/*
	if( hasConfig ) {
		console.log("Config is "+JSON.stringify(Object.keys($scope.config),null,4));
		console.log("  and label is "+$scope.config.label);
	}else console.log("Config is not available");
	*/
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
		  readOnly: readonly,
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
		  min: leMin,
		  max: leMax,
		  step: leStep,
		  prevBarColor: 'rgba(0,0,1,.2)',
		  displayPrevious: true,
		  barColor: hasConfig?$scope.config.barcolor:'#FFAE1A', // setpoint
		  textColor: hasConfig?$scope.config.barcolor:'#FFAE1A', // setpoint
		  startAngle:hasLabel?-120:-150,
		  endAngle:  hasLabel? 120: 150,
		  scale: {
			enabled: true,
			type: 'lines',
            		color: '#919191',  // not heating
			colorH: '#ff4040', // heating
			width: 4,
            		height: 10,
			spaceWidth:8,
			quantity: (leMax-leMin)/leStep+1   // one bar per step, from min to max
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
			} /*else{ console.log("value changed to "+$scope.value); } */
		  }
                };
	if( hasConfig ) {
		//
		// Update items functions...
		//
		var updateCurrent=function() {
			var item = OHService.getItem($scope.config.current);
			if (item) {
				$scope.current = parseFloat(item.state);
				//console.log("Update! item "+$scope.config.current+" has changed to "+$scope.current);
			}
		};
		var updateSetpoint=function () {
			var item = OHService.getItem($scope.config.setpoint);
			if (item) {
				$scope.value = parseFloat(item.state);
				//console.log("Update! item "+$scope.config.setpoint+" has changed to "+$scope.value);
			}
		};
		var updateHeating=function () {
			var item = OHService.getItem($scope.config.heating);
			if (item) {
				$scope.heating = item.state;
				//console.log("Update! item "+$scope.config.heating+" has changed to "+$scope.heating);
			}
		};
		//
		// Initial starting values... dont wait for update.
		//
		updateCurrent();
		updateSetpoint();
		updateHeating();
		//
		// item tracking... here we track current/setpoint/heating
		//
		OHService.onUpdate($scope, $scope.config.current, updateCurrent);
		OHService.onUpdate($scope, $scope.config.setpoint, updateSetpoint);
		OHService.onUpdate($scope, $scope.config.heating, updateHeating);
	} // hasConfig

}



