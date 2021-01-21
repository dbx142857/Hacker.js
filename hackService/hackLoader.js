
; (async function () {
    window['console']['log']('console log test 0119- in hacker loader');
    const HACKER_BUSINESS_CONFIG={
        mutationObserverRouteWrapper:'.m-wrapper',
        routeUrlUniqueFlagGenerator(pathOrOldHash){
            if(pathOrOldHash.startsWith('/zone/detail/')){
                pathOrOldHash='/zone/detail'
            }
            
            return pathOrOldHash;
        },
        scripts:[
            // (hackerLibPath+'hackParser.js'),
            // (hackerLibPath+'lifeCycle.js'),
            // hackerLibPath+'components/daterangepicker.js',
            '/assets/hackService/globalHacker.js',
            // '/assets/datepickerBeautifyService.js',
            
        ]
    }


    
    


    String.prototype.replaceAll = String.prototype.replaceAll || function (targetStr, newStr) {
        var sourceStr = this.valueOf();
        while (sourceStr.indexOf(targetStr) !== -1) {
            sourceStr = sourceStr.replace(targetStr, newStr);
        }
        return sourceStr;
    };
    let HACKER = function () {
        let args = [...arguments]
        let action = args[args.length - 1] || 'LOG'
        switch (action) {
            case 'LOG':
            case 'WARN':
                {
                    if (HACKER.BX_MODE) {
                        console[action.toLowerCase()].apply(console, args.slice(0, args.length - 1))
                    }
                    break;//--//
                }
        }
    }
    
        HACKER.BUSINESS_CONFIG=HACKER_BUSINESS_CONFIG||{}
    

    let hackerLibPath=[].map.call(document.querySelectorAll('script'),o=>o.src).find(o=>o.includes('hackLoader.js')).split("hackLoader.js")[0];

    
    

    window.HACKER = HACKER;
    HACKER.useHash = window.USE_HASH || Boolean(localStorage.getItem('HASH_MODE'))

    HACKER.doNothing = () => { }
    HACKER.BX_MODE = !!localStorage.getItem('BX_DEBUG');
    // HACKER.OPEN_BX_MODE = () => {
    //     localStorage.setItem('BX_DEBUG', 1);
    //     location.reload()
    // }
    HACKER.throttleFlag = true;
    HACKER.mutationObserverRouteWrapper = document.body;


    HACKER.fetchGet = (url) => {

        url = HACKER.xhookFetch.before.reduce((lastReduceRes, eleFun) => {

            return eleFun(lastReduceRes)
        }, url)
        return window.fetch(url)
    }
    HACKER.xhookFetch = {
        reset() {
            HACKER.xhookFetch.before = []
            // HACKER.xhookFetch.before=[]
        },
        before: []
    }


    HACKER.switchHashMode = () => {
        localStorage.setItem('BX_DEBUG', 1);
        localStorage.setItem('HASH_MODE', 1);
        location.reload()
    }
    HACKER.switchBXMode = () => {
        localStorage.setItem('BX_DEBUG', 1);
        location.reload()
    }
    if (HACKER.useHash) {

        let hmrId = localStorage.getItem('HMRID');

        setInterval(() => {
            if (localStorage.getItem('HMRID') != hmrId && location.hostname == 'localhost') {
                location.reload()//--
            }
        }, 500)


    }

    let _loadJS = (function () {

        let cacheedScriptUrls = []
        return function (url, wrapperInIIFE = true, win, cache = true) {
            return new Promise(async (resolve) => {

                if (cacheedScriptUrls.includes(url)) {
                    resolve();
                    return
                }


                let doc = win ? win.document : document;
                let targetNode = doc.body;
                // Bue.rootWindow.Bue.doNothing("targetNode--:", targetNode, url, wrapperInIIFE);
                // targetNode = targetNode || (win ? win.document.body : document.body);
                //url is URL of external file, implementationCode is the code
                //to be called from the file, location is the location to
                //insert the <script> element

                var scriptTag = doc.createElement("script");

                if (!wrapperInIIFE) {
                    scriptTag.src = url;
                    scriptTag.type = "text/javascript";

                    scriptTag.onload = () => {
                        cache && cacheedScriptUrls.push(url)
                        resolve();
                    };

                    targetNode.appendChild(scriptTag);
                } else {
                    let res = await HACKER.httpGet(url);

                    scriptTag.type = "text/javascript";
                    scriptTag.innerHTML = `
              (async function(){
                let createGlobalStyle=HACKER.createGlobalStyle,html=HACKER.html;
                ${res}
              }).call(window);
              `;
                    targetNode.appendChild(scriptTag);
                    setTimeout(() => {
                        cache && cacheedScriptUrls.push(url)
                        resolve();
                    });

                    // new Function(`return (function(){
                    //     ${res}
                    //     })`)().call(Bue);
                    // setTimeout(() => {
                    //   resolve();
                    // });
                }
            });
        };
    })();



    function dynamicLoadCss(url) {
        var head = document.getElementsByTagName('head')[0];
        var link = document.createElement('link');
        link.type = 'text/css';
        link.rel = 'stylesheet';
        link.href = url;
        head.appendChild(link);
    }
    HACKER.loadJs = _loadJS;
    HACKER.loadCss = dynamicLoadCss

    HACKER.formatTime = function (date, hmdOnly = false) {
        date = date || new Date();
        let t = date.getTime();
        if (typeof t == "number" && window.isNaN(t)) {
            return "";
        }

        let d = new Date(date);

        var yyyy = d.getFullYear().toString();
        var mm = (d.getMonth() + 1).toString(); // getMonth() is zero-based
        var dd = d.getDate().toString();
        var hh = d.getHours().toString();
        var ii = d.getMinutes().toString();
        var ss = d.getSeconds().toString();
        // return '20180211'+hh+ii+ss;

        let res =
            yyyy +
            "-" +
            (mm[1] ? mm : "0" + mm[0]) +
            "-" +
            (dd[1] ? dd : "0" + dd[0]);
        if (!hmdOnly) {
            res +=
                " " +
                (hh[1] ? hh : "0" + hh[0]) +
                ":" +
                (ii[1] ? ii : "0" + ii[0]) +
                ":" +
                (ss[1] ? ss : "0" + ss[0]);
        }

        return res;
        // return yyyy+'/' + (mm[1]?mm:"0"+mm[0])+'/' + (dd[1]?dd:"0"+dd[0])+' '+ (hh[1]?hh:"0"+hh[0])+':'+ (ii[1]?ii:"0"+ii[0])+':'+ (ss[1]?ss:"0"+ss[0])

        // return yyyy+'-' + (mm[1]?mm:"0"+mm[0])+'-' + (dd[1]?dd:"0"+dd[0]);
    }

    HACKER.httpGet = function (url, errorCb) {

        let randomStr = "jsx html css less sass scss js json"
            .split(" ")
            .find((s) => url.endsWith("." + s))
            ? HACKER.formatTime(null, true)
            : Math.random();
        errorCb =
            errorCb ||
            function () {
                window.alert("加载" + url + "错误");
            };
        return new Promise((resolve, reject) => {
            var httpRequest = new XMLHttpRequest(); //第一步：建立所需的对象
            httpRequest.open(
                "GET",
                url + "?r=" + (HACKER.BX_MODE ? Math.random() : randomStr),
                true
            ); //第二步：打开连接  将请求参数写在url中  ps:"./Ptest.php?name=test&nameone=testone"
            httpRequest.send(); //第三步：发送请求  将请求参数写在URL中
            /**
             * 获取数据后的处理程序
             */
            httpRequest.onreadystatechange = function () {
                if (httpRequest.status != 200) {
                    if (httpRequest.readyState == 4) {
                        reject({
                            httpRequest: httpRequest,
                            message: "加载" + url + "错误",
                        });

                        if (404 == httpRequest.status) {



                            HACKER.$bus.emit('B_LOAD_FILE_404', (url))
                            // Bue.eventEmitter.emit('B_LOAD_FILE_404', Bue.s.generateVmNameFlagByPathForBus(url))
                        }
                    }


                } else {
                    if (httpRequest.readyState == 4) {
                        resolve(httpRequest.responseText);
                    }
                }
                // if (httpRequest.readyState == 4 && httpRequest.status == 200) {
                //   resolve(httpRequest.responseText);
                // } else {
                //   errorCb();
                //   // reject("加载" + url + "错误");
                // }
            };
        });
    }



    if('mutationObserverRouteWrapper' in HACKER_BUSINESS_CONFIG){
        window['HACKER'].mutationObserverRouteWrapper = HACKER_BUSINESS_CONFIG.mutationObserverRouteWrapper;//
    }

    

    await Promise.all([
        hackerLibPath+'index.js',
        hackerLibPath+'hackHttpInterceptor.js',
        hackerLibPath+'hackUtils.js',
        hackerLibPath+'routlyPubSubService.js',
        // hackerLibPath+'hackDomService.js',
        // hackerLibPath+'hackParser.js',
        // hackerLibPath+'lifeCycle.js',
        // hackerLibPath+'components/daterangepicker.js',
        // hackerLibPath+'components/daterangepicker.js',
        // '/assets/datepickerBeautifyService.js'
    ].map((path) => HACKER.loadJs(path)))
    // /assets/hackService/routlyPubSubService.js
    // await HACKER.loadJs(hackerLibPath+'index.js')


    // await HACKER.loadJs(hackerLibPath+'hackHttpInterceptor.js')
    HACKER.xhook = window.xhook
    // window['HACKER']['xhook'] = xhook
    // await HACKER.loadJs(hackerLibPath+'hackUtils.js')


    // await HACKER.loadJs(hackerLibPath+'routlyPubSubService.js')


    // await Promise.all([
    //     HACKER.loadJs(hackerLibPath+'hackDomService.js'),
    //     HACKER.loadJs(hackerLibPath+'hackParser.js'),
    //     HACKER.loadJs(hackerLibPath+'lifeCycle.js')
    // ]);

    // await Promise.all([
    //     HACKER.loadJs(hackerLibPath+'hackDomService.js'),
    //     HACKER.loadJs(hackerLibPath+'hackParser.js'),
    //     HACKER.loadJs(hackerLibPath+'lifeCycle.js')
    // ]);




    await HACKER.loadJs(hackerLibPath+'hackDomService.js')
    // await HACKER.loadJs(hackerLibPath+'hackParser.js')//)
    // await HACKER.loadJs(hackerLibPath+'lifeCycle.js')

    await Promise.all([
        (hackerLibPath+'hackParser.js'),
        (hackerLibPath+'lifeCycle.js'),
        // hackerLibPath+'components/daterangepicker.js',
        // '/assets/datepickerBeautifyService.js'
    ].map((path) => HACKER.loadJs(path)))

    await Promise.all([].concat(HACKER.BUSINESS_CONFIG.scripts||[]).map((path) => HACKER.loadJs(path)))
    

    // await HACKER.loadJs(hackerLibPath+'components/daterangepicker.js')


    HACKER.$bus.emit('B_HACKER_CORE_LOADED')
    // await HACKER.loadJs('/assets/datepickerBeautifyService.js')

    HACKER.xhookResult = {

    }

    // xhook.after(function (request, response, cb) {
    //     console.log('response in xhook--:', response)
    //     let s = (location.protocol + '//' + location.host)
    //     if (response.finalUrl.startsWith(s)) {

    //     } else {

    //     }

    //     cb()


    // });





})();