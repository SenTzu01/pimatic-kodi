// Generated by CoffeeScript 1.9.1
var bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

module.exports = function(env) {
  var KodiPlayer, KodiPlugin, Promise, TCPConnection, XbmcApi, assert, kodiPlugin, ref;
  Promise = env.require('bluebird');
  assert = env.require('cassert');
  ref = require('xbmc'), TCPConnection = ref.TCPConnection, XbmcApi = ref.XbmcApi;
  KodiPlugin = (function(superClass) {
    extend(KodiPlugin, superClass);

    function KodiPlugin() {
      this.init = bind(this.init, this);
      return KodiPlugin.__super__.constructor.apply(this, arguments);
    }

    KodiPlugin.prototype.init = function(app, framework, config1) {
      var deviceConfigDef;
      this.framework = framework;
      this.config = config1;
      env.logger.info("Kodi plugin started");
      deviceConfigDef = require("./device-config-schema");
      return this.framework.deviceManager.registerDeviceClass("KodiPlayer", {
        configDef: deviceConfigDef.KodiPlayer,
        createCallback: (function(_this) {
          return function(config) {
            return new KodiPlayer(config);
          };
        })(this)
      });
    };

    return KodiPlugin;

  })(env.plugins.Plugin);
  KodiPlayer = (function(superClass) {
    extend(KodiPlayer, superClass);

    KodiPlayer.prototype._state = null;

    KodiPlayer.prototype._currentTitle = null;

    KodiPlayer.prototype._currentArtist = null;

    KodiPlayer.prototype._volume = null;

    KodiPlayer.prototype.connection = null;

    KodiPlayer.prototype.actions = {
      play: {
        description: "starts playing"
      },
      pause: {
        description: "pauses playing"
      },
      stop: {
        description: "stops playing"
      },
      next: {
        description: "play next song"
      },
      previous: {
        description: "play previous song"
      },
      volume: {
        description: "Change volume of player"
      }
    };

    KodiPlayer.prototype.attributes = {
      currentArtist: {
        description: "the current playing track artist",
        type: "string"
      },
      currentTitle: {
        description: "the current playing track title",
        type: "string"
      },
      state: {
        description: "the current state of the player",
        type: "string"
      },
      volume: {
        description: "the volume of the player",
        type: "string"
      }
    };

    KodiPlayer.prototype.template = "musicplayer";

    function KodiPlayer(config1) {
      var connection;
      this.config = config1;
      this.name = this.config.name;
      this.id = this.config.id;
      connection = new TCPConnection({
        host: this.config.host,
        port: this.config.port,
        verbose: true
      });
      this.kodi = new XbmcApi({
        debug: env.logger.debug
      });
      this.kodi.setConnection(connection);
      this.kodi.on('connection:open', function() {
        return env.logger.info('Kodi connected');
      });
      this.kodi.on('connection:close', function() {
        return env.logger.info('Kodi Disconnected');
      });
      this.kodi.on('connection:notification', function(notification) {
        return env.logger.debug('Received notification:', notification);
      });
      KodiPlayer.__super__.constructor.call(this);
    }

    KodiPlayer.prototype.getState = function() {
      return Promise.resolve(this._state);
    };

    KodiPlayer.prototype.getCurrentTitle = function() {
      return Promise.resolve(this._currentTitle);
    };

    KodiPlayer.prototype.getCurrentArtist = function() {
      return Promise.resolve(this._currentTitle);
    };

    KodiPlayer.prototype.getVolume = function() {
      return Promise.resolve(this._volume);
    };

    KodiPlayer.prototype.play = function() {
      return this._sendCommandAction('play');
    };

    KodiPlayer.prototype.pause = function() {
      return this._sendCommandAction('pause');
    };

    KodiPlayer.prototype.stop = function() {
      return this._sendCommandAction('stop');
    };

    KodiPlayer.prototype.previous = function() {
      return env.logger.debug('previous not implemented');
    };

    KodiPlayer.prototype.next = function() {
      return env.logger.debug('next not implemented');
    };

    KodiPlayer.prototype.setVolume = function(volume) {
      return env.logger.debug('setVolume not implemented');
    };

    KodiPlayer.prototype._updateInfo = function() {
      return Promise.all([this._getStatus(), this._getCurrentSong()]);
    };

    KodiPlayer.prototype._setState = function(state) {
      if (this._state !== state) {
        this._state = state;
        return this.emit('state', state);
      }
    };

    KodiPlayer.prototype._setCurrentTitle = function(title) {
      if (this._currentTitle !== title) {
        this._currentTitle = title;
        return this.emit('currentTitle', title);
      }
    };

    KodiPlayer.prototype._setCurrentArtist = function(artist) {
      if (this._currentArtist !== artist) {
        this._currentArtist = artist;
        return this.emit('currentArtist', artist);
      }
    };

    KodiPlayer.prototype._setVolume = function(volume) {
      if (this._volume !== volume) {
        this._volume = volume;
        return this.emit('volume', volume);
      }
    };

    KodiPlayer.prototype._getStatus = function() {
      return env.logger.debug('get status');
    };

    KodiPlayer.prototype._getCurrentSong = function() {
      return env.logger.debug('_getCurrentSong not implemented');
    };

    KodiPlayer.prototype._sendCommandAction = function(action) {
      return this.kodi.input.ExecuteAction(action);
    };

    return KodiPlayer;

  })(env.devices.Device);
  kodiPlugin = new KodiPlugin;
  return kodiPlugin;
};
