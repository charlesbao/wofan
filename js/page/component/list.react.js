var React = require('react');

var list = React.createClass({
    getInitialState: function(){
        return {
            span:this.props.span
        }
    },
    render: function() {
        if(this.props.span != null && this.props.label != null){
            if(this.props.copy){
                return (
                    <div className="list-item" data-clipboard-text={this.props.span} style={this.props.style || {}}>
                        <label>{this.props.label}</label>
                        <span style={this.props.spanStyle} onTouchTap={this.copyHandle}>{this.state.span}</span>
                    </div>
                )
            }else{
                return (
                    <div className="list-item" style={this.props.style || {}}>
                        <label>{this.props.label}</label>
                        <span style={this.props.spanStyle} onTouchTap={this.props.touchHandle}>{this.props.span}</span>
                    </div>
                )
            }
        }else if(this.props.input != null){
            return (
                <input className="list-item input" style={this.props.style || {}} type={this.props.type} placeholder={this.props.placeholder || ''}/>
            )
        }else if(this.props.label != null){
            return (
                <label className="list-item label_one" style={this.props.style || {}}>{this.props.label}</label>
            )
        }else{
            return (
                <div></div>
            )
        }
    },
    copyHandle: function(){
        this.setState({span:'已复制到剪切板'});
        var self = this;
        setTimeout(function(){
            self.setState({span:self.props.span})
        },1000)
    }
});

module.exports = list;