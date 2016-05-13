var React = require('react');
var ReactDOM = require('react-dom');
var ScrollView = require('./ScrollView.react');
var List = require('./component/list.react');
var MainSection = require('./main_section.react');

var store = require('../store')
var serverUrl = require('../store').serverUrl;
var action = require('../action');

function trim(str){
    return str.replace(/(^\s*)|(\s*$)/g,"");
}

//<List input={true} label="密码" type="password" placeholder="请设置密码" />
//<List input={true} label="确认" type="password" placeholder="请输入确认密码" />
var section = React.createClass({
    getInitialState: function(){
        return {
            className:'touch',
            scaleK:Math.min(document.body.clientHeight - 250,screen.width)
        }
    },
    render: function(){
        return (
            <section className="registerSection">
                <ScrollView style={{
                height:document.documentElement.clientHeight
                }}>
                    <div className="cover" style={{
                    height:document.documentElement.clientHeight - 250
                    }}>
                        <div  style={{
                        WebkitTransform:'scale('+this.state.scaleK/320+')'
                        }} >
                            <img src={store.staticPath+'wofancover.png'}/>
                        </div>
                        <div className="register-label">
                            <div>欢迎加入我翻 | 畅想无障碍网络</div>
                            <span>注册的我翻账号和密码将用于vpn连接设置</span>
                        </div>
                    </div>
                    <div>
                    <input hidden="hidden" />
                    <List input={true} type="text" placeholder="请设置我翻账号" style={{
                        boxShadow: '0px -5px 10px rgba(0,0,0,0.1)'
                    }}/>
                    <List input={true} type="password" placeholder="请设置我翻密码" />
                    <List input={true} type="password" placeholder="请输入确认密码" />
                    <span className="button"><span className={this.state.className} onTouchStart={this.circleDown} onTouchEnd={this.circleUp} onTouchTap={this.submitHandle.bind(this,'register')}>完成注册</span></span>
                    </div>
                </ScrollView>
            </section>
        )
    },
    circleDown: function(){
        this.setState({className:'touch touchActive'})
    },
    circleUp: function(){
        this.setState({className:'touch'});
    },
    submitHandle: function(data){
        var selector = $('input');
        var username = trim(selector[1].value);
        var password = trim(selector[2].value);
        if(!/^\w+$/.test(username)){
            alert('用户名由数字、26个英文字母或者下划线组成');
            return
        }
        if(!/^\w+$/.test(password)){
            alert('密码由数字、26个英文字母或者下划线组成');
            return
        }
        if(username.length < 6){
            alert('用户名不能小于6位');
            return
        }
        if(password.length < 6){
            alert('密码不能小于6位');
            return
        }
        if(password != trim(selector[3].value)){
            alert('两次密码输入不一致');
            return
        }
        $.ajax({
            type: "get",
            url: serverUrl+"/insertUser",
            data:{
                username:username,
                password:password,
                openid:$('#main').attr('data-id')
            },
            dataType:'jsonp',
            success: function(data){
                if(data['code'] == 200){
                    action.setAccount(data['content']);
                    action.setFirstTime(true);
                    ReactDOM.render(
                        <MainSection />,
                        document.getElementById('main')
                    );
                }else{
                    alert('用户名已存在')
                }
            }
        });
    }
});

module.exports = section;