var React = require('react');
var ScrollView = require('../ScrollView.react');
var TutorialsList = require('../component/tutorialsList.react');
var List = require('../component/list.react');
var Frame = require('./showFrame.react');
var store = require('../../store');

var tutorials = React.createClass({
    getInitialState: function(){
        return {
            href:''
        }
    },
    render: function(){
        return (
            <div className="tutorials">
                <ScrollView ref='scroller' style={{
                    height:document.documentElement.clientHeight
                }}>
                    <TutorialsList style={{
                        marginTop:20
                    }} label="VPN平台创建教程" img={store.staticPath+'img/caution.png'} href="setting" open={this.open} />
                    <List label="连接教程" style={{
                            marginBottom: 0
                    }} />
                    <TutorialsList label="Windows系统" img={store.staticPath+'img/windows.png'} href="windows" open={this.open} />
                    <TutorialsList label="Android系统" img={store.staticPath+'img/android.png'}  href="android" open={this.open} />
                    <TutorialsList label="MAC系统" img={store.staticPath+'img/mac.png'} href="mac" open={this.open} />
                    <TutorialsList label="IOS系统" img={store.staticPath+'img/ios.png'} href="ios" open={this.open} />
                    <List label="测试网站" style={{
                            marginBottom: 0
                    }} />
                    <TutorialsList label="GOOGLE" img={store.staticPath+'img/shop.png'} href="http://www.google.com" />
                    <TutorialsList label="YOUTUBE" img={store.staticPath+'img/gas.png'} href="http://www.youtube.com" />
                    <TutorialsList label="TWITTER" img={store.staticPath+'img/heart.png'} href="http://www.twitter.com" />
                </ScrollView>
                {this.showFrame()}
            </div>
        )
    },
    close: function(){
        this.setState({href:''})
    },
    open: function(data){
        this.setState({href:data})
    },
    showFrame: function(){
        if(this.state.href == ''){
            return <div></div>
        }else{
            return <Frame href={this.state.href} close={this.close} />
        }
    }
});

module.exports = tutorials;