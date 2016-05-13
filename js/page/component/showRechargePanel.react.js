var React = require('react');
var List = require('./list.react');
var store = require('../../store');
var orders = '0'+moment().format("YYYYMMHHmms");
var showRechargePanel = React.createClass({
    getInitialState: function(){
        return {
            className:'rechargePanel'
        }
    },
    render: function(){
        return (
            <div className={this.state.className}>
                <div>
                    <h1>我翻账单</h1>
                    <List style={{
                        border: '2px solid'
                    }}  label="充值账户" span={this.props.account}/>
                    <List style={{
                        border: '2px solid',
                        marginBottom: 50
                    }} label="金额" span={this.props.rechargeValue + '金币'}/>
                    <List style={{
                        border: '2px solid #DC7474',
                    }} label="售价" span={this.props.cost + '元'}/>
                    <div className="button" onTouchTap={this.payHandle}>确认支付</div>
                    <div className="button" style={{background:'gray'}} onTouchTap={this.touchHandle}>取消</div>
                </div>
            </div>
        )
    },
    payHandle: function(){
        $.ajax({
            type: "get",
            url: "http://wofan.miaoxueshu.com/pay",
            data:{
                openid:$("#main").attr('data-id'),
                pay:this.props.cost
            },
            dataType:'jsonp',
            success: function(charge){
                pingpp.createPayment(charge, function(result, err){
                    if (result == "success") {
                        alert('付款成功');
                        var self = this;
                        this.setState({className:'rechargePanel close'});
                        setTimeout(function(){
                            self.props.close()
                        },500)
                    } else if (result == "fail") {
                        alert('支付失败')
                    } else if (result == "cancel") {
                        // 微信公众账号支付取消支付
                    }
                });
            }
        })
    },
    touchHandle: function(){
        var self = this;
        this.setState({className:'rechargePanel close'});
        setTimeout(function(){
            self.props.close()
        },500)
    }
});

module.exports = showRechargePanel;