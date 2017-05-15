'use strict';

describe('Component: AdminuserlistComponent', function() {
  // load the controller's module
  beforeEach(module('rlmsApp.admin'));

  var AdminuserlistComponent;

  // Initialize the controller and a mock scope
  beforeEach(inject(function($componentController) {
    AdminuserlistComponent = $componentController('adminuserlist', {});
  }));

  it('should ...', function() {
    expect(1).to.equal(1);
  });
});
