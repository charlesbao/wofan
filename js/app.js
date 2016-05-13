var React = require('react');
var ReactDOM = require('react-dom');
var MainSection = require('./page/main_section.react');
var RegisterSection = require('./page/RegisterSection.react');
var action = require('./action');
var serverUrl = require('./store').serverUrl;

var store = require('./store')
var injectTapEventPlugin = require("react-tap-event-plugin");
injectTapEventPlugin();

//测试账号
//window.localStorage.setItem('uid','2c48a143439666e27efb375922fa9d3a');
window.location.hash = '';
if( $('#main').attr('data-id') != ''){
    $.ajax({
        type: "get",
        url: serverUrl+"/getUser",
        data:{
            openid: $('#main').attr('data-id')
        },
        dataType:'jsonp',
        success: function(data){
            if(data['code'] == 200){
                action.setAccount(data['content']);
                ReactDOM.render(
                    <MainSection />,
                    document.getElementById('main')
                );
            }else{
                ReactDOM.render(
                    <RegisterSection />,
                    document.getElementById('main')
                );
            }
        }
    });
}else{
    ReactDOM.render(
        <RegisterSection />,
        document.getElementById('main')
    );
}

