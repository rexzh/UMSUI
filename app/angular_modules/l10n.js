'use strict';
var l10n = angular.module('l10n', []);    
    
l10n._packages = {};
    
l10n.addResource = function (l, data) {
    l10n._packages[l] = data;
};

l10n.provider('$L', function () {
    var _l = 'en_us';
    var _dateFmt = 'dd/mm/yyyy';
    var _data = null;
    var _yIdx = 6, _mIdx = 3, _dIdx = 0;

    this.setLocale = function (l) {
        _l = l || 'en_us';
    };

    this.setFormat = function(dateFmt) {
        _dateFmt = dateFmt || 'dd/mm/yyyy';
        _yIdx = _dateFmt.indexOf('yyyy');
        _mIdx = _dateFmt.indexOf('mm');
        _dIdx = _dateFmt.indexOf('dd');
    }

    this.register = function (l, data) {
        l10n._packages[l] = data;
    };
        
    this.$get = function () {
        _data = l10n._packages[_l];

        var x = function (str) {
            if (_data && _data[str])
                return _data[str];
            else
                return str;
        };
        x.const = {
            Operation: x('Operation'),
            Add: x('Add'),
            Delete: x('Delete'),
            Modify: x('Modify'),
            Criteria: x('Criteria'),
            Search: x('Search'),
            Reset: x('Reset'),
            Save: x('Save'),
            Cancel: x('Cancel')
        };

        x.batch = function(list, prop) {
            $.each(list, function(i, data){
                data[prop + "l10n"] = x(data[prop]);
            });
        };

        x.getDateFormat = function() {
            return _dateFmt;
        };

        x.formatDate = function(d) {
            var yyyy = d.getFullYear().toString();
            var mm = (d.getMonth() + 1).toString();
            var dd = d.getDate().toString();

            return _dateFmt.replace('yyyy', yyyy).replace('mm', (mm[1] ? mm : "0" + mm[0])).replace('dd', (dd[1] ? dd : "0" + dd[0]));
        };

        x.parseDate = function(str) {
            var y = str.substr(_yIdx, 4);
            var m = str.substr(_mIdx, 2);
            var d = str.substr(_dIdx, 2);
            
            return new Date(parseInt(y), parseInt(m - 1), parseInt(d));
        }

        return x;
    }
});