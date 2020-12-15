//
// Adapted by Sébastien Roy
// from RadMie original ng-knob ( https://github.com/RadMie/ng-knob/ )
//
// MIT Licence
//

'use strict';

(function(){

  var ui = {};
  /**
   *   Constructor
   */
  var Knob = function(element, value, options, current, heating) {
    this.element = element;
    this.value = value;
    this.options = options;
    this.current=current;
    this.heating=heating;
    this.inDrag = false;
  };
  /**
   *   Convert from value to radians
   */
  Knob.prototype.valueToRadians = function(value, valueEnd, angleEnd, angleStart, valueStart) {
    valueEnd = valueEnd || 100;
    valueStart = valueStart || 0;
    angleEnd = angleEnd || 360;
    angleStart = angleStart || 0;
    return (Math.PI/180) * ((((value - valueStart) * (angleEnd - angleStart)) / (valueEnd - valueStart)) + angleStart);
  };
  /**
   *   Convert from radians to value
   */
  Knob.prototype.radiansToValue = function(radians, valueEnd, valueStart, angleEnd, angleStart) {
    valueEnd = valueEnd || 100;
    valueStart = valueStart || 0;
    angleEnd = angleEnd || 360;
    angleStart = angleStart || 0;
    return ((((((180/Math.PI) * radians) - angleStart) * (valueEnd - valueStart)) / (angleEnd - angleStart)) + valueStart);
  };
  /**
   *   Create the arc
   */
  Knob.prototype.createArc = function(innerRadius, outerRadius, startAngle, endAngle, cornerRadius) {
    var arc = d3.svg.arc()
    .innerRadius(innerRadius)
    .outerRadius(outerRadius)
    .startAngle(startAngle)
    .endAngle(endAngle)
    .cornerRadius(cornerRadius);
    return arc;
  };
  /**
   *   Draw the arc
   */
  Knob.prototype.drawArc = function(svg, arc, label, style, click, drag) {
    var elem = svg.append('path')
    .attr('id', label)
    .attr('d', arc)
    .style(style)
    .attr('transform', 'translate(' + (300/2) + ', ' + (300/2) + ')');

    if(this.options.readOnly === false) {
      if (click) {
        elem.on('click', click);
      }
      if (drag) {
        elem.call(drag);
      }
    }
    return elem;
  };
  /**
   *   Create the arcs
   */
  Knob.prototype.createArcs = function() {
    var outerRadius = parseInt((300/2), 10),
    startAngle = this.valueToRadians(this.options.startAngle, 360),
    endAngle = this.valueToRadians(this.options.endAngle, 360);


    if(this.options.scale.enabled) {
      outerRadius -= this.options.scale.width + this.options.scale.spaceWidth;
    }
    var trackInnerRadius = outerRadius - this.options.trackWidth,
    changeInnerRadius = outerRadius - this.options.barWidth,
    valueInnerRadius = outerRadius - this.options.barWidth,
    //interactInnerRadius = outerRadius - this.options.barWidth,
    interactInnerRadius = 1,

    trackOuterRadius = outerRadius,
    changeOuterRadius = outerRadius,
    valueOuterRadius = outerRadius,
    interactOuterRadius = outerRadius,
    diff;

    if(this.options.barWidth > this.options.trackWidth) {
      diff = (this.options.barWidth - this.options.trackWidth) / 2;
      trackInnerRadius -= diff;
      trackOuterRadius -= diff;
    } else if(this.options.barWidth < this.options.trackWidth) {
      diff = (this.options.trackWidth - this.options.barWidth) / 2;
      changeOuterRadius -= diff;
      valueOuterRadius -= diff;
      changeInnerRadius -= diff;
      valueInnerRadius -= diff;
      //interactInnerRadius = outerRadius - this.options.trackWidth;
    }
    if(this.options.bgColor) {
		if(this.options.bgFull){
			this.bgArc = this.createArc(0, outerRadius, 0, Math.PI*2);
		}
		else{
			this.bgArc = this.createArc(0, outerRadius, startAngle, endAngle);
		}
    }
    if(this.options.skin.type === 'tron') {
      trackOuterRadius = trackOuterRadius - this.options.skin.width - this.options.skin.spaceWidth;
      changeOuterRadius = changeOuterRadius - this.options.skin.width - this.options.skin.spaceWidth;
      valueOuterRadius = valueOuterRadius - this.options.skin.width - this.options.skin.spaceWidth;
      interactOuterRadius = interactOuterRadius - this.options.skin.width - this.options.skin.spaceWidth;
	    // ici ca change...
	//var startAngleHoop = this.valueToRadians(this.options.skin.startAngle, 360);
	//var endAngleHoop = this.valueToRadians(this.options.skin.endAngle, 360);
	var startAngleHoop = this.valueToRadians(this.options.startAngle, 360);
        var endAngleHoop = this.valueToRadians(this.current, this.options.max, this.options.endAngle, this.options.startAngle, this.options.min);

      this.hoopArc = this.createArc(outerRadius - this.options.skin.width, outerRadius, startAngleHoop, endAngleHoop);
      this.trackArc = this.createArc(trackInnerRadius, trackOuterRadius, startAngle, endAngle, this.options.trackCap);
    }else{
	    var endAngleTrack = this.valueToRadians(this.current, this.options.max, this.options.endAngle, this.options.startAngle, this.options.min);
	    this.trackArc = this.createArc(trackInnerRadius, trackOuterRadius, startAngle, endAngleTrack, this.options.trackCap);
	    this.trackArcFull = this.createArc(trackInnerRadius, trackOuterRadius, startAngle, endAngle, this.options.trackCap);
    }


    this.changeArc = this.createArc(changeInnerRadius, changeOuterRadius, startAngle, startAngle, this.options.barCap);
    this.valueArc = this.createArc(valueInnerRadius, valueOuterRadius, startAngle, startAngle, this.options.barCap);
    this.interactArc = this.createArc(interactInnerRadius, interactOuterRadius, startAngle, endAngle);
  };
  /**
   *   Draw the arcs
   */
  Knob.prototype.drawArcs = function(clickInteraction, dragBehavior) {
    var svg = d3.select(this.element)
    .append('svg')
    //.attr("width", this.options.size)
    //.attr("height", this.options.size);
    .attr("preserveAspectRatio", "xMinYMin meet")
    .attr("viewBox", "0 0 300 300")
    .classed("svg-content", true);

    if(this.options.bgColor) {
      this.drawArc(svg, this.bgArc, 'bgArc', { "fill": this.options.bgColor });
    }
    if(this.options.label.enabled) {
      var fontSize = 32;
      if(this.options.label.fontSize !== 'auto') { fontSize = parseInt(this.options.label.fontSize); }
      svg.append('text')
      .attr('id', 'label')
      .attr("text-anchor", "middle")
      .attr("font-size", fontSize+"px")
      .style("fill", this.options.label.color)
      .text(this.options.label.text)
      .attr('transform', 'translate(' + (300/2) + ', ' + ((300/2) + (110)+fontSize/2) + ')');
    }

    if(this.options.displayInput) {
      var fontSize = 72;
      if(this.options.fontSize !== 'auto') { fontSize = parseInt(this.options.fontSize); }
      if(this.options.step < 1) {
        this.value = parseFloat(this.value).toFixed(1);
      }
      var v = this.value;
      if (typeof this.options.inputFormatter === "function"){
          v = this.options.inputFormatter(v);
      }
      svg.append('text')
      .attr('id', 'text')
      .attr("text-anchor", "middle")
      .attr("font-size", fontSize+"px")
      .style("fill", this.options.textColor)
      .text(v + this.options.unit || "")
      .attr('transform', 'translate(' + (300/2) + ', ' + ((300/2)+0 ) + ')');

      if(this.options.subText.enabled) {
        fontSize = 40;
        if(this.options.subText.font !== 'auto') {
          fontSize = parseInt(this.options.subText.font);
        }
        svg.append('text')
        .attr('class', 'sub-text')
        .attr("text-anchor", "middle")
        .attr("font-size", fontSize+"px")
        .style("fill", this.options.subText.color)
        //.text(this.options.subText.text)
        .text(this.current+this.options.unit || "")
        .attr('transform', 'translate(' + (300/2) + ', ' + ((300/2) + fontSize) + ')');
      }
    }
    if(this.options.scale.enabled) {
      var radius, quantity, count = 0, angle = 0, data,
      startRadians = this.valueToRadians(this.options.min, this.options.max, this.options.endAngle, this.options.startAngle, this.options.min),
      endRadians = this.valueToRadians(this.options.max, this.options.max, this.options.endAngle, this.options.startAngle, this.options.min),
      diff = 0;
      if(this.options.startAngle !== 0 || this.options.endAngle !== 360) {
        diff = 1;
      }
	var heatColor=(this.heating==1)? this.options.scale.colorH:this.options.scale.color;
      if(this.options.scale.type === 'dots') {
        var width = this.options.scale.width;
        radius = (300/2) - width;
        quantity = this.options.scale.quantity;
        var offset = radius + this.options.scale.width;
        data = d3.range(quantity).map(function () {
          angle = (count * (endRadians - startRadians)) - (Math.PI / 2) + startRadians;
          count = count + (1 / (quantity-diff));
          return {
            cx: offset + Math.cos(angle) * radius,
            cy: offset + Math.sin(angle) * radius,
            r: width
          };
        });
        svg.selectAll("circle")
        .data(data)
        .enter().append("circle")
        .attr({
          r: function (d) {
              return d.r;
          },
          cx: function (d) {
              return d.cx;
          },
          cy: function (d) {
              return d.cy;
          },
          fill: heatColor//this.options.scale.color
        });
      } else if (this.options.scale.type === 'lines') {
        var height = this.options.scale.height;
        radius = (300/2);
        quantity = this.options.scale.quantity;
        data = d3.range(quantity).map(function () {
          angle = (count * (endRadians - startRadians)) - (Math.PI / 2) + startRadians;
          count = count + (1 / (quantity-diff));
          return {
            x1: radius + Math.cos(angle) * radius,
            y1: radius + Math.sin(angle) * radius,
            x2: radius + Math.cos(angle) * (radius - height),
            y2: radius + Math.sin(angle) * (radius - height)
          };
        });
        svg.selectAll("line")
        .data(data)
        .enter().append("line")
        .attr({
          x1: function (d) {
              return d.x1;
          },
          y1: function (d) {
              return d.y1;
          },
          x2: function (d) {
              return d.x2;
          },
          y2: function (d) {
              return d.y2;
          },
          "stroke-width": this.options.scale.width,
          "stroke": heatColor
        });
      }
    }
    if(this.options.skin.type === 'tron') {
      this.drawArc(svg, this.hoopArc, 'hoopArc', { "fill": this.options.skin.color });
    }else{
	    this.drawArc(svg, this.trackArcFull, 'trackArcFull', { "fill": this.options.trackColorFull });
    }
    this.drawArc(svg, this.trackArc, 'trackArc', { "fill": this.options.trackColor });
    if(this.options.displayPrevious) {
      this.changeElem = this.drawArc(svg, this.changeArc, 'changeArc', { "fill": this.options.prevBarColor });
    } else {
      this.changeElem = this.drawArc(svg, this.changeArc, 'changeArc', { "fill-opacity": 0 });
    }
    this.valueElem = this.drawArc(svg, this.valueArc, 'valueArc', { "fill": this.options.barColor });
    var cursor = "pointer";
    if(this.options.readOnly) {
      cursor = "default";
    }
    this.drawArc(svg, this.interactArc, 'interactArc', { "fill-opacity": 0, "cursor": cursor }, clickInteraction, dragBehavior);
  };
  /**
   *   Draw knob component
   */
  Knob.prototype.draw = function(update) {
    d3.select(this.element).select("svg").remove();
    var that = this;

    that.createArcs();

    var dragBehavior = d3.behavior.drag()
    .on('drag', dragInteraction)
    .on('dragend', clickInteraction);

    that.drawArcs(clickInteraction, dragBehavior);

    if(that.options.animate.enabled) {
      that.valueElem.transition().ease(that.options.animate.ease).duration(that.options.animate.duration).tween('',function() {
        var i = d3.interpolate(that.valueToRadians(that.options.startAngle, 360), that.valueToRadians(that.value, that.options.max, that.options.endAngle, that.options.startAngle, that.options.min));
        return function(t) {
          var val = i(t);
          that.valueElem.attr('d', that.valueArc.endAngle(val));
          that.changeElem.attr('d', that.changeArc.endAngle(val));
        };
      });
    } else {
      that.changeArc.endAngle(this.valueToRadians(this.value, this.options.max, this.options.endAngle, this.options.startAngle, this.options.min));
      that.changeElem.attr('d', that.changeArc);
      that.valueArc.endAngle(this.valueToRadians(this.value, this.options.max, this.options.endAngle, this.options.startAngle, this.options.min));
      that.valueElem.attr('d', that.valueArc);
    }

    function dragInteraction() {
      that.inDrag = true;
      var x = d3.event.x - (300/2);
      var y = d3.event.y - (300/2);
      interaction(x,y, false);
    }

    function clickInteraction() {
      that.inDrag = false;
      var coords = d3.mouse(this.parentNode);
      var x = coords[0] - (300/2);
      var y = coords[1] - (300/2);
      interaction(x,y, true);
    }

    function interaction(x,y, isFinal) {
      var arc = Math.atan(y/x)/(Math.PI/180), radians, delta;

      if ((x >= 0 && y <= 0) || (x >= 0 && y >= 0)) {
        delta = 90;
      } else {
        delta = 270;
        if(that.options.startAngle < 0) {
          delta = -90;
        }
      }

      radians = (delta + arc) * (Math.PI/180);
      that.value = that.radiansToValue(radians, that.options.max, that.options.min, that.options.endAngle, that.options.startAngle);
      if(that.value >= that.options.min && that.value <= that.options.max) {
        that.value = Math.round(((~~ (((that.value < 0) ? -0.5 : 0.5) + (that.value/that.options.step))) * that.options.step) * 100) / 100;
        if(that.options.step < 1) {
          that.value = parseFloat(that.value.toFixed(1));
        }
        update(that.value);
        that.valueArc.endAngle(that.valueToRadians(that.value, that.options.max, that.options.endAngle, that.options.startAngle, that.options.min));
        that.valueElem.attr('d', that.valueArc);
        if (isFinal) {
          that.changeArc.endAngle(that.valueToRadians(that.value, that.options.max, that.options.endAngle, that.options.startAngle, that.options.min));
          that.changeElem.attr('d', that.changeArc);
        }
        if(that.options.displayInput) {
          var v = that.value;
          if (typeof that.options.inputFormatter === "function"){
            v = that.options.inputFormatter(v);
          }
          d3.select(that.element).select('#text').text(v + that.options.unit || "");
        }
        if(isFinal) {
	    if( that.options.onEnd ) { that.options.onEnd(); }
	}
      }
    }
  };
  /**
   *   Set a value
   */
  Knob.prototype.setValue = function(newValue) {
    if ((!this.inDrag) && this.value >= this.options.min && this.value <= this.options.max) {
      var radians = this.valueToRadians(newValue, this.options.max, this.options.endAngle, this.options.startAngle, this.options.min);
      this.value = Math.round(((~~ (((newValue < 0) ? -0.5 : 0.5) + (newValue/this.options.step))) * this.options.step) * 100) / 100;
      if(this.options.step < 1) {
        this.value = parseFloat(this.value.toFixed(1));
      }
      this.changeArc.endAngle(radians);
      d3.select(this.element).select('#changeArc').attr('d', this.changeArc);
      this.valueArc.endAngle(radians);
      d3.select(this.element).select('#valueArc').attr('d', this.valueArc);
      if(this.options.displayInput) {
        var v = this.value;
        if (typeof this.options.inputFormatter === "function"){
          v = this.options.inputFormatter(v);
        }
        d3.select(this.element).select('#text').text(v + this.options.unit || "");
      }
    }
  };
  Knob.prototype.setCurrent = function(v) {
	  this.current=parseFloat(v);
  }
  Knob.prototype.setHeating = function(v) {
	  if( v=='ON' || parseInt(v)==1 ) this.heating=1; else this.heating=0;
  }

  ui.Knob = Knob;
  /**
   *   Angular knob directive
   */
  ui.knobDirective = function() {
    return  {
      restrict: 'E',
      scope: {
        value: '=', // actually the setpoint
        options: '=',
        current: '=',
        heating: '='
      },
      link: function (scope, element) {
	// to manage widget size, track parent size
	//var elParent=element[0].parentElement;
	//var size=Math.min(elParent.clientWidth,elParent.clientHeight); // not used!!!

	scope.current=scope.current || 14;
        scope.value = scope.value || 14;
        var defaultOptions = {
          skin: {
            type: 'simple',
            width: 10,
            color: 'rgba(255,0,0,.5)',
            spaceWidth: 5
          },
	  animate: { enabled: false },
          startAngle: -150,
          endAngle: 150,
          unit: "",
          displayInput: true,
          inputFormatter: function(v){ return v; },
          readOnly: false,
          trackWidth: 50,
          barWidth: 50,
          trackColor: "#000000",
          trackColorFull: "#00000040",
          barColor: "rgba(255,0,0,.5)",
          prevBarColor: "rgba(0,0,0,0)",
          textColor: '#222',
          barCap: 0,
		  trackCap: 0,
          fontSize: 'auto',
          subText: {
            enabled: false,
            text: "",
            color: "gray",
            font: "auto"
          },
          bgColor: '',
		  bgFull: false,
	  label:{
	    enabled: false,
	    text:"Label here",
	    color:"#f0f0f0",
	    fontSize: "auto"
	  },
          scale: {
            enabled: false,
            type: 'lines',
            color: '#919191',
            colorH: '#ff4040',
            width: 4,
            quantity: 40,
            height: 10,
            spaceWidth: 8
          },
          step: 1,
          displayPrevious: false,
          min: 5,
          max: 35,
          dynamicOptions: false
				};
        scope.options = angular.merge(defaultOptions, scope.options);
        var knob = new ui.Knob(element[0], scope.value, scope.options,scope.current,scope.heating);

        scope.$watch('value', function(newValue, oldValue) {
          if((newValue !== null || typeof newValue !== 'undefined') && typeof oldValue !== 'undefined' && newValue !== oldValue) {
            knob.setValue(newValue);
          }
        });

        scope.$watch('heating', function(newValue, oldValue) {
          if( newValue!== 'undefined' && newValue !== oldValue) {
		  //console.log("control heating is now "+newValue+" type "+(typeof newValue));
		  knob.setHeating(newValue);
                  drawKnob();
          }
        });


        scope.$watch('current', function(newValue, oldValue) {
          if( newValue!== 'undefined' && newValue !== oldValue) {
		  //console.log("control current is now "+newValue+" type "+(typeof newValue)+" scope "+scope.current);
		  knob.setCurrent(newValue);
                  drawKnob();
          }
        });

	      /***
	scope.$watchGroup([
		function() { return elParent.clientWidth; },
		function() { return elParent.clientHeight; }
	], function (values) {
		var size = Math.min(elParent.clientWidth, elParent.clientHeight);
		if( size>0 ) {
			//scope.options.size=size
			console.log("new size is "+size);
		        drawKnob();
		}
	});
	***/


        if(scope.options.dynamicOptions) {
          var isFirstWatchOnOptions = true;
          scope.$watch('options', function() {
              if (isFirstWatchOnOptions) {
                isFirstWatchOnOptions = false;
              } else {
                var newOptions = angular.merge(defaultOptions, scope.options);
                knob = new ui.Knob(element[0], scope.value, newOptions,scope.current,scope.heating);
                drawKnob();
              }
          }, true);
        }

        var drawKnob = function(){
          knob.draw(function(value) {
            scope.$apply(function() { scope.value = value; });
          });
        };

        drawKnob();

      }
    };
  };

  angular.module('ui.knobthermo', []).directive('uiKnobThermo', ui.knobDirective);
})();

