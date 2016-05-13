var React = require('react');
var ScrollView = require('../ScrollView.react');

var broadcast = React.createClass({
    getInitialState: function(){
        return {
            className:'broadcast'
        }
    },
    componentDidMount: function(){
        var self = this;
        setTimeout(function(){
            self.setState({className:'broadcast active'})
        },100)
    },
    render: function(){
        return (
            <div className={this.state.className} onTouchTap={this.close}>
                <div>
                    <span>{this.props.content}</span>
                </div>
            </div>
        )
    },
    close: function(){
        var self = this;
        self.setState({className:'broadcast'});
        setTimeout(function(){
            self.props.close()
        },500)
    }
});

module.exports = broadcast;