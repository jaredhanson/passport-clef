// Load modules.
var passport = require('passport-strategy')
  , util = require('util')
  , clef = require('clef');


function ClefStrategy(options, verify) {
  if (typeof options == 'function') {
    verify = options;
    options = undefined;
  }
  options = options || {};

  if (!verify) { throw new TypeError('ClefStrategy requires a verify callback'); }
  if (!options.appID) { throw new TypeError('ClefStrategy requires an appID option'); }
  if (!options.appSecret) { throw new TypeError('ClefStrategy requires an appSecret option'); }

  passport.Strategy.call(this);
  this.name = 'clef';
  this._verify = verify;
  
  this._clef = clef.initialize({ appID: options.appID, appSecret: options.appSecret });
}

// Inherit from `passport.Strategy`.
util.inherits(ClefStrategy, passport.Strategy);

/**
 * Authenticate request by delegating to a service provider using OAuth 2.0.
 *
 * @param {Object} req
 * @api protected
 */
ClefStrategy.prototype.authenticate = function(req, options) {
  options = options || {};
  var self = this;
  
  if (req.query && req.query.code) {
    self._clef.getLoginInformation({ code: req.query.code }, function(err, userInformation) {
      if (err) { return self.error(err) }
      
      var profile = {};
      profile.id = String(userInformation.id);
      if (userInformation.last_name) {
        profile.name = profile.name || {};
        profile.name.familyName = userInformation.last_name;
      }
      if (userInformation.first_name) {
        profile.name = profile.name || {};
        profile.name.givenName = userInformation.first_name;
      }
      
      if (userInformation.email) {
        profile.emails = [{ value: userInformation.email }];
      }
      if (userInformation.phone_number) {
        profile.phoneNumbers = [{ value: userInformation.phone_number }];
      }
      
      function verified(err, user, info) {
        if (err) { return self.error(err); }
        if (!user) { return self.fail(info); }
        
        info = info || {};
        //if (state) { info.state = state; }
        self.success(user, info);
      }
      
      self._verify(profile, verified);
    });
  }
};


// Expose constructor.
module.exports = ClefStrategy;
