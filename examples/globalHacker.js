/**
 * for solve bug:https://pms.uniontech.com/zentao/bug-view-61451.html
 */

new HACKER.viewmodel({
    bindRoute: '/zone/detail',
    reqInterceptor: [
        {
            url: ['/api/admin/scene_config/'],
            method: 'patch',
            formData:{
                'ntp_server':(v)=>v.trim()==''?location.hostname:v,
                'clock_sync_config.ntp_server':(v)=>v.trim()==''?location.hostname:v
            }
        }

    ]
    
})


/**
 * 解决消息管理下发消息，点击选择区域按钮，弹出的树组件，在非一级节点点击后按钮内容为空的问题
 */

new HACKER.viewmodel({
    bindRoute: '/message/client/send',
    mouseClick:{
        
    }
    
})