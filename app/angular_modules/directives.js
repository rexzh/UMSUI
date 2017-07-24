(function () {
    'use strict';
    var metro = angular.module('metro.directive', ['common', 'l10n']);

    metro.factory('timeFormatter', function () {
        return {
            format: function (t) {
                var yyyy = t.getFullYear().toString();
                var mm = (t.getMonth() + 1).toString();
                var dd = t.getDate().toString();
                var hh = t.getHours().toString();
                var mi = t.getMinutes().toString();
                var ss = t.getSeconds().toString();
                return yyyy + '-' + (mm[1] ? mm : "0" + mm[0]) + '-' + (dd[1] ? dd : "0" + dd[0]) + ' ' +
                        (hh[1] ? hh : '0' + hh[0]) + ':' + (mi[1] ? mi : '0' + mi[0]) + ':' + (ss[1] ? ss : '0' + ss[0]);
            }
        }
    });
    
    metro.directive('metroStatBox', function ($timeout) {
        return {
            restrict: 'AE',
            replace: true,
            scope: {
                span: '@sbSpan',
                color: '@sbColor',
                list: '@sbList',
                number: '@sbNumber',
                title: '@sbTitle',
                link: '@sbLink',
                icon: '@sbIcon'
            },            
            template: '<div class="{{span}} statbox {{color}}">' +
                            '<div class="boxchart {{color}}Font">{{list}}</div>' +
                            '<div class="number">{{number}}<i class="{{icon}}"></i></div>' +
                            '<div class="title">{{title}}</div>' +
                            '<div class="footer">' +
                                '<a>{{link}}</a>' +
                            '</div>' +
                        '</div>',
            compile: function (element, attrs) {
                return function (scope, element, attrs) {
                    function draw() {
                        if (scope.list && scope.list.length > 0) {
                            if ($(".boxchart", element)) {
                                $(".boxchart", element).sparkline('html', {
                                    type: 'bar',
                                    height: '60',
                                    barWidth: '4',
                                    barSpacing: '1',
                                    barColor: '#ffffff',
                                    negBarColor: '#eeeeee'
                                });
                            }
                        }
                    }

                    $timeout(draw, 1);
                }
            }
        }
    });

    metro.directive('metroStatCircle', function ($timeout) {
        return {
            restrict: 'AE',
            replace: true,
            scope: {
                span: '@scSpan',
                color: '@scColor',
                value: '@scValue',
                number: '@scNumber',
                total: '@scTotal',
                unit: '@scUnit',
                title: '@scTitle'
            },
            template: '<div class="{{span}}">' +
                            '<div class="circleStatsItemBox {{color}}">' +
                                '<div class="header">{{title}}</div>' +
                                '<span class="percent">%</span>' +
                                '<div class="circleStat">' +
                                    '<input type="text" value="{{value}}" class="whiteCircle" />' +
                                '</div>' +
                                '<div class="footer">' +
                                    '<span class="count">' +
                                        '<span class="number">{{number}}</span>' +
                                        '<span class="unit">{{unit}}</span>' +
                                    '</span>' +
                                    '<span class="sep"> / </span>' +
                                    '<span class="value">' +
                                        '<span class="number">{{total}}</span>' +
                                        '<span class="unit">{{unit}}</span>' +
                                    '</span>' +
                                '</div>' +
                            '</div>' +
                        '</div>',
            compile: function (element, attrs) {
                return function (scope, element, attrs) {
                    function draw() {
                        $(".whiteCircle", element).knob({
                            'min': 0,
                            'max': 100,
                            'readOnly': true,
                            'width': 120,
                            'height': 120,
                            'bgColor': 'rgba(255,255,255,0.5)',
                            'fgColor': 'rgba(255,255,255,0.9)',
                            'dynamicDraw': true,
                            'thickness': 0.2,
                            'tickColorizeValues': true
                        });

                        var c = $(".circleStatsItemBox", element).first();
                        c.find(".count > .unit").html(scope.unit);
                        c.find(".count > .number").html(scope.number);
                    }

                    
                    $timeout(draw, 200);
                    scope.$watchGroup(['number', 'value'], function () {
                        $(".whiteCircle", element).trigger('change');
                        var c = $(".circleStatsItemBox", element).first();
                        c.find(".count > .unit").html(scope.unit);
                        c.find(".count > .number").html(scope.number);
                    });
                }
            }
        }
    });

    metro.directive('metroButton', function () {
        return {
            restrict: 'AE',
            replace: true,
            scope: {
                span: '@btnSpan',
                color: '@btnColor',
                icon: '@btnIcon',
                text: '@btnText',
                note: '@btnNote'
            },
            template: '<a class="quick-button {{span}}">' +
                            '<i class="{{icon}}"></i>' +
                            '<p>{{text}}</p>' +
                            '<span class="notification {{color}}">{{note}}</span>' +
                        '</a>',
            compile: function (element, attrs) {                
                return function (scope, element, attrs) {                    
                }
            }
        }
    });

    metro.directive('metroSmallButton', function () {
        return {
            restrict: 'AE',
            replace: true,
            scope: {
                span: '@btnSpan',
                color: '@btnColor',
                icon: '@btnIcon',
                text: '@btnText',
                note: '@btnNote'
            },
            template: '<a class="quick-button-small {{span}}">' +
                            '<i class="{{icon}}"></i>' +
                            '<h5>{{text}}</h5>' +
                            '<span class="notification {{color}}">{{note}}</span>' +
                        '</a>',
            compile: function (element, attrs) {
                return function (scope, element, attrs) {
                }
            }
        }
    });

    metro.directive('metroMessage', function () {
        return {
            restrict: 'AE',
            replace: true,
            scope: {
                type: '@msgType',
                text: '@msgText',
                lead: '@msgLead'
            },
            template: '<div class="alert alert-{{type}}">' +
                            '<strong>{{lead}}</strong> {{text}}' +
                        '</div>',
            compile: function (element, attrs) {
                return function (scope, element, attrs) {
                }
            }
        }
    });

    
    metro.directive('metroTabSet', function () {
        return {
            restrict: 'AE',
            transclude: true,
            replace: true,
            scope: {
                tabChanged: '&'
            },
            template:
                '<div class="box-content">' +
                  '<ul class="nav tab-menu nav-tabs">' +
                    '<li ng-repeat="tab in tabs" ng-class="{active:tab.selected}">' +
                      '<a ng-click="select(tab)">{{tab.tabHeader}}</a>' +
                    '</li>' +
                  '</ul>' +
                  '<div class="tab-content" ng-transclude></div>' +
                '</div>',

            controller: function ($scope) {
                var tabs = $scope.tabs = [];

                $scope.select = function (tab) {
                    angular.forEach(tabs, function (tab) {
                        tab.selected = false;
                    });
                    tab.selected = true;
                    if (tabs.length > 1)
                        $scope.tabChanged && $scope.tabChanged({ tab: tab });
                }

                this.addTab = function (tab) {
                    if (tabs.length == 0) $scope.select(tab);
                    tabs.push(tab);
                }
            }
        };
    });

    metro.directive('metroTab', function () {
        return {
            require: '^metroTabSet',
            restrict: 'AE',
            transclude: true,
            replace: true,
            scope: {
                tabHeader: '@',
                tabId: '@'
            },
            template:
                '<div class="tab-pane" ng-class="{active: selected}" ng-transclude>' +
                '</div>',
            link: function (scope, element, attrs, tabsCtrl) {
                tabsCtrl.addTab(scope);
            },
        };
    });

    metro.directive('metroDatepicker', function () {
        return {
            restrict: 'AE',
            replace: true,
            scope: {
                format: '@dpFormat'
            },
            template: '<input type="text">',
            link: function (scope, element, attrs) {
                var format = attrs["dpFormat"] || "yy-mm-dd";
                $(element).datepicker({dateFormat: format});
            }
        };
    });

    metro.directive('metroFileInput', function(){
        return {
            restrict: 'AE',
            replace: true,
            require: '?ngModel',
            scope: {
                disabled: '=ngDisabled'
            },
            template: '<input class="input-file" type="file">',
            link: function(scope, element, attrs, ngModel) {
                $(element).uniform();

                $(element).on('change', function(){
                    var files = $(element).get(0).files;
                    ngModel && scope.$apply(ngModel.$setViewValue(files));
                });
                
                if (ngModel) {
                    ngModel.$render = function () {
                        $(element).parent().find('span.filename').text(ngModel.$modelValue);
                    }
                }
                
                scope.$watch('disabled', function() {
                    var div = $(element).parent();
                    if(scope.disabled)
                        div.addClass('disabled');
                    else
                        div.removeClass('disabled');
                });
            }
        }
    });

    metro.directive('metroCheckbox', function(){
        return {
            restrict: 'AE',
            replace: true,
            require: '?ngModel',
            scope: {
                disabled: '=ngDisabled'
            },
            template: '<label class="checkbox">' +
                        '<div class="checker"><span><input type="checkbox"></span></div>' +
                    '</label>',
            link: function(scope, element, attrs, ngModel) {
                $(element).on('click', function(evt) {
                    if(scope.disabled) return;
                    evt.preventDefault();
                    var cb = $(this).find('input');
                    var span = $(this).find('span');
                    var checked = cb.prop('checked');
                    cb.prop('checked', !checked);
                    
                    if(!checked) 
                        span.addClass('checked');
                    else
                        span.removeClass('checked');

                    ngModel && scope.$apply(ngModel.$setViewValue(!checked));
                });                
                
                if (ngModel) {
                    ngModel.$render = function () {
                        var span = $(element).find('span');
                        var cb = $(element).find('input');
                        if(ngModel.$modelValue){
                            span.addClass('checked');
                        } else {
                            span.removeClass('checked');
                        }
                        cb.prop('checked', ngModel.$modelValue);
                    }
                }
                
                scope.$watch('disabled', function() {
                    var div = $(element).find('div');
                    if(scope.disabled)
                        div.addClass('disabled');
                    else
                        div.removeClass('disabled');
                });
            }
        }
    });

    metro.directive('metroMenu', function($timeout, $rootScope){
        return {
            restrict: 'AE',
            replace: true,
            scope: {
                menus: '=menuData'
            },
            template: '<ul class="nav nav-tabs nav-stacked main-menu">' +
                        '<li class="dropdown" ng-repeat="mn in menus" ng-click="toggle(mn, $event)">' +
                            '<a><i class="icon-chevron-right"></i><span class="hidden-tablet">{{mn.name}}</span></a>' +
                            '<ul>' +
                                '<li ng-repeat="item in mn.submenus" ng-click="handle(item, $event)" class="sub-menu">' +
                                    '<a href="{{item.link}}">' +
                                        '<i class="icon-nothing"></i>' +
                                        '<i class="{{item.icon}}"></i>' +
                                        '<span class="hidden-tablet">{{item.name}}</span>' +
                                    '</a>' +
                                '</li>' +
                            '</ul>' +
                        '</li>' +
                    '</ul>',
            controller: function($scope, $element) {
                $scope.toggle = function(mn, $event) {
                    
                    var li = $($event.currentTarget);
                    if(li.hasClass("dropdown")){
                        li.find('ul').toggle('fast');
                        var icon = li.find('i').first();
                        
                        if(icon.hasClass('icon-chevron-down')) {
                            icon.removeClass('icon-chevron-down');
                            icon.addClass('icon-chevron-right');
                        } else {
                            icon.removeClass('icon-chevron-right');
                            icon.addClass('icon-chevron-down');
                        }
                    }

                    //Note: close other
                    var lv1 = li.parent().children('li');
                    for(var i = 0; i < lv1.length; i++) {
                        var m = lv1[i];

                        if(m == li.get(0)) {
                            continue;
                        } else {
                            $(m).find('ul').hide("fast");
                            var ic = $(m).find('i').first();
                            ic.removeClass('icon-chevron-down');
                            ic.addClass('icon-chevron-right');
                        }
                    }
                },

                $scope.handle = function(itm, $event) {
                    $rootScope.$broadcast('menuChange', itm);

                    $event.stopPropagation();
                    $($element).find('li').removeClass('active');
                    $($event.currentTarget).addClass('active');
                }
            },
            compile: function(element, attrs) {                
                return function (scope, element, attrs) {
                    
                }
            }
        }
    });

    metro.directive('metroWait', function(){
        return {
            restrict: 'AE',
            replace: true,
            template: '<div data-role="preloader" data-type="metro" data-style="dark" style="top: -28px;" class="preloader-metro dark-style" ng>' +
                        '<div class="circle"></div>' +
                        '<div class="circle"></div>' +
                        '<div class="circle"></div>' +
                        '<div class="circle"></div>' +
                        '<div class="circle"></div>' +
                    '</div>',
            link: function(scope, element) {
            }
        }
    });

    metro.directive('metroPagination', function ($L) {
        return {
            restrict: 'AE',
            replace: true,
            scope: {
                totalRecords: '@pgTotalRecords',
                numberPerPage: '@pgNumberPerPage',
                pageChanged: '&pgChanged'
            },
            template: '<div class="dataTables_paginate paging_bootstrap pagination">' +
                            '<ul class="pagination">' +
                                '<li ng-class="{disabled: disableBack}"><a ng-click="goFirst()">&laquo;</a></li>' +
                                '<li ng-class="{disabled: disableBack}"><a ng-click="goPrev()">&lsaquo;</a></li>' +
                                '<li ng-repeat="d in range" ng-show="d <= totalPages" ng-class="{active: d== currentPage}"><a class="pagination-button" ng-click="goPage(d)">{{d}}</a></li>' +
                                '<li ng-class="{disabled: disableNext}"><a ng-click="goNext()">&rsaquo;</a></li>' +
                                '<li ng-class="{disabled: disableNext}"><a ng-click="goLast()">&raquo;</a></li>' +
                            '</ul>' +
                            '<div>' +
                                '<div style="display:inline">&nbsp;{{totalLabel}} <span class="pagination-indicator">{{totalRecords}}</span> {{itemLabel}}, <span class="pagination-indicator">{{totalPages}}</span> {{pageLabel}}</div>' +
                                '<div style="display:inline; margin-left: 10px;"><input style="vertical-align: baseline; width: 20px" size="4" type="text"/></div>' +
                                '<a style="vertical-align: baseline;padding: 4px 12px;" class="btn btn-primary btn-sm" ng-click="goInput()">{{jumpLabel}}</a>' +
                            '</div>' +
                        '</div>',
            controller: function ($scope, $element) {
                $scope.totalLabel = $L('Total');
                $scope.itemLabel = $L('Item(s)');
                $scope.pageLabel = $L('Page(s)');
                $scope.jumpLabel = $L('Go');
                var inp = $element.find("input[type=text]").eq(0);
                inp.val(1);
                $scope.goFirst = function () {
                    if ($scope.disableBack) return;

                    if ($scope.totalPages > 5) {
                        $scope.range = [1, 2, 3, 4, 5];
                    }
                    $scope.currentPage = 1;
                    inp.val($scope.currentPage);
                    $scope.pageChanged && $scope.pageChanged({ page: $scope.currentPage });
                };

                $scope.goLast = function () {
                    if ($scope.disableNext) return;

                    if ($scope.totalPages > 5) {
                        $scope.range = [$scope.totalPages - 4, $scope.totalPages - 3, $scope.totalPages - 2, $scope.totalPages - 1, $scope.totalPages];
                    }
                    $scope.currentPage = $scope.totalPages;
                    inp.val($scope.currentPage);
                    $scope.pageChanged && $scope.pageChanged({ page: $scope.currentPage });
                };

                $scope.goPrev = function () {
                    if ($scope.disableBack) return;

                    if ($scope.totalPages > 5) {
                        if ($scope.range[0] > 1 && $scope.currentPage < $scope.totalPages - 1) {
                            for (var i = 0; i < 5; i++)
                                $scope.range[i]--;
                        }
                    }
                    $scope.currentPage--;
                    inp.val($scope.currentPage);
                    $scope.pageChanged && $scope.pageChanged({ page: $scope.currentPage });
                };

                $scope.goNext = function () {
                    if ($scope.disableNext) return;

                    if ($scope.totalPages > 5) {
                        if ($scope.currentPage > 2 && $scope.range[4] < $scope.totalPages) {
                            for (var i = 0; i < 5; i++)
                                $scope.range[i]++;
                        }
                    }
                    $scope.currentPage++;
                    inp.val($scope.currentPage);
                    $scope.pageChanged && $scope.pageChanged({ page: $scope.currentPage });
                };

                $scope.goPage = function (p) {
                    if (p == $scope.currentPage) return;
                    $scope.currentPage = p;
                    inp.val($scope.currentPage);
                    $scope.pageChanged && $scope.pageChanged({ page: $scope.currentPage });
                };

                $scope.goInput = function () {
                    var x = parseInt(inp.val());
                    if (x == $scope.currentPage || isNaN(x)) return;
                    if (x < 1)
                        x = 1;
                    if (x > $scope.totalPages)
                        x = $scope.totalPages;
                    $scope.currentPage = x;
                    inp.val(x);
                    $scope.pageChanged && $scope.pageChanged({ page: $scope.currentPage });
                }
            },
            compile: function (element, attrs) {
                return function (scope, element, attrs) {
                    scope.range = [1, 2, 3, 4, 5];
                    scope.currentPage = 1;

                    function recalc() {
                        scope.totalPages = Math.ceil(scope.totalRecords / scope.numberPerPage);
                        if (scope.totalPages == 0)
                            scope.totalPages = 1;

                        scope.disableBack = (scope.currentPage == 1);
                        scope.disableNext = (scope.currentPage == scope.totalPages);

                        if (scope.totalPages > 5) {
                            if (scope.currentPage > 2 && scope.currentPage < scope.totalPages - 1) {
                                for (var i = 0; i < 5; i++) {
                                    scope.range[i] = scope.currentPage + i - 2;
                                }
                            } else if (scope.currentPage <= 2) {
                                scope.range = [1, 2, 3, 4, 5];
                            } else if (scope.currentPage >= scope.totalPages - 1) {
                                scope.range = [scope.totalPages - 4, scope.totalPages - 3, scope.totalPages - 2, scope.totalPages - 1, scope.totalPages];
                            }
                        } else {
                            scope.range = [1, 2, 3, 4, 5];
                            if(scope.currentPage > scope.totalPages) {
                                scope.currentPage = scope.totalPages;
                                scope.pageChanged && scope.pageChanged({page: scope.currentPage});
                                var inp = element.find("input[type=text]").eq(0);
                                inp.val(scope.currentPage);
                            }
                        }
                    }

                    scope.$watchGroup(['totalRecords', 'numberPerPage', 'currentPage'], recalc);
                    scope.$watch('range', recalc, true);

                    scope.pageChanged && scope.pageChanged({page: scope.currentPage});//init fire page 1
                }
            }
        }
    });

    metro.factory('msgbox', function($q, $compile, $rootScope, $interpolate, $L){
        var html = '<div class="modal hide fade">' +
                        '<div class="modal-header">' +
                            '<button type="button" class="close" data-dismiss="modal" ng-click="close(false)">×</button>' +
                            '<h3>{{title}}</h3>' +
                        '</div>' +
                        '<div class="modal-body">' +
                            '<p>{{text}}</p>' +
                        '</div>' +
                        '<div class="modal-footer">' +
                            '<a class="btn btn-primary" data-dismiss="modal" ng-click="close(true)">' + $L('OK') + '</a>' +
                            '<a class="btn" data-dismiss="modal" ng-click="close(false)">' + $L('Cancel') + '</a>' +
                        '</div>' +
                    '</div>';
        var defaultOpts = {
            title: $L('Confirm'),
            text: $L('Delete')
        };
        return {
            show: function(options) {
                var opt = {};
                angular.extend(opt, defaultOpts, options);

                var deferred = $q.defer();
                var element = $($interpolate(html)(opt));

                var scope = $rootScope.$new();
                $compile(element)(scope);

                scope.close = function (result) {
                    deferred.resolve(result);
                };

                element.modal('show');
                return deferred.promise;
            }
        };
    });

    metro.factory('notify', function($rootScope){
        return {
            info: function(msg) {
                $rootScope.$broadcast('notify', {type: "success", text: msg});
            },

            error: function(msg) {
                $rootScope.$broadcast('notify', {type: "danger", text: msg});
            }
        }
    });
})();
