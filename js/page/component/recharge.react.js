var React  = require('react');
var ScrollView = require('../ScrollView.react')
var List = require('./list.react');
var Grid = require('./rechargeGrid.react');

var store = require('../../store');
var action = require('../../action');
var Recharge = React.createClass({
    getInitialState: function(){
        return {
            rechargeValue:200,
            cost:2,
            renderPanel: false,
            money:0,
            className:'button'
        }
    },
    render: function(){
        var payTime = store.account['payTime'] == 'day'?'天':'月';
        return (
            <div className="recharge">
                <ScrollView ref='scroller' style={{
                    height:document.documentElement.clientHeight
                }}>
                    <div className="panel" style={{
                        height:100
                    }}>
                        <div>
                            <div>
                                <span>{store.account['money']+'金币'}</span>
                                <span style={{fontWeight:'bold'}}>账户余额</span>
                            </div>
                        </div>
                    </div>
                    <div style={{
                        padding: '0px 5px'
                    }}>
                        <List label="充值账号" />
                        <List label="充值账户" span={store.account['username']}/>
                        <List label="充值金额" span={this.state.rechargeValue + '金币'}/>
                        <List label="请选择充值金额" />
                    </div>
                    <div className="recharge-Lists">
                        <Grid money="200" cost="2" clicked={true} tap={this.gridTap} />
                        <Grid money="1000" cost="10" tap={this.gridTap} />
                        <Grid money="2000" cost="20" tap={this.gridTap} />
                        <Grid money="3000" cost="28" tap={this.gridTap} />
                        <Grid money="5000" cost="45" tap={this.gridTap} />
                        <Grid money="10000" cost="85" tap={this.gridTap} />
                    </div>
                    <div style={{
                        padding: '0px 15px'
                    }}>
                        <span className={this.state.className} onTouchStart={this.circleDown} onTouchEnd={this.circleUp} onTouchTap={this.touchHandle}>确认付款</span>
                    </div>
                </ScrollView>
            </div>
        )
    },
    gridTap: function(data){
        this.setState({rechargeValue:data[0],cost:data[1]})
    },
    circleDown: function(){
        this.setState({className:'button active'});
    },
    circleUp: function(){
        this.setState({className:'button'});
    },
    touchHandle: function(){
        var self = this;
        self.setState({className:'button'});
        $.ajax({
            type: "get",
            url: store.serverUrl+"/pay",
            data:{
                openid:$("#main").attr('data-id'),
                uid:store.account['uniqueID'],
                pay:this.state.cost,
                money:this.state.rechargeValue
            },
            dataType:'jsonp',
            success: function(charge){
                pingpp.createPayment(charge, function(result, err){
                    if (result == "success") {
                        $.ajax({
                            url:store.serverUrl+'/pay',
                            type: "get",
                            dataType:'jsonp',
                            data:{
                                openid: $("#main").attr('data-id'),
                                pay:self.state.cost,
                                uid:store.account['uniqueID'],
                                order:'success'
                            },
                            success: function(data){
                                action.setAccount(data['content'])
                                self.setState({money:data['content']['money']})
                            }
                        });
                    } else {
                        $.ajax({
                            url:store.serverUrl+'/pay',
                            type: "get",
                            dataType:'jsonp',
                            data:{
                                openid: $("#main").attr('data-id'),
                                pay:self.state.cost,
                                uid:store.account['uniqueID'],
                                order:'fail'
                            }
                        });
                    }
                });
            }
        });
    }
});

module.exports = Recharge;