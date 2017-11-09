/**
 * config.service.js
 */
(function() {

    'use strict';

    angular
        .module('WebtroPie.config_service', [])
        .service('config', config);

    config.$inject = ['$http','$q','$httpParamSerializer'];
      
    function config($http, $q, $httpParamSerializer)
    {
        var self = this;

        // Config sections
        self.APP    = 1;   // this app config
        self.ENV    = 2;   // environmental info
        self.LANG   = 4;   // current language
        self.ES     = 8;   // emulationstation settings
        self.THEMES = 16;  // theme tweaks
        self.SYSTEMS = 32;
        self.THEMES_LIST = 64;  // theme tweaks
        self.ALL    = 255;

        self.load = load;
        self.init = init;
        self.save = save;

        function load(bitmask, lang, refresh)
        {
            var deferred = $q.defer();

            // fetch from server
            $http.get('svr/config.php', {cache: false, params: {get: bitmask, lang: lang}})
            .then(function onSuccess(response)
            {
                if (bitmask & self.APP)     self.app = response.data.app;
                if (bitmask & self.ENV)     self.env = response.data.env;
                if (bitmask & self.LANG)    self.lang = response.data.lang;
                if (bitmask & self.ES)      self.es = response.data.es;
                if (bitmask & self.THEMES)  self.themes = response.data.themes;
                if (bitmask & self.SYSTEMS) self.systems = response.data.systems;
                if (bitmask & self.THEMES_LIST) self.themes_list = response.data.themes_list;

                if (self.es.CollectionSystemsAuto)
                self.es.CollectionSystemsAuto
                .split(',')
                .forEach(function(system) {
                    if (system=='all')
                    {
                        self.systems['auto-allgames'] = {
                            name: 'auto-allgames',
                            fullname: 'all',
                            theme: 'auto-allgames',
                            has_games: true
                        }
                    }
                    if (system=='favorites')
                    {
                        self.systems['auto-favorites'] = {
                            name: 'auto-favorites',
                            fullname: 'favorites',
                            theme: 'auto-favorites',
                            has_games: true
                        }
                    }
                    if (system=='recent')
                    {
                        self.systems['auto-lastplayed'] = {
                            name: 'auto-lastplayed',
                            fullname: 'recent',
                            theme: 'auto-lastplayed',
                            has_games: true
                        }
                    }
                });
                if(self.es.CollectionSystemsCustom)
                self.es.CollectionSystemsCustom
                .split(',')
                .forEach(function(system) {
                    self.systems['custom-'+system] = {
                        name: 'custom-'+system,
                        fullname: system,
                        theme: 'custom-collections',
                        has_games: true
                    }
                });
                deferred.resolve(response);
            });

            if (bitmask == self.ALL)
            {
                self.promise = deferred.promise;
            }

            return deferred.promise;
        }

        // get either from memory or server
        function init(get, lang, refresh)
        {
            if (!get) get = self.ALL; // default: get everything
            if (self.promise && !refresh)  // already got settings
            {
                return self.promise;
            }
            return load(get, lang, refresh);
        }

        function save(setting, value, type, file)
        {
            $http({
                method  : 'POST',
                url     : 'svr/config_save.php',
                headers : { 'Content-Type': 'application/x-www-form-urlencoded' },
                data    : $httpParamSerializer({
                            update: 1,
                            setting: setting,
                            value: value,
                            type: type,
                            file: file
                         })
            });
        }
    }

})();