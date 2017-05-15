'use strict';

describe('Component: AdminlotlistComponent', function() {
  // load the controller's module
  beforeEach(module('rlmsApp.admin'));

  var AdminlotlistComponent;

  // Initialize the controller and a mock scope
  beforeEach(inject(function($componentController) {
    AdminlotlistComponent = $componentController('adminlotlist', {});
  }));

  it('should ...', function() {
    expect(1).to.equal(1);
  });
});
