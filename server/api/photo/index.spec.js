'use strict';

/* globals sinon, describe, expect, it */

var proxyquire = require('proxyquire').noPreserveCache();

var photoCtrlStub = {
  index: 'photoCtrl.index',
  show: 'photoCtrl.show',
  create: 'photoCtrl.create',
  upsert: 'photoCtrl.upsert',
  patch: 'photoCtrl.patch',
  destroy: 'photoCtrl.destroy'
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
var photoIndex = proxyquire('./index.js', {
  express: {
    Router() {
      return routerStub;
    }
  },
  './photo.controller': photoCtrlStub,
  '../../auth/auth.service': authServiceStub
});

describe('Photo API Router:', function() {
  it('should return an express router instance', function() {
    expect(photoIndex).to.equal(routerStub);
  });

  describe('GET /api/photos/:id', function() {
    it('should route to photo.controller.show', function() {
      expect(routerStub.get
        .withArgs('/:id', 'photoCtrl.show')
        ).to.have.been.calledOnce;
    });
  });

  describe('POST /api/photos', function() {
    it('should route to photo.controller.create', function() {
      expect(routerStub.post
        .withArgs('/', 'photoCtrl.create')
        ).to.have.been.calledOnce;
    });
  });

  describe('DELETE /api/photos/:id', function() {
    it('should route to photo.controller.destroy', function() {
      expect(routerStub.delete
        .withArgs('/:id', 'photoCtrl.destroy')
        ).to.have.been.calledOnce;
    });
  });
});
