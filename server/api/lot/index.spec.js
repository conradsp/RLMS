'use strict';

/* globals sinon, describe, expect, it */

var proxyquire = require('proxyquire').noPreserveCache();

var lotCtrlStub = {
  create: 'lotCtrl.create',
  getBids: 'lotCtrl.getBids',
  update: 'lotCtrl.update',
  destroy: 'lotCtrl.destroy',
  lotsApproval: 'lotCtrl.lotsApproval',
  lotsClosing: 'lotCtrl.lotsClosing',
  lotsClosed: 'lotCtrl.lotsClosed',
  index: 'lotCtrl.index',
  show: 'lotCtrl.show',
  changestatus: 'lotCtrl.changestatus'
};

var routerStub = {
  get: sinon.spy(),
  put: sinon.spy(),
  patch: sinon.spy(),
  post: sinon.spy(),
  delete: sinon.spy()
};

// require the index with our stubbed out modules
var lotIndex = proxyquire('./index.js', {
  express: {
    Router() {
      return routerStub;
    }
  },
  './lot.controller': lotCtrlStub
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

  describe('GET /api/lots/approval', function() {
    it('should route to lot.controller.lotsApproval', function() {
      expect(routerStub.get
        .withArgs('/approval', 'lotCtrl.lotsApproval')
        ).to.have.been.calledOnce;
    });
  });

  describe('GET /api/lots/closing', function() {
    it('should route to lot.controller.lotsClosing', function() {
      expect(routerStub.get
        .withArgs('/closing', 'lotCtrl.lotsClosing')
        ).to.have.been.calledOnce;
    });
  });

  describe('GET /api/lots/closed', function() {
    it('should route to lot.controller.lotsClosed', function() {
      expect(routerStub.get
        .withArgs('/closed', 'lotCtrl.lotsClosed')
        ).to.have.been.calledOnce;
    });
  });

  describe('GET /api/lots/id/:id', function() {
    it('should route to lot.controller.show', function() {
      expect(routerStub.get
        .withArgs('/id/:id', 'lotCtrl.show')
        ).to.have.been.calledOnce;
    });
  });

  describe('GET /api/lots/:id/bid', function() {
    it('should route to lot.controller.getBids', function() {
      expect(routerStub.get
        .withArgs('/:id/bid', 'lotCtrl.getBids')
        ).to.have.been.calledOnce;
    });
  });

  describe('GET /api/lots/status/:id', function() {
    it('should route to lot.controller.changestatus', function() {
      expect(routerStub.post
        .withArgs('/status/:id', 'lotCtrl.changestatus')
        ).to.have.been.calledOnce;
    });
  });

  describe('POST /api/lots', function() {
    it('should route to lot.controller.create', function() {
      expect(routerStub.post
        .withArgs('/', 'lotCtrl.create')
        ).to.have.been.calledOnce;
    });
  });

  describe('PUT /api/lots/:id', function() {
    it('should route to lot.controller.update', function() {
      expect(routerStub.put
        .withArgs('/:id', 'lotCtrl.update')
        ).to.have.been.calledOnce;
    });
  });

  describe('PATCH /api/lots/:id', function() {
    it('should route to lot.controller.update', function() {
      expect(routerStub.patch
        .withArgs('/:id', 'lotCtrl.update')
        ).to.have.been.calledOnce;
    });
  });

  describe('DELETE /api/lots/id/:id', function() {
    it('should route to lot.controller.destroy', function() {
      expect(routerStub.delete
        .withArgs('/id/:id', 'lotCtrl.destroy')
        ).to.have.been.calledOnce;
    });
  });
});
