var React = require('react');
var PubSub = require('pubsub-js');

var store = require('../../store');
var action = require('../../action');

var i = 1.7;
var timeCount;
var tapped = false;
/**
 * @return {string}
 */
function ShowCountDown(endDate){
    var leftTime= endDate - new Date();
    if(leftTime <= 0){
        PubSub.publish('init')
    }
    var leftSecond = parseInt(leftTime/1000);
    var day=Math.floor(leftSecond/(60*60*24));
    var hour=Math.floor((leftSecond-day*24*60*60)/3600);
    var minute=Math.floor((leftSecond-day*24*60*60-hour*3600)/60);

    if(minute < 10)minute = '0' + minute.toString();
    if(hour < 10)hour = '0' + hour.toString();
    if(day < 10)day = '0' + day.toString();

    if(day == '00'){
        return <label>{hour}<span>时</span>{minute}<span>分</span></label>
    }else{
        return <label>{day}<span>天</span>{hour}<span>时</span></label>
    }
}
function date(val) {
    return moment(store.account['vpnPayTime']).add(1, val).toDate()
}

var Panel = React.createClass({
    getInitialState: function(){
        return {
            className:'panel-circle',
            punchClass:'punch-circle',
            init:true,
            time:'',
            initSpan:store.account['vpnIP'] == 'NONE' ? '点击创建':'点击激活',
            scaleK:Math.min(document.body.clientHeight - 170,screen.width)
        }
    },
    componentDidMount: function(){
        var self = this;
        setInterval(function(){
            self.setState({scaleK:Math.min(document.body.clientHeight - 170,screen.width)})
        },1000);
        if(store.account['run'] == 1)this.activeHandle();
        PubSub.subscribe('init',function(){
            self.setState({init:true})
        });
        PubSub.subscribe('activate',this.activeHandle)
    },
    activeHandle: function(val){
        if(val) action.setAccount(val);
        var self = this;
        var payCycle;

        setTimeout(function(){
            if (store.account['payCycle'] == 'day'){
                payCycle = date('days');
            }else{
                payCycle = date('months');
            }
            if (store.account['vpnIP'] == 'NONE'){
                PubSub.publish('changePage','创建')
            }else{
                self.setState({className:'panel-circle touchUp',time:ShowCountDown(payCycle)});
                setTimeout(function(){
                    self.setState({className:'panel-circle',init:false})
                },200);
                clearInterval(timeCount);
                timeCount = setInterval(function(){
                    self.setState({
                        time:ShowCountDown(payCycle)
                    })
                },1000 * 60);
            }
        },600)
    },
    render: function(){
        return (
            <div className="panel">
                {this.renderButton()}
                <div className="banner">
                    <span>我翻VPN</span>
                </div>
                <div className={this.state.punchClass} onTouchStart={this.punchDown} onTouchEnd={this.punchTap}>
                   <span>抽奖</span>
                </div>
            </div>
        )
    },
    renderButton: function(){
        if(this.state.init){
            return (
                <div id="circle-init" className={this.state.className} style={{
                    WebkitTransform:'scale('+this.state.scaleK/320+')'
                    }} onTouchStart={this.circleDown} onTouchEnd={this.circleUp} onTouchTap={this.circleTap}>
                    <svg className="alert-circle" width="200" height="200">
                        <circle cx="100" cy="100" r="95" fill="#FFF" stroke="#F4F1F1" strokeWidth="7" />
                        <circle id="js-sec-circle" className="alert-sec-circle" cx="100" cy="100" r="95" fill="transparent" stroke="#F4F1F1" strokeWidth="8" transform="rotate(-90 100 100)" />
                    </svg>
                    <div>
                    <i className="fa fa-power-off"/>
                    <span>{this.state.initSpan}</span>
                    </div>
                </div>
            )
        }else{
            var arr = this.state.time.props.children;
            var timeK = 0;
            if(arr[1].props.children == '时'){
                timeK = (24-parseInt(arr[0]))/24
            }else{
                timeK = (31-parseInt(arr[0]))/31
            }
            return (
                <div id="circle-show" className={this.state.className} style={{
                    WebkitTransform:'scale('+this.state.scaleK/320+')'
                    }}>
                    <svg className="alert-circle" width="200" height="200">
                        <circle cx="100" cy="100" r="95" fill="#FFF" stroke="#F4F1F1" strokeWidth="7" />
                        <circle className="alert-sec-circle" cx="100" cy="100" r="95" fill="transparent" stroke="#43AEFA" strokeWidth="8" transform="rotate(-90 100 100)"  style={{
                        strokeDashoffset: -597 * timeK,
                        opacity:1
                    }} />
                    </svg>
                    <div>
                        <span>距下次激活还有</span>
                        <span>{this.state.time}</span>
                    </div>
                </div>
            )
        }
    },
    circleDown: function(){
        this.setState({className:'panel-circle touch'})
    },
    circleTap: function(){
        if(this.state.init && tapped == false){
            var self = this;
            tapped = true;
            setTimeout(function(){
                tapped = false;
            },1000);
            if (store.account['vpnIP'] == 'NONE'){
                PubSub.publish('changePage','创建');
            }else{
                $.ajax({
                    type: "get",
                    url: store.serverUrl+"/activeVPN",
                    data:{
                        uniqueID:store.account['uniqueID']
                    },
                    dataType:'jsonp',
                    success: function(data){
                        if(data['code'] == 200){
                            action.setAccount(data['content']);
                            self.activeHandle()
                        }else{
                            if(data['code'] == 502)alert('账户余额不足');
                            self.setState({className:'panel-circle'});
                        }
                    }
                });
            }
        }
    },
    circleUp: function(){
        this.setState({className:'panel-circle'})
    },
    punchDown: function(){
        this.setState({punchClass:'punch-circle active'})
    },
    punchTap: function(){
        PubSub.publish('alert','打卡');
        var self = this;
        setTimeout(function(){
            self.setState({punchClass:'punch-circle'})
        },200)
    }
});

module.exports = Panel;