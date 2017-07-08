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
  
  
  describe('processing response to authentication request', function() {
    
    describe('that was approved without redirect URI', function() {
      var strategy = new ClefStrategy({
        appID: 'ABC123',
        appSecret: 'secret'
      }, function(profile, done) {
        if (typeof profile !== 'object') { return done(new Error('incorrect profile argument')); }
        if (Object.keys(profile).length !== 4) { return done(new Error('incorrect profile argument')); }
        if (profile.name.givenName !== 'John') { return done(new Error('incorrect profile argument')); }
        if (profile.name.familyName !== 'Doe') { return done(new Error('incorrect profile argument')); }
        if (profile.emails[0].value !== 'johndoe@example.com') { return done(new Error('incorrect profile argument')); }
        if (profile.phoneNumbers[0].value !== '+14445551234') { return done(new Error('incorrect profile argument')); }
        
        return done(null, { id: '1234' }, { message: 'Hello' });
      });
      
      strategy._clef.getLoginInformation = function(opts, callback) {
        if (opts.code !== 'SplxlOBeZQQYbYS6WxSbIA') { return callback(new Error('incorrect code argument')); }
        
        var userInformation = {
          email: 'johndoe@example.com',
          first_name: 'John',
          id: 1111111111,
          last_name: 'Doe',
          phone_number: '+14445551234'
        }
        return callback(null, userInformation);
      }
      
      var user
        , info;

      before(function(done) {
        chai.passport.use(strategy)
          .success(function(u, i) {
            user = u;
            info = i;
            done();
          })
          .req(function(req) {
            req.query = {};
            req.query.code = 'SplxlOBeZQQYbYS6WxSbIA';
          })
          .authenticate();
      });

      it('should supply user', function() {
        expect(user).to.be.an.object;
        expect(user.id).to.equal('1234');
      });
    });
    
  });
  
}); // ClefStrategy
