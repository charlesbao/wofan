var React = require('react');
var ScrollView = require('../ScrollView.react');
var store = require('../../store');
var List = require('../component/list.react');

var about = React.createClass({
    getInitialState: function(){
        return {
            className:''
        }
    },
    render: function(){
        return (
            <div>
                <ScrollView style={{
                    height:document.documentElement.clientHeight
                }}>
                    <div className="about">
                        <div>
                            <div className="section">
                                <div className="imgSection">
                                    <img src={store.staticPath+'rocket.png'} />
                                    <span>版本号 v1.5.2.132</span>
                                </div>
                            </div>
                            <div style={{
                            textAlign:'left'
                            }}>
                                <List label="联系客服" style={{
                                margin:0,
                                marginBottom:10
                                }} />
                                <List label="客服微信" span="bhcarl0319" />
                                <List label="微信服务号" span="wofanvpn" />
                                <List label="合作邮箱" span="support@wofan.club" spanStyle={{fontSize:15}} />
                            </div>
                            <div className="button">
                                <div className={this.state.className} onTouchStart={this.circleDown} onTouchEnd={this.circleUp} onTouchTap={this.circleTap}>解绑账户</div>
                            </div>
                        </div>
                    </div>
                </ScrollView>
            </div>
        )
    },
    circleDown: function(){
        this.setState({className:'active'})
    },
    circleTap: function(){
        if(confirm('解除绑定之后您的现有账户将会被删除,确定这么做么?')){
            $.ajax({
                type: "get",
                url: "http://wofan.miaoxueshu.com/delUser",
                data:{
                    openid:$("#main").attr('data-id'),
                    uid:store.account.uniqueID
                },
                dataType:'jsonp',
                success: function(data){
                    if(data['code'] == 200){
                        window.localStorage.clear();
                        wx.closeWindow()
                    }else{
                        alert('解绑失败')
                    }
                }
            });

        }
    },
    circleUp: function(){
        this.setState({className:''})
    }
});

module.exports = about;