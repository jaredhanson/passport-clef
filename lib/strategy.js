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

  if (!verify) { throw new TypeError('OAuth2Strategy requires a verify callback'); }
  if (!options.appID) { throw new TypeError('OAuth2Strategy requires an appID option'); }
  if (!options.appSecret) { throw new TypeError('OAuth2Strategy requires an appSecret option'); }

  passport.Strategy.call(this);
  this.name = 'clef';
  this._verify = verify;
  
  this._clef = new OAuth2(options.clientID,  options.clientSecret,
      '', options.authorizationURL, options.tokenURL, options.customHeaders);
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
  
  console.log('AUTHENTICATE CLEF!!!');
  console.log(req.query);
  console.log(req.options);
};


// Expose constructor.
module.exports = ClefStrategy;
