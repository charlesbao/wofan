var React = require('react');
var PubSub = require('pubsub-js');

var RechargeGrid = React.createClass({
    getInitialState: function(){
        var className = "recharge-grid"
        if(this.props.clicked){
            className = "recharge-grid active"
        }
        return {
            className:className
        }
    },
    render : function() {
        return (
            <div ref="grid" className={this.state.className} onTouchTap={this.touchHandle} >
                <div>
                    <span>{this.props.money+'金币'}</span><span>{'售价:'+this.props.cost+'元'}</span>
                </div>
            </div>
        )
    },
    touchHandle: function(){
        $('.recharge-grid').removeClass('active');
        $(this.refs.grid).addClass('active')
        this.props.tap([this.props.money,this.props.cost])
    }
});

module.exports = RechargeGrid;