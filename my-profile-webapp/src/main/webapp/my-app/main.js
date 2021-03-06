/*
 * Copyright 2012, Board of Regents of the University of
 * Wisconsin System. See the NOTICE file distributed with
 * this work for additional information regarding copyright
 * ownership. Board of Regents of the University of Wisconsin
 * System licenses this file to you under the Apache License,
 * Version 2.0 (the "License"); you may not use this file
 * except in compliance with the License. You may obtain a
 * copy of the License at:
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on
 * an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied. See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
define([
    'angular',
    'require',
    './lec/routes',
    './profile/routes',
    'portal/settings/routes',
    'portal',
    'app-config',
    'ngRoute',
    'ngSanitize',
    'ngStorage',
    './lec/controllers',
    './lec/constants',
    './lec/services',
    './lec/directives',
    './profile/controllers',
    './profile/services',
    './profile/directives',
], function(angular, require, lecRoutes, profileRoutes, settingsRoutes) {

    var app = angular.module('my-app', [
        'app-config',
        'my-app.profile.controllers',
        'my-app.profile.services',
        'my-app.profile.directives',
        'my-app.lec.app-constaints',
        'my-app.lec.controllers',
        'my-app.lec.services',
        'my-app.lec.directives',
        'ngRoute',
        'ngSanitize',
        'ngStorage',
        'portal'
    ]);

    // TODO: Think of a more extensible approach such that frame and app can each manage their own routing without conflict
    app.config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
        $locationProvider.html5Mode(true);
        $routeProvider.
        when('/main', profileRoutes.main).
        when('/contact-info', profileRoutes.contactInfo).
        when('/local/adminLookup', lecRoutes.adminLookup).
        when('/emergencyInfo', lecRoutes.emergencyInfo).
        when('/settings', settingsRoutes.betaSettings).
        when('/settings/profile', profileRoutes.profileSettings).
        otherwise({
            redirectTo: '/emergencyInfo'
        });
    }]);

    return app;

});
