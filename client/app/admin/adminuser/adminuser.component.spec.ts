'use strict';

describe('Component: AdminuserComponent', function() {
  // load the controller's module
  beforeEach(module('rlmsApp.admin'));

  var AdminuserComponent;

  // Initialize the controller and a mock scope
  beforeEach(inject(function($componentController) {
    AdminuserComponent = $componentController('adminuser', {});
  }));

  it('should ...', function() {
    expect(1).to.equal(1);
  });
});
