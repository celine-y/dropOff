'use strict';

describe('dropOff.version module', function() {
  beforeEach(module('dropOff.version'));

  describe('version service', function() {
    it('should return current version', inject(function(version) {
      expect(version).toEqual('0.1');
    }));
  });
});
