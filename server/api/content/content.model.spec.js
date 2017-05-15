'use strict';

/* globals sinon, describe, expect, it */

var proxyquire = require('proxyquire').noPreserveCache();

var contentCtrlStub = {
  index: 'contentCtrl.index',
  show: 'contentCtrl.show',
  create: 'contentCtrl.create',
  upsert: 'contentCtrl.upsert',
  update: 'contentCtrl.update',
  destroy: 'contentCtrl.destroy'
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
var contentIndex = proxyquire('./index.js', {
  express: {
    Router() {
      return routerStub;
    }
  },
  './content.controller': contentCtrlStub,
  '../../auth/auth.service': authServiceStub
});

describe('Content API Router:', function() {
  it('should return an express router instance', function() {
    expect(contentIndex).to.equal(routerStub);
  });

  describe('GET /api/contents', function() {
    it('should route to content.controller.index', function() {
      expect(routerStub.get
        .withArgs('/', 'contentCtrl.index')
        ).to.have.been.calledOnce;
    });
  });

  describe('GET /api/contents/:id', function() {
    it('should route to content.controller.show', function() {
      expect(routerStub.get
        .withArgs('/:id', 'contentCtrl.show')
        ).to.have.been.calledOnce;
    });
  });

  describe('POST /api/contents', function() {
    it('should route to content.controller.create', function() {
      expect(routerStub.post
        .withArgs('/', 'authService.hasRole.admin', 'contentCtrl.create')
        ).to.have.been.calledOnce;
    });
  });

  describe('PUT /api/contents/:id', function() {
    it('should route to content.controller.update', function() {
      expect(routerStub.put
        .withArgs('/:id', 'authService.hasRole.admin', 'contentCtrl.update')
        ).to.have.been.calledOnce;
    });
  });

  describe('PATCH /api/contents/:id', function() {
    it('should route to content.controller.update', function() {
      expect(routerStub.patch
        .withArgs('/:id', 'authService.hasRole.admin', 'contentCtrl.update')
        ).to.have.been.calledOnce;
    });
  });

  describe('DELETE /api/contents/:id', function() {
    it('should route to content.controller.destroy', function() {
      expect(routerStub.delete
        .withArgs('/:id', 'authService.hasRole.admin', 'contentCtrl.destroy')
        ).to.have.been.calledOnce;
    });
  });
});
