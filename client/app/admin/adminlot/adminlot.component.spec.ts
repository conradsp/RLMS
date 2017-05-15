'use strict';

describe('Component: AdminlotComponent', function() {
  // load the controller's module
  beforeEach(module('rlmsApp.admin'));

  var AdminlotComponent;

  // Initialize the controller and a mock scope
  beforeEach(inject(function($componentController) {
    AdminlotComponent = $componentController('adminlot', {});
  }));

  it('should ...', function() {
    expect(1).to.equal(1);
  });
});
