'use strict';

angular.module('dropOff.version', [
  'dropOff.version.interpolate-filter',
  'dropOff.version.version-directive'
])

.value('version', '0.1');
