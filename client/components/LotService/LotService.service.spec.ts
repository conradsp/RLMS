'use strict';

describe('Service: LotService', function() {
  // load the service's module
  beforeEach(module('rlmsApp'));

  // instantiate service
  var LotService;
  beforeEach(inject(function(_LotService_) {
    LotService = _LotService_;
  }));

  it('should do something', function() {
    expect(!!LotService).to.be.true;
  });
});
