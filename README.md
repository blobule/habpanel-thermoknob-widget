# habpanel-thermoKnob-widget

Thermostat Knob for Habpanel (OpenHAB)
Allows adjusting setpoint temperature while viewing current room temperature and heating state.

## Features

The thermo-knob connects to 3 openhab items:
- temperature setpoint, which is adjustable
- Current temperature, displayed only
- Current heating state (0/1), displayed only

## History

- 2021-04-04 fixed double command issue #1

### Parameters

The widget can be configured in habpanel:
- An optional label can be added to the widget.
- The temperature scale is configurable (min, max, step).
- The color of the setpoint temperature can be changed.

Other parameters must be configured *manually* in file ``control-OH.js``:
- The *heating color* is from the *scale* settings *color* and *colorH*
- The font sizes, width, height, and other parameters are also available in the options definition.
- For reference, see the knob widget ( [ng-knob](https://github.com/RadMie/ng-knob) )


## Screenshot

![screenshot](img/thermo3.png)

![screenshot](img/thermo-habpanel.png)

## Settings

(sorry for the mixture of languages)

![settings](img/thermo-settings.png)

## Demo

A standalone demo is provided in [thermoKnob/index.html](thermoKnob/index.html)

## Installing

This widget relies on static files, which must be installed manually.
Simply copy the directory thermoKnob into the static html area of openhab.

For openraspbian, just do

`cp -r thermoKnob /etc/openhab2/html/`

If you install the file elsewhere, make sure you adjust the widget [thermo-knob.widget.json](thermo-knob.widget.json) file accordingly.

