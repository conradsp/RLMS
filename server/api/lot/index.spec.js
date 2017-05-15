'use strict';

/* globals sinon, describe, expect, it */

var proxyquire = require('proxyquire').noPreserveCache();

var lotCtrlStub = {
  index: 'lotCtrl.index',
  show: 'lotCtrl.show',
  create: 'lotCtrl.create',
  upsert: 'lotCtrl.upsert',
  update: 'lotCtrl.update',
  destroy: 'lotCtrl.destroy'
};

var routerStub = {
  get: sinon.spy(),
  put: sinon.spy(),
  patch: sinon.spy(),
  post: sinon.spy(),
  delete: sinon.spy()
};

var authServiceStub = {
  isAuthenticated() {
    return 'authService.isAuthenticated';
  },
  hasRole(role) {
    return `authService.hasRole.${role}`;
  }
};

// require the index with our stubbed out modules
var lotIndex = proxyquire('./index.js', {
  express: {
    Router() {
      return routerStub;
    }
  },
  './lot.controller': lotCtrlStub,
  '../../auth/auth.service': authServiceStub
});


describe('Lot API Router:', function() {
  it('should return an express router instance', function() {
    expect(lotIndex).to.equal(routerStub);
  });

  describe('GET /api/lots', function() {
    it('should route to lot.controller.index', function() {
      expect(routerStub.get
        .withArgs('/', 'lotCtrl.index')
        ).to.have.been.calledOnce;
    });
  });

  describe('GET /api/lots/id/:id', function() {
    it('should route to lot.controller.show', function() {
      expect(routerStub.get
        .withArgs('/:id', 'lotCtrl.show')
        ).to.have.been.calledOnce;
    });
  });

  describe('POST /api/lots', function() {
    it('should route to lot.controller.create', function() {
      expect(routerStub.post
        .withArgs('/', 'authService.hasRole.admin', 'lotCtrl.create')
        ).to.have.been.calledOnce;
    });
  });

  describe('PUT /api/lots/:id', function() {
    it('should route to lot.controller.update', function() {
      expect(routerStub.put
        .withArgs('/:id', 'authService.hasRole.admin', 'lotCtrl.update')
        ).to.have.been.calledOnce;
    });
  });

  describe('PATCH /api/lots/:id', function() {
    it('should route to lot.controller.update', function() {
      expect(routerStub.patch
        .withArgs('/:id', 'authService.hasRole.admin', 'lotCtrl.update')
        ).to.have.been.calledOnce;
    });
  });

  describe('DELETE /api/lots/:id', function() {
    it('should route to lot.controller.destroy', function() {
      expect(routerStub.delete
        .withArgs('/:id', 'authService.hasRole.admin', 'lotCtrl.destroy')
        ).to.have.been.calledOnce;
    });
  });
});
