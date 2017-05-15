'use strict';

describe('Component: LotComponent', function() {
  // load the controller's module
  beforeEach(module('rlmsApp'));

  var LotComponent;

  // Initialize the controller and a mock scope
  beforeEach(inject(function($componentController) {
    LotComponent = $componentController('lot', {});
  }));

  it('should ...', function() {
    expect(1).to.equal(1);
  });
});
