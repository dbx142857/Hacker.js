

; (async function () {

    let HK = window.HACKER,
        cloakElements=[],
        $ = HACKER.$.$;



    let showDefaultElements = false;

    let directiveCollections = {

    }
    HACKER.directiveSuper = class {
        h() {
            let res = HACKER.h.apply(this, arguments)
            this._elements.push(res)
            return res;
        }
        popup() {
            let res = HACKER.popup.apply(this, arguments)
            this._elements.push(res)
            return res;
        }
        beforeDestroy() {

        }
        destroyed() {

        }
        _inserted(directiveName) {//

            HACKER.addInstanceCache('directive', directiveName, this)
            let self = this
            function fun() {
                // HACKER.doNothing('fun args--:', arguments)
                HACKER.removeInstanceCache('directive', directiveName, self);
                this.beforeDestroy()
                this._elements.forEach((node) => {
                    node.destroy()
                })
                this._elements.length = 0
                HACKER.$bus.off('B_AFTER_ROUTE_CHANGE', fun)
                HACKER.$bus.off('B_RE_PARSE', fun)

                this.destroyed()
            }

            HACKER.$bus.on("B_AFTER_ROUTE_CHANGE B_RE_PARSE".split(" "), fun)
        }
        constructor() {

            this._elements = [];

        }
    }

    HACKER.directive = (key, configClass) => {
        directiveCollections[key] = new configClass
    }


    // 最新支持了data-hacker-css



    // new Function('return `'+     ('$'+'{this.$refs.a}')     +'`')      .call({$refs:{a:11111111}})

    //移除一个被双引号包裹的字符串里除了单引号引用里面之外的所有空格
    // function removeSpacesOutsideSingleQuot(s) {
    //     let inside = 0;
    //     return s.replace(/ +|'/g, m => m === "'" ? (inside ^= 1, "'") : inside ? m : "");
    // }


    //表达式如果需要在依赖的属性变更时重新计算，则必须满足类似格式：
    /** 
     * 1 每一个{}里必须只能引用一个响应式数据
     * 2 每一个{}对响应式数据的访问必须通过this.xxx.xx的形式，且被访问的属性之后必须得有至少一个.去访问其自身的属性
    */

    // "{this.$refs.startTime.value}   
    //  ~    {this.$refs.endTime.value}  list length:{this.list.length}  props:{Object.keys(HACKER.props.v).join('----')}"


    //匹配一个字符串中两个字符串中间的所有内容
    function matchStringsBetween(text) {
        // const text = "This is a test string {more or less}, {more} and {less}";
        const regex = /\{(.*?)\}/gi;
        // const regex = new RegExp('[(.*?)]', 'gi')
        const resultMatchGroup = text.match(regex); // [ '[more or less]', '[more]', '[less]' ]
        const desiredRes = resultMatchGroup.map(match => match.replace(regex, "$1"))
        return desiredRes
    }
    HACKER.matchStringsBetween = matchStringsBetween


    //根据表达式解析，收集依赖
    async function collectDepsByExpression(expr) {
        let previousExpr = expr;
        expr = expr.replace(/\{/g, '\${')
        // expr=removeSpacesOutsideSingleQuot(expr);
        let computedFun = new Function('return `' + expr + '`'),
            changeDesc = null,
            changeHandler = computedFun.bind(HACKER.$bus.routeData);

        if (!expr.includes('{this.')) {
            return {
                changeHandler: changeHandler,
                deps: null
                // result: result
            }
        }

        let deps = []

        let everyExprs = matchStringsBetween(previousExpr)



        await HACKER.dealyExec(() => {
            everyExprs.forEach((expr) => {
                Object.keys(HACKER.$bus.routeData.__LIST).forEach((observableKey) => {
                    let prefixKey = 'this.' + observableKey + '.'
                    if (expr.includes(prefixKey)) {
                        let visitedKey = expr.split(prefixKey)[1].split('.')[0]
                        deps.push({
                            observableKey,
                            visitedKey
                        })
                        // HACKER.doNothing('expr--:', visitedKey, expr, 'LOG')
                    }
                })
            })
        }, 50)
        // setTimeout(() => {

        // }, 50)



        // for (let observableKey in HACKER.$bus.routeData.__LIST) {
        //     // if ('$refs' == key) {
        //     //     //观测属性变动
        //     //     changeDesc = {
        //     //         type: 'MUTATION_OBSERVER_ATTRIBUTES',
        //     //     }
        //     // } else {
        //     //     changeDesc = null
        //     // }
        // }

        return {
            // result: result,
            deps: deps,
            changeHandler: changeHandler,
            // changeHandler() {
            //     return computedFun.call(HACKER.$bus.routeData)
            // }
        }
    }

    function applyValue(deps, node, key) {
        HACKER.doNothing('key in apply value--:', key, deps.changeHandler())
        let specialSituations = {
            html: 'innerHTML',
            text: 'innerText'
        }

        // alert(key)
        if (key == 'css') {
            node.style.cssText += deps.changeHandler()
        } else {
            if (key in specialSituations) {
                node[specialSituations[key]] = deps.changeHandler()
            }
            else if (key in directiveCollections) {

                directiveCollections[key]._inserted(key, node, deps.changeHandler())
                directiveCollections[key].inserted(node, deps.changeHandler())
            }
            else {

                node.setAttribute(key, deps.changeHandler())
            }
        }



    }

    async function exprObservableHandler(deps, node, key) {



        HACKER.doNothing('deps and node--:', deps, node, "LOG")
        if (null == deps.deps) {
            await HACKER.dealyExec(applyValue.bind(null, ...arguments), 30);
        } else {
            await HACKER.dealyExec(applyValue.bind(null, ...arguments), 300);
            deps.deps.forEach((dep) => {
                HACKER.doNothing('log single dep--:', dep, 'LOG')

                if (dep.observableKey == '$refs') {
                    new MutationObserver(HACKER.dealyExec(applyValue.bind(null, ...arguments), 0, false))
                        .observe(HK.$bus.routeData.$refs[dep.visitedKey], { attributes: true, childList: false, subtree: false })
                } else {

                }

            })
        }

    }


    //主解析引擎
    async function parseNodeByDataHacker(node) {
        HACKER.doNothing('node--:',node)
        let {methodContext,controller}=this
        let vmConfig=controller==window?null:controller;
        HACKER.doNothing('vmConfig--:',vmConfig,node,node.attributes)

        if(vmConfig){
            let methods=vmConfig.methods||{}
            for(let i in node.attributes){
                if(typeof(node.attributes[i])=='object'){
                    let row=node.attributes[i]
                    // HACKER.doNothing('iii----------:',row,row.value,row.name,Object.keys(row),Object.values(row),Reflect.getPrototypeOf(row))
                    if(row.name.startsWith('@')){
                        node.addEventListener(row.name.substring(1),(e)=>{

                            if(/^[a-zA-Z\$_][a-zA-Z\d\$_]*$/.test(row.value)){
                                methods[row.value].call(methodContext,e)
                            }else{
                                new Function(row.value).call(methodContext)
                            }

                            
                        })
                        
                    }
                }
                
            }
        }


        let hackerDefine = {};
        try {
            // let 
            // HACKER.doNothing('node.dataset.hacker--:', node.dataset.hacker)
            hackerDefine = node.dataset.hacker ? (new Function('return ' + (node.dataset.hacker))()) : {}
        } catch (e) {

        }
        for (let i in node.dataset) {
            // alert(i)
            if (i != 'hacker' && i.startsWith('hacker')) {
                let key = i.split('hacker')[1].toLowerCase(),
                    val = node.dataset[i];

                // alert(key)

                await exprObservableHandler((await collectDepsByExpression(val)), node, key)

            }
        }



        let id = hackerDefine.id || node.getAttribute('id')

        if (!showDefaultElements) {
            if (hackerDefine.hide) {
                node.style.display = 'none'
            } else if (hackerDefine.transparent) {
                node.style.opacity = '0'
            }
        }

        if(hackerDefine.cloak==true){
            cloakElements.push(node)
        }


        if (!id) {
            return false;
        }

        HK.$bus.routeData.$refs[(hackerDefine.group ? (hackerDefine.group + '_') : '') + HACKER.toHump(id)]
            = node

        // if (hackerDefine.group) {
        //     if (!HK.$bus.routeData.$refs[hackerDefine.group]) {
        //         HK.$bus.routeData.$refs[hackerDefine.group] = {}
        //     }

        //     HK.$bus.routeData.$refs[hackerDefine.group][HACKER.toHump(id)] = node
        // } else {
        //     HK.$bus.routeData.$refs[HACKER.toHump(id)] = node
        // }






    }


    // HACKER.$bus.on('B_BEFORE_ROUTE_CHANGE', () => {

    //     HK.$bus.routeData.$refs = HACKER.createObservableObject({},'HK.$bus.routeData_REF', true, (v) => {
    //         if (!(v instanceof HTMLElement)) {
    //             // throw '只能为ref设置HTMLElement类型的值'
    //         }
    //     })
    // })

    HACKER.$bus.once('B_HACKER_CORE_LOADED', () => {

        HK.$bus.routeData.$refs = HACKER.createObservableObject({}, 'HK.$bus.routeData_REF', [], (v) => {
            if (!(v instanceof HTMLElement)) {
                throw '只能为ref设置HTMLElement类型的值'
            }
        })
    })


    //route data被改变触发点事件
    // HACKER.$bus.busOn('HK.$bus.routeData_REF_UPDATE', ($refs, key, value) => {
    //     HACKER.doNothing('log-ref-setter:', $refs, key, value, 'LOG')
    // })

    HACKER.parseDom = (container,controller=null,methodContext=null) => {
        // let isJQueryObj = container instanceof jQuery
        // if (isJQueryObj) {
        //     container = container.get(0)
        // }
        // HK.$bus.routeData.$refs = {}
        // HACKER.$.$('[data-hacker]').forEach(await parseNodeByDataHacker)

        // await Promise.all([].map.call(HACKER.$.$('[data-hacker]') || [], parseNodeByDataHacker))
        Promise.all([].map.call((function () {
            try {
                container = container || HACKER.mutationObserverRouteWrapper
                let result = [],
                    objs;

                objs = container ? container.querySelectorAll('*') : HACKER.$.$('*');
                // objs = HACKER.$.$('*');
                for (let i in objs) {
                    if (Object.keys(objs[i].dataset || {}).find((s) => s.startsWith('hacker'))) {
                        result.push(objs[i])
                    }
                }
                return result
            } catch (e) {

                return []
            }


        })(), parseNodeByDataHacker.bind({
            controller,
            methodContext
        })))



        return container;
        // return isJQueryObj ? jQuery(container) : container;

    }

    HACKER.$bus.on("B_AFTER_ROUTE_CHANGE", async () => {

        // return false;





        await HACKER.parseDom()

        HK.$bus.emit('B_HACKER_READY' + HACKER.generateUniqueKeyByPathName())
        cloakElements.forEach((node)=>node.style.opacity = '1')


    })
})();