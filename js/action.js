var store = require('./store');

var action = {
    setAccount: function(val){
        store.account = val
    },
    setPunch: function(val){
        store.account['money'] += val[0]
        store.account['free'] = val[1]
    },
    setInit: function(val){
        store.init = val
    },
    setFirstTime: function(val){
        store.firstTime = val;
    }
};

module.exports = action;