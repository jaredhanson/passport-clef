var ClefStrategy = require('../lib/strategy')
  , chai = require('chai');


describe('ClefStrategy', function() {
  
  describe('constructed', function() {
    
    describe('with normal options', function() {
      var strategy = new ClefStrategy({
          appID: 'ABC123',
          appSecret: 'secret'
        }, function() {});
    
      it('should be named oauth2', function() {
        expect(strategy.name).to.equal('clef');
      });
    }); // with normal options
    
    describe('without a verify callback', function() {
      it('should throw', function() {
        expect(function() {
          new ClefStrategy({
            clientID: 'ABC123',
            clientSecret: 'secret'
          });
        }).to.throw(TypeError, 'ClefStrategy requires a verify callback');
      });
    }); // without a verify callback
    
    describe('without an appID option', function() {
      it('should throw', function() {
        expect(function() {
          new ClefStrategy({
            clientSecret: 'secret'
          }, function() {});
        }).to.throw(TypeError, 'ClefStrategy requires an appID option');
      });
    }); // without an appID option
    
    describe('without an appSecret option', function() {
      it('should throw', function() {
        expect(function() {
          new ClefStrategy({
            appID: 'ABC123'
          }, function() {});
        }).to.throw(TypeError, 'ClefStrategy requires an appSecret option');
      });
    }); // without an appID option
    
  }); // constructed
  
});
