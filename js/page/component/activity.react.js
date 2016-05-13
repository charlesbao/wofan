var React = require('react');
var ScrollView = require('../ScrollView.react');
var store = require('../../store');

var activity = React.createClass({
    getInitialState: function(){
        return {
            content:[]
        }
    },
    componentDidMount: function(){
        var self = this;
        $.ajax({
            url:store.serverUrl+'/activity',
            type: "get",
            dataType:'jsonp',
            success: function(data){
                if(data['code'] == 200){
                    self.setState({content:data['content']})
                }
            }
        });
    },
    render: function(){
        return (
            <div className="activity">
                <ScrollView ref='scroller' style={{
                    height:document.documentElement.clientHeight
                }}>
                    <div className="activityBanner"><span>近期活动</span></div>
                    {this.renderView()}
                </ScrollView>
            </div>
        )
    },
    renderView: function(){
        var arr = [];
        this.state.content.map(function(each,key){
            arr.push(
                <div key={key} className="activityList">
                    <img src={store.staticPath+"wofan.jpg"} />
                    <div>
                        <span>{each['title']}</span>
                        <span>{each['content']}</span>
                        <span>{each['date']}</span>
                    </div>
                </div>
            )
        });
        return arr
    }
});

module.exports = activity;