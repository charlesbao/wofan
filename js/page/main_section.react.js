var React = require('react');
var PubSub = require('pubsub-js');
var Grid = require('./component/grid.react');
var Panel = require('./component/panel.react');
var AddAccount = require('./component/addVPN.react');
var Billing = require('./component/billing.react');
var Recharge = require('./component/recharge.react');
var Tutorials = require('./component/tutorials.react');
var Broadcast = require('./component/broadcast.react');
var Activity = require('./component/activity.react');
var About = require('./component/about.react');

var store = require('../store');
var action = require('../action');

var serverActive;
var broadcastContent = '';
var main_section = React.createClass({
    getInitialState: function(){
        serverActive = [store.account['vpnServer'],store.account['payCycle']];
        return {
            page:0,
            animateOut:'animated-dot5',
            animateEnter:'animated-dot5',
            renderBroadcast:false
        }
    },
    componentDidMount: function(){
        var self = this;
        if(store.firstTime){
            $('#tutorial-step').removeAttr('id');
            $('.grid-list')[0].setAttribute('id','tutorial-step')
        }
        if(window.localStorage.getItem('activityBool') == 'false'){
            location.hash = '';
            setTimeout(function() {
                var data = '活动';
                self.setState({
                    page: data,
                    animateOut: 'animated-dot5 fadeOutLeft',
                    animateEnter: 'animated-dot5 fadeInRight'
                });
                setTimeout(function () {
                    self.setState({
                        animateOut: 'animated-dot5 fadeOutLeft hidden'
                    })
                }, 600);
                location.hash = data
            },1200)
        }
        window.localStorage.setItem('uid',store.account['uniqueID']);
        PubSub.subscribe('alert',function(msg,data){
            switch (data){
                case '打卡':
                    if(store.account['free'] == 1){
                        var punchNum = Math.floor(Math.random()*15+10);
                        broadcastContent = '抽奖成功,恭喜获得'+punchNum+'金币奖励!';
                        $.ajax({
                            url:store.serverUrl+'/punch',
                            type: "get",
                            data:{
                                uid:store.account['uniqueID'],
                                punch:punchNum
                            },
                            dataType:'jsonp',
                            success: function(data){
                                if(data['code'] == 200){
                                    action.setPunch(data['content'])
                                }
                            }
                        });
                    }else{
                        broadcastContent = '您今天的抽奖已结束,请明天再来!'
                    }
                    self.setState({renderBroadcast:true});
                    break;
            }
        });
        PubSub.subscribe('changePage',function(msg,data){
            self.setState({
                page:data,
                animateOut:'animated-dot5 fadeOutLeft',
                animateEnter:'animated-dot5 fadeInRight'
            });
            setTimeout(function(){
                self.setState({
                    animateOut:'animated-dot5 fadeOutLeft hidden'
                })
            },600);
            location.hash = data
        });
        PubSub.subscribe('activate',function(msg,data){

            serverActive = [data['vpnServer'],data['payCycle']];
            action.setAccount(data);
            action.setInit(true);
            location.hash = '';
            if(store.firstTime){
                $('#tutorial-step').removeAttr('id');
                $('.grid-list')[1].setAttribute('id','tutorial-step');
            }else{
                setTimeout(function(){
                    var data = '账户';
                    self.setState({
                        page:data,
                        animateOut:'animated-dot5 fadeOutLeft',
                        animateEnter:'animated-dot5 fadeInRight'
                    });
                    setTimeout(function(){
                        self.setState({
                            animateOut:'animated-dot5 fadeOutLeft hidden'
                        })
                    },600);
                    location.hash = data;
                },1200)
            }
        });
        PubSub.subscribe('toTutorials',function(){
            location.hash = '';
            setTimeout(function(){
                var data = '教程';
                self.setState({
                    page:data,
                    animateOut:'animated-dot5 fadeOutLeft',
                    animateEnter:'animated-dot5 fadeInRight'
                });
                setTimeout(function(){
                    self.setState({
                        animateOut:'animated-dot5 fadeOutLeft hidden'
                    })
                },600);
                location.hash = data
            },600)
        });
        PubSub.subscribe('toAddVPN',function(){
            location.hash = '';
            setTimeout(function(){
                var data = '创建';
                self.setState({
                    page:data,
                    animateOut:'animated-dot5 fadeOutLeft',
                    animateEnter:'animated-dot5 fadeInRight'
                });
                setTimeout(function(){
                    self.setState({
                        animateOut:'animated-dot5 fadeOutLeft hidden'
                    })
                },600);
                location.hash = data
            },600)
        });
        window.addEventListener('hashchange',function(){
            if(location.hash.replace('#','') == ''){
                self.setState({
                    animateOut:'animated-dot5 fadeInLeft',
                    animateEnter:'animated-dot5 fadeOutRight'
                });
                setTimeout(function(){
                    self.setState({
                        page:0,
                        animateOut:'animated-dot5',
                        animateEnter:'animated-dot5'
                    });
                },600)
            }
        });
    },
    render: function(){
        return (
            <div>
                {this.renderBroadcast()}
                {this.renderViews('main')}
                {this.renderViews(this.state.page)}
            </div>
        )
    },
    renderViews: function(page){
        switch (page){
            case 'main':
                return (
                    <section className={this.state.animateOut}>
                        <Panel />
                        <div className="grid-panel">
                            <Grid color="" icon="fa fa-plus-square-o" text="创建" />
                            <Grid color="" icon="fa fa-lemon-o" text="账户" />
                            <Grid color="" icon="fa fa-star-o" text="充值" width={screen.width - parseInt(screen.width * 2/3) } />
                            <Grid color="" icon="fa fa-lightbulb-o" text="教程" />
                            <Grid color="" icon="fa fa-support" text="活动" />
                            <Grid color="" icon="fa fa-bookmark-o" text="关于" width={screen.width - parseInt(screen.width * 2/3) } />
                        </div>
                    </section>
                );
                break;
            case '创建':
                return (
                    <section className={this.state.animateEnter}>
                        <AddAccount uniqueID={store.account.uniqueID} serverActive={serverActive} />
                    </section>
                );
                break;
            case '账户':
                return (
                    <section className={this.state.animateEnter}>
                        <Billing account={store.account} />
                    </section>
                );
                break;
            case '充值':
                return (
                    <section className={this.state.animateEnter}>
                        <Recharge account={store.account} />
                    </section>
                );
                break;
            case '教程':
                return (
                    <section className={this.state.animateEnter}>
                        <Tutorials />
                    </section>
                );
                break;
            case '活动':
                return (
                    <section className={this.state.animateEnter}>
                        <Activity />
                    </section>
                );
                break;
            case '关于':
                return (
                    <section className={this.state.animateEnter}>
                        <About />
                    </section>
                );
                break;
            default:
                return (
                    <section className='animated-dot5' hidden="hidden" />
                );
                break;
        }
    },
    renderBroadcast: function(){
        if(this.state.renderBroadcast){
            return <Broadcast content={broadcastContent} close={this.closeBroadcast} />
        }
    },
    closeBroadcast: function() {
        this.setState({renderBroadcast: false})
    }
});

module.exports = main_section;

