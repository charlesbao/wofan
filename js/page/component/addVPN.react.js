var React = require('react');
var ScrollView = require('../ScrollView.react')
var PubSub = require('pubsub-js');
var classNames = require('classnames');

var lists = require('../../store').vpnList;
var serverUrl = require('../../store').serverUrl;
var store = require('../../store');

var tapped = false;

var addVPN = React.createClass({
    getInitialState: function(){
        if(store.account['maxCost'] == null){
            store.account['maxCost'] = store.account['cost']
        }
        var dayCost,monthCost;
        for(var each in lists){
            if (lists[each]['server'] == this.props.serverActive[0]){
                dayCost = lists[each]['day'];
                monthCost = lists[each]['month'];
            }
        }
        return {
            contentBool:this.props.serverActive[0],
            costBool:this.props.serverActive[1] == 'day',
            freeDOM: this.props.serverActive[0] == 'free',
            dayCost:dayCost,
            monthCost:monthCost
        }
    },
    componentDidMount: function(){
        if(store.firstTime){
            $('#tutorial-step').removeAttr('id');
            $('.addVPN-content')[0].setAttribute('id','tutorial-step')
        }
        for(var each in lists){
            if (lists[each]['server'] == this.state.contentBool){
                var moveLength = -170 * each;
                if(moveLength < this.refs.scroller._maxScrollY - 20){
                    moveLength = this.refs.scroller._maxScrollY - 20;
                }
                this.refs.scroller._scrollTo(0, moveLength, 1000)
            }
        }
    },
    render: function(){
        var monthCost = parseInt(this.state.monthCost);
        var dayCost = parseInt(this.state.dayCost);
        if(store.account['run'] == 1) {
            if(store.account['payCycle'] == 'month'){
                if (monthCost > store.account['maxCost']) {
                    monthCost = monthCost - store.account['maxCost']
                }else{
                    monthCost = 0
                }
            }else{
                if (dayCost > store.account['maxCost']) {
                    dayCost = dayCost - store.account['maxCost']
                }else{
                    dayCost = 0
                }
            }
        }
        if(this.state.monthCost == '---'){
            monthCost = '---'
        }
        return (
            <div>
                <div className="fixMoney">
                    余额:<span style={{color:'#1d82db'}}>{store.account['money']+'金币'}</span>
                </div>
                <ScrollView ref='scroller' style={{
                    height:document.documentElement.clientHeight - 145
                }}>
                <div className="addVPN-section">
                    {this.renderView()}
                </div>
                </ScrollView>
                <div className="addVPN-bottom">
                    <div className="cost">
                        <label>请选择付费周期:</label>
                        <span className={classNames('cost-hour',{ active: this.state.costBool})} onTouchTap={this.costHandle.bind(this,'cost-hour')}>
                            <span className="pay">{dayCost+'金币'}</span>/天
                        </span>
                        <span> | </span>
                        <span className={classNames('cost-month',{ active: !this.state.costBool,del: this.state.freeDOM })} onTouchTap={this.costHandle.bind(this,'cost-month')}>
                            <span className="pay">{monthCost+'金币'}</span>/月
                        </span>
                    </div>
                    <div className="button" onTouchTap={this.createHandle}>创 建</div>
                </div>
            </div>
        )
    },
    renderView: function(){
        var html = [];
        for(var each in lists){
            html.push(
                    <div data-location={each} key={each} ref={lists[each]['server']}
                         className={classNames('addVPN-content', {active: this.state.contentBool == lists[each]['server']})}
                         onTouchTap={this.touchTapHandle.bind(this,[lists[each]['server'],lists[each]['month'],lists[each]['day']])}>
                        <span>{lists[each]['type']}</span>
                        <div className="addVPN-detail">
                            <i className={lists[each]['icon']} />
                            <span>{lists[each]['city']}</span>
                            <span>{lists[each]['country']}</span>
                        </div>
                        <span className="hr" />
                        <span className="server">{lists[each]['server']}</span>
                        <span className="day-pay">
                            <span>{lists[each]['day']}</span>/天
                        </span>
                        <span className="month-pay">
                            <span>{lists[each]['month']}</span>/月
                        </span>
                    </div>
            );
        }
        return html
    },
    touchTapHandle: function(evt){
        if(store.firstTime){
            $('#tutorial-step').removeAttr('id');
            $('.cost-hour')[0].setAttribute('id','tutorial-step')
        }
        if(evt[1] == lists[0]['month']){
            this.setState({freeDOM:true,costBool:true,contentBool:evt[0],monthCost:evt[1],dayCost:evt[2]})
        }else{
            this.setState({freeDOM:false,costBool:store.account['payCycle'] == 'day',contentBool:evt[0],monthCost:evt[1],dayCost:evt[2]})
        }
    },
    costHandle: function(evt){
        if(store.firstTime){
            $('#tutorial-step').removeAttr('id');
            $('.button')[0].setAttribute('id','tutorial-step')
        }
        if(this.state.freeDOM && evt == 'cost-month'){
            this.setState({costBool:true})
        }else{
            this.setState({costBool:evt == 'cost-hour'})
        }
    },
    createHandle: function(){
        var cost = this.state.costBool ? this.state.dayCost : this.state.monthCost;
        var payCycle = this.state.costBool ? 'day' : 'month';
        var labelTime = payCycle == 'day'? '/天':'/月';
        if(cost != '---' && tapped == false){
                tapped = true;
                setTimeout(function(){
                    tapped = false;
                },1000);
                if(store.account['run'] == 1 && store.account['vpnServer'] != 'free' && cost != '0金币' ){
                    if(store.account['payCycle'] == payCycle){
                        var changeCost = 0;
                        if(parseInt(cost) > store.account['maxCost']){
                            changeCost = parseInt(cost) - store.account['maxCost']
                        }
                        if(confirm('您之前的VPN服务还未到期,您确定花费'+changeCost+'金币切换服务器?')){
                            $.ajax({
                                type: "get",
                                url: serverUrl+"/changeVPN",
                                data:{
                                    uniqueID: this.props.uniqueID,
                                    server: this.state.contentBool,
                                    payCycle: payCycle
                                },
                                dataType:'jsonp',
                                success: function(data){
                                    if(data['code'] == 200){
                                        PubSub.publish('activate',data['content']);
                                    }else{
                                        alert(data['content'])
                                    }
                                }
                            });
                        }
                    }else{
                        if(confirm('您之前的VPN服务还未到期,是否重新创建'+cost+labelTime+'的VPN服务?')){
                            $.ajax({
                                type: "get",
                                url: serverUrl+"/insertVPN",
                                data:{
                                    uniqueID: this.props.uniqueID,
                                    server: this.state.contentBool,
                                    payCycle:payCycle
                                },
                                dataType:'jsonp',
                                success: function(data){
                                    if(data['code'] == 200){
                                        PubSub.publish('activate',data['content']);
                                    }else{
                                        alert(data['content'])
                                    }
                                }
                            });
                        }
                    }
                }else{
                    if(confirm('是否创建'+cost+labelTime+'的VPN服务')) {
                        $.ajax({
                            type: "get",
                            url: serverUrl + "/insertVPN",
                            data: {
                                uniqueID: this.props.uniqueID,
                                server: this.state.contentBool,
                                payCycle: payCycle
                            },
                            dataType: 'jsonp',
                            success: function (data) {
                                if (data['code'] == 200) {
                                    PubSub.publish('activate', data['content']);
                                } else {
                                    alert(data['content'])
                                }
                            }
                        });
                    }
                }
            }
        }
});

module.exports = addVPN;