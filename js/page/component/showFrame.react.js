var React = require('react');
var ScrollView = require('../ScrollView.react');

var store = require('../../store');

var showFrame = React.createClass({
    getInitialState: function(){
        return {
            className:'framePanel',
            faClass:'fa fa-close'
        }
    },
    render: function(){
        return (
            <div className={this.state.className} >
                <ScrollView ref='scroller' style={{
                    height:document.documentElement.clientHeight - 55,
                    borderBottom: '2px dotted lightgray'
                }}>
                    {this.renderFrame()}
                </ScrollView>
                <div className={this.state.faClass} onTouchStart={this.circleDown} onTouchEnd={this.circleUp} onTouchTap={this.close}></div>
            </div>
        )
    },
    circleDown: function(){
        this.setState({faClass:"fa fa-close active"})
    },
    circleUp: function(){
        this.setState({faClass:"fa fa-close"})
    },
    close: function(){
        this.setState({className:'framePanel close',faClass:"fa fa-close"});
        var self = this;
        setTimeout(function(){
            self.props.close()
        },600)
    },
    renderFrame: function(){
        var theView = [];
        store.tutorials[this.props.href]['src'].map(function(each,key){
            theView.push(<img key={key} src={store.staticPath+each} />)
        });
        return (
            <div className="tutorialsDetail" style={{
            height:store.tutorials[this.props.href]['height']
            }}>
                {theView}
            </div>
        )
    }
});

module.exports = showFrame;