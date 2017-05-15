'use strict';

describe('Component: CategoryComponent', function() {
  // load the controller's module
  beforeEach(module('rlmsApp'));

  var CategoryComponent;

  // Initialize the controller and a mock scope
  beforeEach(inject(function($componentController) {
    CategoryComponent = $componentController('category', {});
  }));

  it('should ...', function() {
    expect(1).to.equal(1);
  });
});
