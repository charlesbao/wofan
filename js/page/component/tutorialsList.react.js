var React = require('react');

var tutorialsList = React.createClass({
    getInitialState: function(){
        return {
            className:'tutorialsList'
        }
    },
    render: function(){
        return (
            <div className={this.state.className} style={this.props.style} onTouchStart={this.circleDown} onTouchEnd={this.circleUp} onTouchTap={this.touchHandle}>
                <i><img src={this.props.img} /></i>
                <span>{this.props.label}</span>
            </div>
        )
    },
    circleDown: function(){
        this.setState({className:'tutorialsList active'})
    },
    circleUp: function(){
        this.setState({className:'tutorialsList'})
    },
    touchHandle: function(){
        if(this.props.href.indexOf('http') == 0){
            window.location.href = this.props.href
        }else{
            this.props.open(this.props.href)
        }
    }
});

module.exports = tutorialsList;