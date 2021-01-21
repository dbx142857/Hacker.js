function execFunctionOrOther(value, ...restArgs) {

    if (typeof (value) != 'function') {
        return value
    } else {
        return value.apply(this, restArgs)
    }

}
HACKER.viewmodel = class {
    _initInterceptor() {
        let self = this
        let reqXhookArr = this.$options.reqInterceptor || [],
            resXhookArr = this.$options.resInterceptor || [];

        function handleParamsAndDataWhenGet(hookConfig, request, isFetch) {
            if ([].concat(hookConfig.url).find((u) => request.url.includes(u))) {
                // HACKER.doNothing('request in xhook--:', request)

                let params = hookConfig.params || {};
                let urlObj = HACKER.urlToObj(request.url)
                for (let i in params) {
                    let fun = params[i];
                    if (typeof fun == 'function') {
                        fun = fun(self, urlObj, isFetch)
                    }
                    // HACKER.doNothing('fun and urlObj--:',fun,urlObj,i,isFetch)
                    HACKER.setDataByModel(urlObj, i, fun)
                }
                


                let resUrl = request.url.split('?')[0] + '?' + HACKER.formateObjToParamStr(urlObj)
                // if (!isFetch && !HACKER.isFetchRequest(request)) {
                //     request.url = resUrl+'&foooooooooo=barrrrrrrr'
                // }
                return resUrl;
                // HACKER.doNothing('formateObjToParamStr result--:',HACKER.formateObjToParamStr(urlObj))
            } else {
                return request.url
            }
        }


        reqXhookArr.forEach((hookConfig) => {

            if (!'url' in hookConfig) {
                throw 'url in Interceptor is required';
                // return false;
            }

            hookConfig.isFetch = 'isFetch' in hookConfig ? (hookConfig.isFetch) : false;


            if (hookConfig.isFetch == false || hookConfig.isFetch == 'BOTH') {
                
                xhook.before(function (request, cb) {
                    
                    try {

                        

                        

                        if('GET'==request.method.toUpperCase()){
                            handleParamsAndDataWhenGet(hookConfig, request, false)
                        }else if('hook' in hookConfig){
                            hookConfig.hook(request)
                            // console.log('not a get request in hook--:', request)
                        }else if(request.body instanceof FormData && 'formData' in hookConfig){
                            let formData=request.body,mergedFd=hookConfig.formData
                            for (var key of formData.keys()) {
                                let v=formData.get(key)
                                try{
                                    v=JSON.parse(v)
                                }catch(e){
        
                                }
        
                                if(typeof(v)=='object' && v!=null){
                                    console.log('key and v---:',key,v)
                                    for(let i in mergedFd){
                                        let arr=i.split('.');
                                        if(arr.length==1 && i in v){
                                            v[i]=mergedFd[i](v[i])//

                                        }
                                        if(arr.length>1){
                                            let firstKey=arr[0],otherKey=arr.slice(1).join('.')
                                            if(firstKey in v){
                                                // alert(otherKey)
                                                let val=HACKER.getDataByModel(v[firstKey],otherKey,-1);
                                                if(val!=-1){
                                                    // alert(val)
                                                    HACKER.setDataByModel(v[firstKey],otherKey,mergedFd[i](val))
                                                }
                                            }
                                        }
                                    }
                                    
                                    // if('ntp_server' in v && v.ntp_server.trim()==''){
                                    //     v.ntp_server=location.hostname
                                    // }
                                    // if(v.clock_sync_config && v.clock_sync_config.ntp_server && v.clock_sync_config.ntp_server.trim()==''){
                                    //     v.clock_sync_config.ntp_server=location.hostname
                                    // }
        
                                    v=JSON.stringify(v)
        
                                }
        
                                formData.set(key,v)
        
                                console.log('value of '+key+':',v,typeof(v),v instanceof FormData)
                                // console.log("key:" + key + " value:" + formData.get(key));
                            }
                        }

                        


                    } catch (e) {
                        console.error('eeeeeeee--------:', e)

                    } finally {
                        cb()
                    }


                });
            }

            if (hookConfig.isFetch == true || hookConfig.isFetch == 'BOTH') {
                HACKER.xhookFetch.before.splice(0, 0, (url) => {
                    if('GET'==request.method.toUpperCase()){
                        return handleParamsAndDataWhenGet(hookConfig, { url: url }, true)
                    }
                    

                })
            }



        })
    }
    useWaitResult(initialValue) {


        return {
            value: initialValue,
            __HACKER_STATE_UPDATE_TYPE: 'USE_POLL_RESULT'
        }
    }
    setState(obj) {
        for (let i in obj) {
            HACKER.$bus.routeData[i] = obj[i]
            this.state[i] = obj[i]
        }
    }
    $nextTick(fun) {
        setTimeout(fun)
    }
    _updateSmartState() {
        if (!this.smartStateDef) {
            this.smartStateDef = { ...this.$options.smartState }
            this.smartState = this.$options.smartState

        }
        this._funObj2NormalObj(this.smartState, this.smartStateDef)
    }
    _funObj2NormalObj(obj, objFun) {
        HACKER.doNothing('objFun in _funObj2NormalObj--:', objFun)
        for (let i in obj) {
            obj[i] = objFun[i].call(this)
        }
    }
    _renderReplacer() {
        let renderWrapper = () => {
            let res = []
            this.$options.replacer.forEach((replacerConfig) => {
                let controller=replacerConfig.controller||{};

                let $obj = HACKER.parseDom(HACKER.getDomWrapperByContents(replacerConfig.render.call(this)),controller,this);
                
                // if(controller && controller.refListeners){
                //     for (let i in controller.refListeners) {
                //         for(let j in controller.refListeners[i]){
                //             let obj=controller.refListeners[i][j];
                //             // HACKER.doNothing('obj--------:',obj)
                            
                //                 // HACKER.doNothing("k and obj[k--:",k,obj[k])
                //                 this.$refs[i].addEventListener(j, () => {
    
                //                     obj.call(controller)
                //                 })
                            
                //         }

                //     }
                // }

                res.push($obj)
                if (replacerConfig.newAlias) {
                    this.$doms[replacerConfig.newAlias] = $obj
                }
                // var target = HACKER.$.$('.m-subheader__breadcrumbs')//
                var target = typeof(replacerConfig.target)=='string'?(document.querySelector(replacerConfig.target)):(replacerConfig.target.call(this))

                if(!target){
                    return false
                }

                this._defaultExistingElementsDisplayMap = this._defaultExistingElementsDisplayMap || new Map()
                if (!this._defaultExistingElementsDisplayMap.has(target)) {
                    this._defaultExistingElementsDisplayMap.set(target, target.style.display)
                }




                // HACKER.doNothing('$obj--:', $obj)
                if (replacerConfig.oldAlias) {
                    this.$doms[replacerConfig.oldAlias] = target;
                }

                let shouldKeep = target.closest('.HACKER-ROUTE-WRAPPER') ? 1 : 0

                if (shouldKeep == 1) {

                    // let defaultDisplay = target.style.display
                    this
                        ._offHook('beforeDestroy', 'RENDER_REPLACER')
                        ._regHook('beforeDestroy', () => {
                            // alert(this._defaultExistingElementsDisplayMap.get(target))
                            target.style.display = this._defaultExistingElementsDisplayMap.get(target)
                        }, 'RENDER_REPLACER')
                }

                target.dataset._keep = shouldKeep




                // this.$doms.$defaultMenu = jQuery('.m-subheader__breadcrumbs')
                
                
                console.log('fucku target--:',target)
               
                HACKER.insertAfter($obj, target)
                // $obj.parentNode.insertBefore($obj, $obj.parentNode.childNodes[0])
                

                target.style.cssText=replacerConfig.targetCssText||''
                target.style.display = replacerConfig.showTarget?target.style.display:'none'

                

                function removeObj() {
                    $obj.parentNode.removeChild($obj)
                }

                this
                    ._emitHook('againParsed', 'RENDER_REPLACER')
                    ._offHook('againParsed', 'RENDER_REPLACER')
                    ._regHook('againParsed', removeObj, 'RENDER_REPLACER')
                    // ._offHook('beforeDestroy', 'RENDER_REPLACER')
                    ._regHook('beforeDestroy', removeObj, 'RENDER_REPLACER')
                // this.$bus.once(['B_POP_STATE' + uniqueBueFlag], () => {


                //     HACKER.doNothing('$obj in pop state--:', $obj)


                //     $obj.parentNode.removeChild($obj)
                //     // this.$doms.menuWrapper.remove()

                //     // renderWrapper()
                // })

                // $obj = $($obj)
                // $obj.insertAfter(this.$doms.$defaultMenu.hide())
            })
            // this._domsCreatedByRenderReplacer = res;
            return res
        }




        renderWrapper()

    }
    _regHook(hookName, fn, flag) {
        this._registeredHookActions = this._registeredHookActions || {}
        this._registeredHookActions[hookName] = this._registeredHookActions[hookName] || []
        this._registeredHookActions[hookName].push(fn)
        fn[flag] = true;
        // if (hookName == 'beforeDestroy' || hookName == 'firstParsed') {
        //     HACKER.$bus.on('B_POP_STATE' + uniqueBusName, () => {
        //         this.$nextTick(() => {
        //             delete this._registeredHookActions[hookName]
        //         })
        //     })
        // }else if (hookName == 'againParsed') {
        //     HACKER.$bus.on('B_RE_PARSE', () => {
        //         this.$nextTick(() => {
        //             delete this._registeredHookActions[hookName]
        //         })
        //     })
        // }
        return this
    }
    _offHook(hookName, flag) {
        if (!flag) {
            this._registeredHookActions[hookName].length = 0
        } else if (this._registeredHookActions && Array.isArray(this._registeredHookActions[hookName])) {
            this._registeredHookActions[hookName] = this._registeredHookActions[hookName].filter((fn) => (!(flag in fn)))
        }
        return this
    }
    _emitHook(hookName, flag) {
        if (!this._registeredHookActions || !this._registeredHookActions[hookName]) {
            return this;
        }
        this._registeredHookActions[hookName].filter((fn) => {
            return !flag ? true : (flag in fn)
        }).forEach((fun) => {
            fun.call(this)
        })

        return this;
    }
    
    async restartHacker() {


        await HACKER.dealyExec();
        this.pollResult=await HACKER.poll(this.$options.waitUntil);

        this._pollResultForState.forEach((key) => {
            HACKER.setRouteData({
                [key]: this.pollResult
            })
        })
        // await HACKER.poll(() => HACKER.$.$('.mat-datepicker-toggle-default-icon'));

        HACKER.xhookFetch.reset()
        xhook.clearHooks()
        HACKER.$bus.emit('B_RE_PARSE')
        HACKER.parseDom()


        this._updateSmartState.call(this)
        this.$options.againParsed.call(this)
        this._initInterceptor.call(this)
        // this.$options.xhook.call(this)

        this.$nextTick(()=>{
            this._renderReplacer.call(this)
        })
        

    }

    _generateUniqueKeyByPathName(){
        return HACKER.generateUniqueKeyByPathName(this.$options.bindRoute)

    }
    constructor($options) {
        this.pollResult=null;

        let directiveSuper = new HACKER.directiveSuper()
        
        if (!$options.bindRoute) {
            alert('bineRoute config is required')
            return false;
        }
        let uniqueBusName = this._generateUniqueKeyByPathName.call({$options:$options})
        this._uniqueBusName = uniqueBusName
        this._elements = []
        this.h = directiveSuper.h.bind(this)
        this.popup = directiveSuper.popup.bind(this)
        this.$doms = {

        }
        this.HACKER=HACKER;

        HACKER.$bus.on('B_POP_STATE' + uniqueBusName, () => {

            this._emitHook.call(this, 'beforeDestroy')
            this.$options['beforeDestroy'].call(this)
            setTimeout(() => {
                delete this._registeredHookActions
            })


            for (let i in this.$doms) {
                let isKeep = false, isJqueryEle = this.$doms[i] instanceof window.jQuery
                if (isJqueryEle) {
                    isKeep = this.$doms[i].get(0).dataset._keep
                } else {
                    isKeep = this.$doms[i].dataset._keep
                }


                if (isKeep != '1') {
                    if (this.$doms[i] instanceof window.jQuery) {
                        this.$doms[i].remove()
                    } else {
                        this.$doms[i].parentNode.removeChild(this.$doms[i])
                    }
                }

                // delete this.$doms[i]


            }
            this.$doms = {

            }
        })




        let defaultOptions = {
            reqInterceptor: [],
            resInterceptor: [],
            replacer: [],
            againParsed() { },
            xhook() { },
            beforeDestroy() { },
            styles: '',
            bindRoute: null,
            domContext: () => document.body,
            // render() {

            // },
            state() {
                return {}
            },
            methods: {},
            mouseClick:{},
            reloadTrigger: null,
            waitUntil: () => true,
            firstParsed: () => { },
            mappingEvents: () => [],
            h: []
        }

        $options = this.$options = {
            ...defaultOptions,
            ...$options
        }
        for (let i in this.$options.methods) {
            this[i] = this.$options.methods[i].bind(this)
        }


        if (typeof (this.$options.bindRoute) == 'string') {
            if (HACKER.useHash) {
                this.$options.bindRoute = '#' + this.$options.bindRoute
            }

        } else {
            throw 'bindRoute只能是string类型'
        }










        let busOn = HACKER.busOn;
        let pollResultForState = []
        this._pollResultForState=pollResultForState;

        for (let i in HACKER.props.v) {
            this[i] = HACKER.props.v[i]
        }
        for (let i in HACKER.functions.v) {
            this[i] = HACKER.functions.v[i].bind(HACKER)
        }

        this.$ = HACKER.$.$;
        this.$$ = HACKER.$.$$;

        // HACKER.$bus.once('B_POP_STATE' + uniqueBusName, () => {
        //     this.beforeDestroy()
        // })
        HACKER.$bus.on('B_PUSH_STATE' + uniqueBusName, () => {
            busOn([].concat($options.reloadTrigger).filter((o) => !!o).map((o) => 'B_TARGET_CLICK_' + o.split('-').join('_').toUpperCase()),
            this.restartHacker.bind(this)
                );


            busOn('B_HACKER_READY' + uniqueBusName, async () => {

                this.busOn = HACKER.busOn;



                if (typeof (this.$options.firstParsed) == 'function') {
                    this._updateSmartState.call(this)

                    let pollResult = await HACKER.poll($options.waitUntil.bind(this));
                    this.pollResult=pollResult
                    HACKER.doNothing('shit this---:', this)

                    pollResultForState.forEach((key) => {
                        HACKER.setRouteData({
                            [key]: pollResult
                        })
                    })

                    HACKER.$.update($options.domContext(pollResult))

                    this.$refs = HACKER.$bus.routeData.$refs;

                    // $options.render.call(this, HACKER.h)




                    HACKER.mappingEvents($options.mappingEvents.call(this),
                        $.context,
                        0
                    )

                    if (HACKER.BX_MODE) {
                        window.HACKER['HACKER' + this._generateUniqueKeyByPathName.call(this)] = this
                    }


                    let styles = (function () {


                        let arr = execFunctionOrOther.call(this, $options.styles).split('}').slice(0, -1).map((s) => s + '}')//

                        return arr;
                        // return [].concat(execFunctionOrOther.call(this, $options.styles))
                    }).call(this);
                    if (styles.join('').trim() != '') {
                        styles.forEach((sty) => {
                            sty = sty.replaceAll('$$', '.' + 'HACKER_ROUTE_WRAPPER' + this._generateUniqueKeyByPathName.call(this))
                            HACKER.insertRule(sty)
                        })

                    }

                    this.$nextTick(() => {
                        this._renderReplacer.call(this)
                    })

                    this.$options.firstParsed.call(this, pollResult)
                }
                this._initInterceptor.call(this)
                // this.$options.xhook.call(this)
            }, false)


            let state = $options.state.call(this)

            this.state = HACKER.$bus.routeData

            for (let i in state) {
                if ('__HACKER_STATE_UPDATE_TYPE' in state[i]) {



                    let updateType = state[i]['__HACKER_STATE_UPDATE_TYPE']
                    if (updateType == 'USE_POLL_RESULT') {
                        HACKER.uniqullyPush2Arr(pollResultForState,i)
                        // pollResultForState.push(i)
                    }


                    this
                    ._offHook('againParsed', 'UPDATE_POLL_RESULT_'+i)
                    ._regHook('againParsed', ()=>{
                        state[i] = this.pollResult;
                    }, 'UPDATE_POLL_RESULT_'+i)

                    state[i] = state[i].value;

                }
            }
            //this.state原始值为HACKER.$bus.routeData,已经存在,所以此处只需要吧当前的state放入route state即可
            HACKER.setRouteData(state)
        })











    }

}