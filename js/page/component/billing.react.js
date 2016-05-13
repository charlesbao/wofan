var React = require('react');
var ScrollView = require('../ScrollView.react');
var List = require('./list.react');
var PubSub = require('pubsub-js');
//var Clipboard = require('Clipboard');

var store = require('../../store');
var action = require('../../action');

var i = 1.8;

var billing = React.createClass({
    getInitialState: function(){
        return {
            className:'billing-circle',
            money:0,
            cost:0,
            password:"[点击显示密码]",
            vpnState:store.account['run'] == 1 ? 'VPN目前正常运转' : 'VPN目前未激活',
            scaleK:Math.min(document.body.clientHeight - 228,screen.width)
        }
    },
    componentDidMount: function(){
        //new Clipboard('.list-item');
        if(store.firstTime){
            $('#tutorial-step').removeAttr('id');
            $('.vpn-tutorial')[0].setAttribute('id','tutorial-step');
        }
        var self = this;
        if(store.init == true){
            setTimeout(function(){
                self.refs.scroller._scrollTo(0, -500, 1000);
                action.setInit(false)
            },500)
        }
    },
    render: function(){
        var vpnLocation = '',vpnIcon = '';
        for(var each in store.vpnList){
            if(store.vpnList[each]['server'] == store.account['vpnServer']){
                vpnLocation = store.vpnList[each]['city'];
                vpnIcon = store.vpnList[each]['icon'];
            }
        }
        return (
            <div>
                <ScrollView ref='scroller' style={{
                    height:document.documentElement.clientHeight
                }}>
                    <div className="billing-account">
                        <div style={{
                            height:(document.documentElement.clientHeight - 228)
                        }}>
                            <div  style={{
                            WebkitTransform:'scale('+this.state.scaleK/320+')'
                            }} >
                                <div className={this.state.className} onTouchStart={this.circleDown} onTouchEnd={this.circleUp} onTouchTap={this.circleTap}>
                                    <span className="changeService">点击切换服务</span>
                                    <span className="location">
                                        {vpnLocation}[{store.account['payCycle'] == 'day' ? '天' : '月'}]
                                    </span>
                                    <i className={vpnIcon} />
                                </div>
                            </div>
                        </div>
                        <div className="vpn-panel">
                            <h1>{this.state.vpnState}<span className="vpnStatus" style={{
                                background:store.account['run'] == 0 ? '#FFD000' : '#7BCF8C'
                            }} /></h1>
                            <p>按天付费用户需每天点击激活按钮激活VPN,月付用户则每月激活.</p>
                        </div>
                        <span className="balance"><span>{store.account['money']}金币</span><span>目前余额</span></span>
                        <span className="cost-balance"><span>{store.account['cost']}金币</span><span>每{store.account['payCycle'] == 'day' ? '天' : '月'}花费</span></span>
                    </div>
                    <div className="vpn-tutorial">
                        <div className="vpn-detail">
                            <List label="账户详情"/>
                            <List label="协议" span="PPTP" />
                            <List label="描述" span={store.account['vpnIP'] == 'NONE' ? '请先创建VPN' : store.account['vpnServer'].toUpperCase()} />
                            <List label="服务器地址" span={store.account['vpnIP']} />
                            <List label="账户名称" span={store.account['username']} />
                            <List label="密码" span={this.state.password} touchHandle={this.touchHandle} />
                        </div>
                        <div onTouchTap={this.toTutorials}>
                            <label className="list-item label_one">VPN设置教程</label>
                            <div className="angle-right"><i className="fa fa-angle-right"/></div>
                        </div>
                    </div>
                </ScrollView>
            </div>
        )
    },
    toTutorials: function(){
        PubSub.publish('toTutorials',true);
    },
    touchHandle: function(){
        if(this.state.password == '[点击显示密码]'){
            this.setState({password:store.account['password']})
        }else{
            this.setState({password:'[点击显示密码]'})
        }
    },
    circleDown: function(){
        this.setState({className:'billing-circle touch'})
    },
    circleTap: function(){
        PubSub.publish('toAddVPN',true);
    },
    circleUp: function(){
        //this.setState({className:'billing-circle touchUp'});
        var self = this;
        setTimeout(function(){
            self.setState({className:'billing-circle'});
        },200)
    },
    billingInterval: function(){
        var moneyMount = store.account['money']/10;
        var costMount = store.account['cost']/10;
        var self = this;
        var billingInvertal = setInterval(function(){
            if(self.state.money < store.account['money']){
                self.setState({
                    money:Math.floor(self.state.money + moneyMount),
                    cost:Math.floor(self.state.cost + costMount)
                });
            }else{
                clearInterval(billingInvertal)
            }
        },50)
    }
});

module.exports = billing