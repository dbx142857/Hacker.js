


; (function () {

    let HACKER = window.HACKER,
        HK = HACKER;




    let getElementByContext = (selectorOrEle, context) => {
        if (selectorOrEle instanceof HTMLElement) {
            return selectorOrEle
        } else {
            return (context || window.document.body).querySelector(selectorOrEle)
        }
    }


    HACKER.loadIframeComp = (poper, src, hackerViewModel) => {//

        return new Promise((resolve) => {
            let obj = poper.instance
            hackerViewModel = {
                mounted() {

                },
                exec(fun, dealy = 200) {
                    setTimeout(async () => {
                        let res = await fun.call(hackerViewModel, HACKER)
                        hackerViewModel.mounted()
                        resolve({
                            ...res,
                            win: iframe.contentWindow,
                            hackerViewModel: hackerViewModel
                        })
                    }, dealy)
                },
                // registerMethod(key, action) {
                //     hackerViewModel[key] = action
                // },
                ...hackerViewModel
            }
            var iframe = document.createElement('iframe')//-------
            iframe.style.cssText = 'border:none;padding:0;margin:0;width:100%;background:transparent;height:calc(100% + 50px)'
            iframe.src = '/assets/iframe-components/' + src + '.html'
            obj.style.boxShadow = 'none'
            obj.style.border = 'none'
            // obj.style.cssText = 'border:none;box-shadow:none;'
            obj.appendChild(iframe)
            // alert(obj.style.height)
            // iframe.contentWindow.document.body.height = parseInt(obj.style.height) + 50 + 'px'
            iframe.contentWindow.hackerViewModel = hackerViewModel


            if (obj.classList.contains('HK-fullscreen-pop')) {

                hackerViewModel.hidePoper = () => {
                    poper.hide()
                    // obj.style.display = 'none'
                }

            }

        })

    }


    /**
     * 
     * mappingEvents() {
        return [
            [this.state.$refs['__LIST'].customCalenderTrigger, 'click', this.throttllyShowCalender.bind(this)],
            [this.state.$refs.startTime, 'click', this.throttllyShowCalender.bind(this)],
            [this.state.$refs.endTime, 'click', this.throttllyShowCalender.bind(this)],

        ]
    },
     */


    HACKER.mappingEvents = (configArr, context, dealy = 0) => {
        if (!Array.isArray(configArr) || !configArr.length) {
            return
        }

        context = context || HACKER.$.context
        configArr.forEach((row) => {

            if (row[0] && row[1]) {
                getElementByContext(row[0], context).addEventListener(row[1], function (e) {
                    // HACKER.doNothing('e.tar---:', e.target)

                    let fun = () => {
                        if (row[2] && row[3]) {
                            getElementByContext(row[2], context)[row[3]]();
                        }


                        //取最后一个function作为回调函数执行
                        (row.reverse().find((o) => 'function' == typeof (o)) || (() => { }))();
                    }

                    dealy == 0 ? (fun()) : (setTimeout(fun, dealy))



                })
            }










        })
    }
    HACKER.CLICKED_TAR_COLLECTIONS = []


    // HACKER.lastPathName = null

    HACKER.LAST_EMITTED_TARGET_CLICK_FLAG = ''
    window.addEventListener('click', (e) => {

        if (!e.isTrusted) {
            return false;
        }

        let tar = e.target;
        // if (HACKER.BX_MODE) {
        //     window.LAST_CLICKED_TAR = tar;
        // }
        HACKER.CLICKED_TAR_COLLECTIONS.push(tar)
        if (HACKER.CLICKED_TAR_COLLECTIONS.length > 5) {
            HACKER.CLICKED_TAR_COLLECTIONS.splice(0, HACKER.CLICKED_TAR_COLLECTIONS.length - 5)
        }
        // setTimeout(() => {
        HACKER.$bus.emit('B_TARGET_CLICK_ANYTHING', tar, e)
        // }, 300)

        if (tar.className != '') {
            HACKER.LAST_EMITTED_TARGET_CLICK_FLAG = tar.className.split('-').join('_').split(' ').join('_').toUpperCase()
            let busName = 'B_TARGET_CLICK_' + HACKER.LAST_EMITTED_TARGET_CLICK_FLAG

            // B_TARGET_CLICK_DATE_PICKER_TRIGGER_START
            HACKER.$bus.emit(busName, tar, e)
            HACKER.$bus.emit(busName+HACKER.generateUniqueKeyByPathName(), tar, e)
            tar.className.split(' ').forEach((clsName) => {
                let busName = ('B_TARGET_CLICK_CLASS_EACH_' + clsName.split('-').join('_').toUpperCase())
                HACKER.doNothing('bus name by single class--:', busName, 'LOG')
                HACKER.$bus.emit(busName, tar, e)
            })

            HACKER.doNothing('bus name by whole class--:', busName, 'LOG')

        }
    })

    let domWrapper = (str) => {
        // var fragment = document.createDocumentFragment();
        let div = document.createElement('div')
        div.innerHTML = str;
        return div.firstElementChild;

    }
    HACKER.getDomWrapperByContents = domWrapper
    function insertAfter(newElement, targetElement) {
        var parent = targetElement.parentNode;
        // 如果最后的节点是目标元素，则直接添加
        if (parent.lastChild = targetElement) {
            parent.appendChild(newElement)
        } else {
            //如果不是，则插入在目标元素的下一个兄弟节点 的前面
            parent.insertBefore(newElement, targetElement.nextSibling)
        }
    }
    HACKER.insertAfter = insertAfter

    HACKER.generateEl=(str,wrapperDiv=false)=>{
        let div=document.createElement('div')
        div.innerHTML=str;
        if(wrapperDiv){
            return div;
        }else{
            return div.childNodes[0]
        }
    }

    //某个元素前插入
    HACKER.insertBefore=function(newElement, targetElement){
        // targetElement=SeeUtils.getElObj(targetElement);
        if(targetElement==null){
            return void(0);
        }
        var parent = targetElement.parentNode;
        // 如果最后的节点是目标元素，则直接添加
        if(typeof newElement === 'string'){
            var temp = document.createElement('div');
            temp.innerHTML = newElement;
            // 防止元素太多 进行提速
            var frag = document.createDocumentFragment();
            while (temp.firstChild) {
                frag.appendChild(temp.firstChild);
            }
            parent.insertBefore(frag, targetElement);
        }else{
            parent.insertBefore(newElement, targetElement);
        }
    }

    HACKER.forEachNodeList = (selector, fn = () => { }) => {
        let list = document.querySelectorAll(selector);
        [].forEach.call(list, (obj, index) => {
            fn.call(obj, obj, index)
        })
        return list;
    }
    function calculatePx(o) {
        if (('' + o).endsWith('%')) {
            return o;
        } else {
            return o + 'px'
        }
    }
    function h(p, w = 40, h = 40, l = 0, t = 0, classes, listeners, customStyles = {}) {
        listeners = listeners || {}
        // let p = obj.parentNode
        let div = document.createElement('div')
        if (['inherit', 'static', ''].includes(p.style.position)) {
            p.style.position = 'relative'
        }
        p.appendChild(div)


        let styles = {
            width: calculatePx(w),
            height: calculatePx(h),
            position: 'absolute',
            left: calculatePx(l),
            top: calculatePx(t),

            ...customStyles
        }
        for (let i in listeners) {
            div.addEventListener(i, listeners[i])
        }

        classes.split(' ').forEach((k) => {
            div.classList.add(k)
        })
        for (let i in styles) {

            div.style[i] = styles[i]
        }
        return {
            destroy() {
                div.parentNode.removeChild(div)
            },
            instance: div,
            styles(styleDefines) {
                for (let i in styleDefines) {

                    div.style[i] = styleDefines[i]
                }
                return div;
            }
        }
    }
    HACKER.h = h;

    let isMutationObserverRouteWrapperFound = false;

    HACKER.$ = {
        getObjBySelectorOrNode(selectorOrNode) {

            if (!isMutationObserverRouteWrapperFound) {
                selectorOrNode = document.body
            } else {
                selectorOrNode = selectorOrNode || this.context
                // HACKER.doNothing('selectorOrNode--selectorOrNode--:', selectorOrNode)
                if (!(selectorOrNode instanceof HTMLElement)) {
                    selectorOrNode = document.querySelector(selectorOrNode)
                }
            }


            return selectorOrNode;
        },
        $(obj, useQuerySelectorAll = true) {
            if (obj instanceof HTMLElement) { return obj }

            let targetNode = this.getObjBySelectorOrNode()
            if (!targetNode) {
                return null;
            }
            return targetNode[useQuerySelectorAll ? 'querySelectorAll' : 'querySelector'].apply(targetNode, arguments)
        },
        $$(obj) {
            return this.$(obj, false)
        },
        context: document.body,
        update(node) {

            // this.$ = node.querySelectorAll.bind(node);
            this.context = node;
            return node;
        },
        reset() {





            this.context = HACKER.mutationObserverRouteWrapper || document.body;
            // this.$ = this.context.querySelectorAll.bind(this.context)
            // this.$ = document.querySelectorAll.bind(document)
        }
    }

    HACKER.$bus.on('B_BEFORE_ROUTE_CHANGE', () => {
        HACKER.$.reset()
    })





    if (HACKER.BX_MODE) {
        HACKER.isMutationObserverRouteWrapperFound = isMutationObserverRouteWrapperFound;
    }


    async function updateMutationObserverRouteWrapper() {

        // alert('ok')
        HACKER.mutationObserverRouteWrapper = await HACKER.poll(() => HACKER.$.$$(HACKER.mutationObserverRouteWrapper));

        HACKER.mutationObserverRouteWrapper.classList.add('HACKER-ROUTE-WRAPPER')
        isMutationObserverRouteWrapperFound = true;
        // HACKER.doNothing('HACKER.mutationObserverRouteWrapper---:', HACKER.mutationObserverRouteWrapper)
        // HACKER.mutationObserverRouteWrapper = await HACKER.poll(() => HACKER.$.$$('.m-wrapper'));
        HACKER.$.update(HACKER.mutationObserverRouteWrapper)
        HACKER.$bus.emit('B_ROUTE_WRAPPER_LOADED')
        console.log("abcdefg")
        HACKER.toggleUniqueClassForRouteWrapper()
        // initialPopUpService()

    }







    // HACKER.initialPopUpService = initialPopUpService
    function initialPopUpService() {
        // HACKER.PENDING_POPUP = null;
        HACKER.MASK_DOM = HACKER.h(document.body, 1, 1, 0, 0,
            // HACKER.MASK_DOM = HACKER.h(document.body, '100%', '100%', 0, 0,
            // calendarShowTriggerStart = HACKER.h(list[0].parentNode.parentNode.parentNode, 40, 40, 0, -10,
            `HK-fullscreen-mask`).styles({
                background: 'rgba(0,0,0,0.5)',
                // opacity: 0.5,
                zIndex: 99999,
                display: 'none'
            });
        let popupInstances = []
        if (HACKER.BX_MODE) {
            HACKER.popupInstances = popupInstances
        }
        HACKER.popup = function (obj, w, h, translateX = 0, translateY = 0, customStyles, otherOptions) {
            otherOptions = {
                closeWhenClickOutside: true,
                ...otherOptions
            }
            let MODE = 'POPUP'
            customStyles = customStyles || {}
            let boundingClientRect, resizeFun = null;

            if (obj instanceof HTMLElement) {



                boundingClientRect = obj.getBoundingClientRect()
            } else if (typeof (obj) == 'function') {
                resizeFun = obj;
                boundingClientRect = {
                    left: 0,
                    top: 0
                }


            } else {
                MODE = 'DIALOG'
                w = w || 800
                h = h || 500
                boundingClientRect = {
                    left: (document.documentElement.clientWidth - w) / 2,
                    top: (document.documentElement.clientHeight - h) / 2
                }
                HACKER.MASK_DOM.style.width = "100%"
                HACKER.MASK_DOM.style.height = "100%"
                if (otherOptions.closeWhenClickOutside) {
                    HACKER.MASK_DOM.addEventListener('click', closeEventForDialogMode)
                }

            }


            let rePositionPopper = () => {
                if (MODE == 'POPUP') {
                    let boundingClientRect = obj instanceof HTMLElement ? obj.getBoundingClientRect() : { left: 0, top: 0 }
                    div.style.left = boundingClientRect.left + translateX + 'px'
                    div.style.top = boundingClientRect.top + translateY + 'px'
                }

            }





            HACKER.MASK_DOM.style.display = 'block';
            let div = HACKER.h(HACKER.MASK_DOM, w, h, boundingClientRect.left + translateX, boundingClientRect.top + translateY,
                // calendarShowTriggerStart = HACKER.h(list[0].parentNode.parentNode.parentNode, 40, 40, 0, -10,
                `HK-fullscreen-pop`).styles({
                    boxShadow: `0px 2px 4px -1px rgba(0, 0, 0, 0.2), 0px 4px 5px 0px rgba(0, 0, 0, 0.14), 0px 1px 10px 0px rgba(0, 0, 0, 0.12)`,
                    ...customStyles,
                    background: '#fff'
                });
            // HACKER.doNothing('div--:', div, 'LOG')
            window.addEventListener('resize', rePositionPopper)
            window.addEventListener('scroll', rePositionPopper)
            if (resizeFun != null) {
                resizeFun = resizeFun.bind(div)

                window.addEventListener('resize', resizeFun)
                window.addEventListener('scroll', resizeFun)

                resizeFun()
            }
            // let isPopupShow = false;

            if (MODE == 'POPUP' && otherOptions.closeWhenClickOutside) {
                HACKER.$bus.busOn('B_TARGET_CLICK_ANYTHING', (tar) => {
                    if (!tar.closest('.HK-fullscreen-pop') && !tar.classList.contains('HK-POPPER-TRIGGER') && !tar.closest('.HK-POPPER-TRIGGER') && res.isPopupShow) {
                        // alert('1')
                        res.isPopupShow = false;
                        div.style.display = "none"
                    }
                })

            }

            let res = {
                instance: div,

                setContent(title, content) {
                    if (MODE != 'DIALOG') {
                        return res;
                    }
                    div.innerHTML = HACKER.html`
                    <div
                        style="font-size: 24px;
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    text-align: center;
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    margin-bottom: 20px;
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    line-height: 30px;">
                        ${title}</div>
                    <div
                        style="box-sizing: border-box;
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                max-height: calc(100% - 70px);
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                overflow: auto;
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                padding: 0 20px;">
                        ${content}</div>
                    `


                    return res;
                },
                destroy() {
                    window.removeEventListener('resize', rePositionPopper)
                    window.removeEventListener('scroll', rePositionPopper)
                    if (resizeFun != null) {
                        window.removeEventListener('resize', resizeFun)
                        window.removeEventListener('scroll', resizeFun)
                    }
                    // let len = popupInstances.length, arr = [...popupInstances]

                    // alert(len)
                    // if (len > 1) {
                    //     popupInstances.length = 0
                    //     arr.forEach((res) => {
                    //         try {
                    //             // res.destroy();
                    //             res.instance.parentNode.removeChild(res.instance)
                    //         } catch (e) { }

                    //     });
                    //     return false;
                    // } else {
                    //     div.parentNode.removeChild(div);
                    // }

                    let idx = popupInstances.findIndex((item) => item === res)
                    popupInstances.splice(idx, 1)

                    div.parentNode.removeChild(div);
                    HACKER.MASK_DOM.style.width = "1px"
                    HACKER.MASK_DOM.style.height = "1px"
                    HACKER.MASK_DOM.style.display = 'none';
                    // HACKER.PENDING_POPUP = null;
                    if (MODE == 'DIALOG') {
                        HACKER.MASK_DOM.removeEventListener('click', closeEventForDialogMode)
                    }

                },
                isPopupShow: false,
                hide() {
                    // isPopupShow = false;
                    // setTimeout(() => {
                    res.isPopupShow = false
                    // }, 50)

                    div.style.display = "none"
                },
                attachTo(obj, fun, method = 'click') {
                    obj.classList.add('HK-POPPER-TRIGGER')
                    fun = fun || (() => { })
                    res.instance.style.display = 'none'

                    obj.addEventListener(method, () => {
                        // setTimeout(() => {

                        rePositionPopper()
                        // isPopupShow = !res.isPopupShow;
                        res.isPopupShow = !res.isPopupShow

                        // HACKER.checkThrottleFlag(200)
                        res.instance.style.display = res.isPopupShow ? 'block' : 'none'
                        // alert(res.instance.style.display)
                        fun()

                        // }, 50)


                    })
                    return res;
                }
            };
            HACKER.$bus.busOn('B_BEFORE_ROUTE_CHANGE', () => {
                res.destroy()
                setTimeout(() => {
                    popupInstances.length = 0
                })
            })
            otherOptions.closeWhenClickOutside && (popupInstances.push(res))
            function closeEventForDialogMode(e) {

                if (!e.target.closest('.HK-fullscreen-pop')) {

                    res.destroy();
                }
            }
            // HACKER.PENDING_POPUP = res
            return res;
        }
    }


    let updateMutationObserverRouteWrapperInvoked = false;

    // 创建一个observer示例与回调函数相关联
    var observer = new MutationObserver(function (mutationsList, obsr) {
        // HACKER.doNothing('mutationsList--:', mutationsList)
        // HACKER.$.$$(HACKER.mutationObserverRouteWrapper)
        for (var mutation of mutationsList) {
            if (mutation.type == 'childList') {

                setTimeout(async () => {

                    // if (!HACKER.checkThrottleFlag(1200)) {


                    //     return false

                    // }


                    if (updateMutationObserverRouteWrapperInvoked) {
                        return false;
                    }
                    updateMutationObserverRouteWrapperInvoked = true;

                    await updateMutationObserverRouteWrapper()






                    // 停止观测
                    observer.disconnect();

                }, 200)


                HACKER.doNothing('A child node has been added or removed.', mutation);

            }
            // else if (mutation.type == 'attributes') {
            //     HACKER.doNothing('The ' + mutation.attributeName + ' attribute was modified.');
            // }
        }
    });

    // initialPopUpService()

    let isBasicServiceInited = false

    HACKER.$bus.once("B_AFTER_ROUTE_CHANGE", () => {
        if (!isBasicServiceInited) {
            initialPopUpService()

            isBasicServiceInited = true;
        }
    })

    HACKER.toggleUniqueClassForRouteWrapper = () => {
        let className = 'HACKER_ROUTE_WRAPPER' + HACKER.generateUniqueKeyByPathName()
        // console.log('will add class before--:', className)
        // if (!HACKER.checkThrottleFlag(10)) {
        //     return false;
        // }


        if (HACKER.mutationObserverRouteWrapper.classList) {
            HACKER.mutationObserverRouteWrapper.classList.toggle(className)
        }
        // try {
        //     // console.log('will add class--:', className)

        // } catch (e) {
        //     console.error('add class error--:', e)

        // }

    }



    // window.addEventListener('load', () => {
    //     alert('load')
    //必须用mutationObserver确保一开始就定义的mutationobservableWrapper加载成功之后,再触发parser工作
    // setTimeout(() => {
    //使用配置文件对目标节点进行观测
    observer.observe(document.body, { attributes: false, childList: true, subtree: false });
    // })
    // })
















})();