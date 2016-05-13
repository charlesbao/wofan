var serverUrl = 'http://wofan.miaoxueshu.com';
window.addEventListener("touchstart", function(e) {
    if (e.touches[0] && e.touches[0].target && e.touches[0].target.tagName.match(/input|textarea|select/i)) {return;}
    e.preventDefault();
}, false);

$(function(){
    checkVersion();
    weixinAPI();
});

function weixinAPI(){
    $.ajax({
        url:'http://wofan.miaoxueshu.com/getSignature',
        data:{'url':location.href.split('#')[0]},
        dataType:'json',
        success: function(data){
            wx.config({
                appId: data['appid'],
                timestamp: data['ts'],
                nonceStr: data['noncestr'],
                signature: data['sign'],
                jsApiList: [
                    'checkJsApi',
                    'onMenuShareTimeline',
                    'onMenuShareAppMessage',
                    'onMenuShareQQ',
                    'onMenuShareQZone',
                    'showMenuItems',
                    'hideOptionMenu'
                ]
            });
        }
    });
    wx.ready(function(){
        var sdata = {
            title: '我翻免费翻墙 · 翻墙好礼送不停',
            desc: '加入我翻免费畅想无障碍网络，关注即送3000金币翻墙红包！',
            link: 'http://wofan.miaoxueshu.com/intro',
            imgUrl: 'http://wofan.miaoxueshu.com/static/intro/image/wofan.jpg',
            success: function () {
                $.ajax({
                    url:'http://wofan.miaoxueshu.com/invite',
                    data:{'code':$('#main').attr('data-id')},
                    success: function(data){
                        if(data['code'] == 500){
                            if(data['length'] == 0){
                                alert('请先关注我翻平台，注册一个账户再分享哦~！')
                            }
                        }
                    }
                })
            }
        };
        wx.onMenuShareTimeline(sdata);
        wx.onMenuShareAppMessage(sdata);
        wx.onMenuShareQQ(sdata);
        wx.onMenuShareQZone(sdata);
        wx.hideOptionMenu();
        wx.showMenuItems({
            menuList:[
                'menuItem:share:appMessage',
                'menuItem:share:timeline',
                'menuItem:share:qq',
                'menuItem:share:QZone',
                'menuItem:addContact',
                'menuItem:profile'
            ]
        })
    });
}

function checkVersion(){
    $.ajax({
        type: "get",
        url: serverUrl+"/getVersion",
        dataType:'jsonp',
        success: function(data){
            if(window.localStorage.getItem('version') == data['version']){
                setTimeout(function(){
                    eval(window.localStorage.getItem('bundle'));
                },1000);
            }else{
                var activity = window.localStorage.getItem('activity')
                window.localStorage.clear();
                window.localStorage.setItem('activity',activity);
                window.localStorage.setItem('version',data['version']);
                localBundle();
            }
            if(window.localStorage.getItem('activity') == data['activity']){
                window.localStorage.setItem('activityBool',true);
            }else{
                window.localStorage.setItem('activityBool',false);
                window.localStorage.setItem('activity',data['activity'])
            }
        }
    });
}

function localBundle(){
    $.ajax({
        type: "get",
        url:serverUrl+'/static/client/bundle.min.js',
        success: function(data){
            window.localStorage.setItem('bundle', data);
        }
    });
}

