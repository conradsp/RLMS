'use strict';

describe('Component: AdminotherComponent', function() {
  // load the controller's module
  beforeEach(module('rlmsApp.admin'));

  var AdminotherComponent;

  // Initialize the controller and a mock scope
  beforeEach(inject(function($componentController) {
    AdminotherComponent = $componentController('adminother', {});
  }));

  it('should ...', function() {
    expect(1).to.equal(1);
  });
});
