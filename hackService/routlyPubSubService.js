; (function () {

    // let useHash = false
    let HACKER = window.HACKER,
        HK = HACKER;//////
    let useHash = HACKER.useHash
    class EventEmitter {
        constructor() {
            this.events = {};

        }
        getTotalEventCount() {
            let res = 0
            for (let i in this.events) {
                res += this.events[i].length
            }
            return res;
        }
        on(event, callback) {


            if (Array.isArray(event)) {
                event.forEach((evt) => {
                    this.on(evt, callback)
                })
                return this;
            }

            const callbacks = this.events[event] || [];
            if (Array.isArray(callbacks)) {
                callbacks.push(callback);
                this.events[event] = callbacks;
            }
            return this;
        }
        off(event, callback) {

            // console.log('event in off---:', event)

            if (Array.isArray(event)) {
                event.forEach((evt) => {
                    // HACKER.doNothing('evt---:', evt, this)
                    this.off(evt, callback)
                })
                // HACKER.doNothing('callback--:', callback)
                // callback()
                return this;
            }

            // HACKER.doNothing('callback of single--:', callback)
            // if (!callback) {
            //     this.events[event] = []
            //     return this;
            // }

            const callbacks = !callback ? [] : ((this.events[event] || []).filter(
                (cb) => cb !== callback
            ));
            // if (HACKER.BX_MODE) {
            //     console['log']('off event--:', event, callback)
            // }
            if (callbacks.length == 0) {
                delete this.events[event]
            } else {
                this.events[event] = callbacks;
            }

            return this;
        }
        once(event, callback) {
            if (Array.isArray(event)) {
                event.forEach((evt) => {
                    this.once(evt, callback)
                })
                return this;
            }
            const wrap = (...args) => {
                typeof callback === "function" && callback.apply(this, args);
                this.off(event, wrap);
            };
            this.on(event, wrap);
            return this;
        }
        emit(event, ...args) {
            if (HACKER.BX_MODE) {
                console['lo' + 'g']('EMIT BUS---:', event)

            }
            const callbacks = this.events[event] || [];
            if (Array.isArray(callbacks)) {
                try {
                    // console.log('will emit--:', event)
                    callbacks.forEach((cb) => typeof cb === "function" && cb.apply(null, args.concat(event)));
                } catch (e) {
                    console['warn']('exec bus emit error--:', e)
                }

            }
            return this;
        }
    }

    let $bus = new EventEmitter()
    HACKER.$bus = $bus;



    HACKER.lastRouteFlag = null;

    function generateUniqueKeyByPathName(pathOrOldHash) {

        if (useHash) {
            if (pathOrOldHash && pathOrOldHash.startsWith('/')) {
                pathOrOldHash = '#' + pathOrOldHash
            }
            let res = '_' + ((pathOrOldHash || location.hash).split('#/')[1] || '').split('/').join('_').split('-').join('_').toUpperCase()

            return res
        }
        // 
        pathOrOldHash = pathOrOldHash || location.pathname

        if(HACKER.BUSINESS_CONFIG && 'routeUrlUniqueFlagGenerator' in HACKER.BUSINESS_CONFIG){
            pathOrOldHash= HACKER.BUSINESS_CONFIG.routeUrlUniqueFlagGenerator(pathOrOldHash)
        }

        return pathOrOldHash.split('/').join('_').split('-').join('_').toUpperCase()
    }
    HACKER.generateUniqueKeyByPathName = generateUniqueKeyByPathName;
    HACKER.currentRouteFlag = HACKER.generateUniqueKeyByPathName();

    function emitEventWhenPushState() {
        HACKER.currentRouteFlag = HACKER.generateUniqueKeyByPathName();

        // HACKER.doNothing('emit event busName--:', busName)

        //先触发push state，再触发parse ok工作
        let busName = 'B_PUSH_STATE' + HACKER.currentRouteFlag
        HACKER.$bus.emit(busName)


        HACKER.$bus.emit("B_AFTER_ROUTE_CHANGE")



    }
    function offEventBeforePushState(oldHash = null) {
        // HACKER.lastPathName = (location.href)

        // HACKER.doNothing('off event busName--:', busName)



        HACKER.lastRouteFlag = HACKER.generateUniqueKeyByPathName(oldHash)



        let busName = 'B_POP_STATE' + HACKER.lastRouteFlag
        HACKER.$bus.emit(busName)
        HACKER.$bus.emit('B_BEFORE_ROUTE_CHANGE')
        HACKER.xhookFetch.reset()
        xhook.clearHooks()
        // HACKER.$bus.off(busName)
    }







    function handleRouteChange(state, oldHash) {
        offEventBeforePushState(oldHash)

        HACKER.toggleUniqueClassForRouteWrapper()

        // HACKER.doNothing('href before--:', location.href)
        if (!useHash && typeof history.onpushstate == "function") {
            history.onpushstate({ state: state });
        }
        setTimeout(() => {
            emitEventWhenPushState()
            HACKER.toggleUniqueClassForRouteWrapper()
        }, 100)
    }



    if (useHash) {
        let hash = location.hash;
        setInterval(() => {
            let newHash = location.hash;
            if (newHash != hash) {
                console.log('hash changed')

                handleRouteChange(null, hash)
                hash = newHash
            }

        }, 50)
        // window.addEventListener('load', () => {
        //     document.body.onhashchange = function () {
        //         alert('hash change')
        //         handleRouteChange()
        //     }
        // })



    } else {
        ; (function (history) {
            window.addEventListener('popstate',(state)=>{
                // console.log('p1 and p2--:',p1,p2)
                handleRouteChange(state,HACKER.currentRouteFlag)

            });
            var pushState = history.pushState;
            // var popState=history.popState;
            history.pushState = function (state) {
                handleRouteChange(state)
                // HACKER.doNothing('href after--:', location.href)

                // ... whatever else you want to do
                // maybe call onhashchange e.handler
                pushState.apply(history, arguments);
            };
            
        })(window.history);
    }






    //本bus on仅仅会在当前路由发生时期进行注册，切换后会自动注销注册的函数。注意：不适用于keepalive的路由组件
    let busOn = (function () {
        // let tempBusCollection = [];
        // if (HACKER.BX_MODE) {
        //     HACKER.tempBusCollection = tempBusCollection
        // }
        // function registerTempBusCollection(key) {
        //     if (Array.isArray(key)) {
        //         if (!key.length) {
        //             return
        //         }
        //         key.forEach((k) => {
        //             registerTempBusCollection(k)
        //         })
        //         return key;
        //     }
        //     if (!tempBusCollection.includes(key)) {
        //         tempBusCollection.push(key)
        //     }
        //     return key;
        // }



        return (key, fun) => {
            // return (key, fun, addToTemp = true) => {

            HK.$bus.once('B_BEFORE_ROUTE_CHANGE', () => {



                HK.$bus.off(key, fun)
                // HK.$bus.off(tempBusCollection, () => {
                //     alert(tempBusCollection.length)
                //     tempBusCollection = [];

                // })
            })

            HK.$bus.on(key, fun)
            // HK.$bus.on(addToTemp ? registerTempBusCollection(key) : key, fun)

        }
    })();

    HACKER.busOn = HACKER.$bus.busOn = busOn;


    $bus.routeData = {}
    HACKER.$bus.once('B_HACKER_CORE_LOADED', () => {
        $bus.routeData = HACKER.createObservableObject({}, 'ROUTE_DATA', ['$refs'])
    })



    // setTimeout(emitEventWhenPushState, 5000)
    // emitEventWhenPushState()

    HACKER.$bus.once('B_ROUTE_WRAPPER_LOADED', () => {
        setTimeout(() => {
            emitEventWhenPushState()
        }, 300)
    })


    HACKER.setRouteData = (obj) => {
        for (let i in obj) {
            HK.$bus.routeData[i] = obj[i]
        }
    }





})();