var lists = [
    {
        type:'美国VPN节点',
        city: '凤凰城',
        country: '共享网速|需每日激活',
        month: '---',
        day: '0金币',
        icon: 'fonticon_us',
        server:'free'
    },{
        type:'美国VPN节点',
        city: '洛杉矶',
        country: '南美专线|无限制网速',
        month: '2000金币',
        day: '120金币',
        icon: 'fonticon_us',
        server:'los'
    },{
        type:'美国VPN节点',
        city: '拉斯维加斯',
        country: '北美专线|无限制网速',
        month: '2000金币',
        day: '120金币',
        icon: 'fonticon_us',
        server:'las'
    },{
        type:'欧洲VPN节点',
        city: '荷兰',
        country: '西欧专线|节点加速',
        month: '2500金币',
        day: '150金币',
        icon: 'fonticon_nl',
        server:'nether'
    },{
        type: '日本VPN节点',
        city: '东京',
        country: '10M独享|节点加速',
        month: '3000金币',
        day: '200金币',
        icon: 'fonticon_jp',
        server:'japan'
    }
];

var tutorials = {
    setting:{
        height:3795/414 * screen.width,
        src:[
            'tutorials/setting/1.jpg',
            'tutorials/setting/2.jpg',
            'tutorials/setting/3.jpg',
            'tutorials/setting/4.jpg',
            'tutorials/setting/5.jpg',
            'tutorials/setting/6.jpg'
        ]
    },
    ios:{
        height:4062/414 * screen.width,
        src:[
            'tutorials/setting/4.jpg',
            'tutorials/setting/6.jpg',
            'tutorials/ios/1.jpg',
            'tutorials/ios/2.jpg',
            'tutorials/ios/3.jpg',
            'tutorials/ios/4.jpg'
        ]
    },
    android:{
        height:4905/414 * screen.width,
        src:[
            'tutorials/setting/4.jpg',
            'tutorials/setting/6.jpg',
            'tutorials/android/1.png',
            'tutorials/android/2.png',
            'tutorials/android/3.png',
            'tutorials/android/4.png',
            'tutorials/android/5.png'
        ]
    },
    windows:{
        height:3790/414 * screen.width,
        src:[
            'tutorials/setting/4.jpg',
            'tutorials/setting/6.jpg',
            'tutorials/windows/1.jpg',
            'tutorials/windows/2.jpg',
            'tutorials/windows/3.jpg',
            'tutorials/windows/4.jpg',
            'tutorials/windows/5.jpg',
            'tutorials/windows/6.jpg',
            'tutorials/windows/7.jpg'
        ]
    },
    mac:{
        height:3464/414 * screen.width,
        src:[
            'tutorials/setting/4.jpg',
            'tutorials/setting/6.jpg',
            'tutorials/mac/1.jpg',
            'tutorials/mac/2.jpg'
        ]
    }
};

var store = {
    vpnList:lists,
    serverUrl:'http://wofan.miaoxueshu.com', //http://45.63.124.191:8787/
    account:{},
    staticPath:'/static/client/style/',  //'/static/client/style/' /how2vpn/react/style/
    init:false,
    firstTime:false,
    tutorials:tutorials
};

module.exports = store;