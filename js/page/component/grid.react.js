var React = require('react');
var PubSub = require('pubsub-js');

var Grid = React.createClass({
    getInitialState: function(){
        return {
            className:'grid-list'
        }
    },
    render: function(){
        return (
            <div className={this.state.className} onTouchStart={this.circleDown} onTouchEnd={this.circleUp} onTouchTap={this.circleTap}>
                <i className={this.props.icon} style={{color:this.props.color || ''}} />
                <span>{this.props.text}</span>
            </div>
        )
    },
    circleDown: function(){
        this.setState({className:'grid-list active'});
    },
    circleTap: function(){
        PubSub.publish('changePage',this.props.text)
    },
    circleUp: function(){
        this.setState({className:'grid-list'});
    }
});

module.exports = Grid;