
; (function () {

    // let _loadJS = (function () {

    //     let cacheedScriptUrls = []
    //     return function (url, wrapperInIIFE = true, win, cache = true) {
    //         return new Promise(async (resolve) => {

    //             if (cacheedScriptUrls.includes(url)) {
    //                 resolve();
    //                 return
    //             }


    //             let doc = win ? win.document : document;
    //             let targetNode = doc.body;
    //             // Bue.rootWindow.Bue.doNothing("targetNode--:", targetNode, url, wrapperInIIFE);
    //             // targetNode = targetNode || (win ? win.document.body : document.body);
    //             //url is URL of external file, implementationCode is the code
    //             //to be called from the file, location is the location to
    //             //insert the <script> element

    //             var scriptTag = doc.createElement("script");

    //             if (!wrapperInIIFE) {
    //                 scriptTag.src = url;
    //                 scriptTag.type = "text/javascript";

    //                 scriptTag.onload = () => {
    //                     cache && cacheedScriptUrls.push(url)
    //                     resolve();
    //                 };

    //                 targetNode.appendChild(scriptTag);
    //             } else {
    //                 let res = await HACKER.httpGet(url);

    //                 scriptTag.type = "text/javascript";
    //                 scriptTag.innerHTML = `
    //               (function(){

    //                 ${res}
    //               }).call(Bue);
    //               `;
    //                 targetNode.appendChild(scriptTag);
    //                 setTimeout(() => {
    //                     cache && cacheedScriptUrls.push(url)
    //                     resolve();
    //                 });

    //                 // new Function(`return (function(){
    //                 //     ${res}
    //                 //     })`)().call(Bue);
    //                 // setTimeout(() => {
    //                 //   resolve();
    //                 // });
    //             }
    //         });
    //     };
    // })();

    // HACKER.loadJs = _loadJS;

    // function dynamicLoadCss(url) {
    //     var head = document.getElementsByTagName('head')[0];
    //     var link = document.createElement('link');
    //     link.type = 'text/css';
    //     link.rel = 'stylesheet';
    //     link.href = url;
    //     head.appendChild(link);
    // }
    // HACKER.loadCss = dynamicLoadCss

    HACKER.fd2obj = function (formData) {
        var objData = {};

        for (var entry of formData.entries()) {
            objData[entry[0]] = entry[1];
        }
        return objData
    };



    HACKER.poll = poll;
    function isEffectiveThing(o) {

        if (typeof (o) == 'object' && o != null && 'length' in o && o.length > 0) {
            return true;
        } else {
            let result = (typeof o === 'boolean' && o === true)
                || (o != null && o != undefined && ('' + o).trim() != '')

            return result;
        }



    }
    if (HACKER.BX_MODE) {
        HACKER.isEffectiveThing = isEffectiveThing;
    }
    HACKER.uniqullyPush2Arr=(arr,key)=>{
        let index=arr.findIndex((o)=>o==key)
        if(index>-1){
            arr.splice(index,1)
        }
        arr.push(key)
    }
    function poll(fn, timeout, interval) {
        var endTime = Number(new Date()) + (timeout || 30000);
        interval = interval || 50;

        var checkCondition = function (resolve, reject) {
            // If the condition is met, we're done! 
            var result = fn();
            if (isEffectiveThing(result)) {
                HACKER.doNothing('result--------:', result)
                resolve(result);
            }
            // If the condition isn't met but the timeout hasn't elapsed, go again
            else if (Number(new Date()) < endTime) {
                setTimeout(checkCondition, interval, resolve, reject);
            }
            // Didn't match and too much time, reject!
            else {
                reject(new Error('timed out for ' + fn + ': ' + arguments));
            }
        };

        return new Promise(checkCondition);
    }




    var setDataByModel= function($scope, modelStr, val) {
        // console.log('set data by model args--:', arguments)
        var arr = modelStr.split('.'),
          len = arr.length
        if (len === 1) {
          $scope[arr[0]] = val
        } else if (len > 1) {
          var ns = arr,
            obj = $scope
          for (var i = 0; i < len - 1; i++) {
            var key = ns[i]
            obj = obj[key]
          }
          console.log('this is obj and key:', obj, ns[len - 1], val)
    
          obj[ns[len - 1]] = val
        }
      }


    function getDataByModel($scope, modelStr, otherWiseVal) {
        otherWiseVal = otherWiseVal || null
      
        if (!$scope) {
          return otherWiseVal
        }
      
        var arr = modelStr.split('.'),
          len = arr.length,
          result = $scope
        // console.log('len:',len)
        if (len === 1) {
          // if($scope.hasOwnProperty(arr[0])) {
          //     return $scope[arr[0]]
          // }
          // else if($scope.result && $scope.result[arr[0]]) {
          //     return $scope.result[arr[0]]
          // }
          return $scope.hasOwnProperty(arr[0]) ? $scope[arr[0]] : otherWiseVal
        } else if (len > 1) {
          var isError = false
          for (var i in arr) {
            if (typeof result[arr[i]] === 'undefined') {
              isError = true
              break
            } else {
              result = result[arr[i]]
            }
          }
          if (isError) {
            return otherWiseVal
          } else {
            return result
          }
        } else if (len === 0) {
          return otherWiseVal
        }
      }



      HACKER.setDataByModel=setDataByModel;
      HACKER.getDataByModel=getDataByModel;



    HACKER.insertRule = (function () {

        let strCache = [],
            maxIndex = -1;
        function getStyleSheet(unique_title) {
            for (var i = 0; i < document.styleSheets.length; i++) {
                var sheet = document.styleSheets[i];
                if (sheet.title == unique_title) {
                    return sheet;
                }
            }
        }

        return function (str) {

            if (strCache.includes(str)) {
                return
            }
            strCache.push(str)
            maxIndex++;
            let sheet = getStyleSheet()
            if (HACKER.BX_MODE) {
                // console['log']('str will be inserted--:', str)
            }

            sheet.insertRule(str, maxIndex);

        }

    })();


    function transformObjIteratilly(obj, fn, transformKey = (k) => k) {
        let res = {}
        for (let i in obj) {
            if ('props' != i && Reflect.has(obj, i) && fn(obj[i], i)) {
                res[transformKey(i)] = obj[i]
            }
        }
        return res;
    }

    function toHump(name, big = false) {
        name = name.replace(/\-(\w)/g, function (all, letter) {
            HACKER.doNothing(all) //"_T"
            HACKER.doNothing(letter) //"T"
            return letter.toUpperCase();
        });

        if (big) {
            return name.charAt(0).toUpperCase() + name.slice(1)
        }
        return name;
    }

    HACKER.toHump = toHump;

    HACKER.dealyExec = (fn = () => { }, dealy = 0, returnPromise = true) => {
        if (returnPromise) {
            return new Promise((resolve) => {
                setTimeout(async () => {
                    let res = await fn();
                    resolve(res)
                }, dealy)
            })
        }
        return () => {
            setTimeout(fn, dealy)
        }

    }

    HACKER.transformObjIteratilly = transformObjIteratilly;

    HACKER.aes128 = (srcs = 'test2test', key = 'txicbc-uniontech') => {
        var key = window.CryptoJS.enc.Utf8.parse(key);//Latin1 w8m31+Yy/Nw6thPsMpO5fg==
        var srcs = window.CryptoJS.enc.Utf8.parse(srcs);
        var encrypted = window.CryptoJS.AES.encrypt(srcs, key, { mode: window.CryptoJS.mode.ECB, padding: CryptoJS.pad.Pkcs7 });

        return encrypted.ciphertext.toString().toUpperCase();

    }




    function filter(str) { // 特殊字符转义
        str += ''; // 隐式转换
        str = str.replace(/%/g, '%25');
        str = str.replace(/\+/g, '%2B');
        str = str.replace(/ /g, '%20');
        str = str.replace(/\//g, '%2F');
        str = str.replace(/\?/g, '%3F');
        str = str.replace(/&/g, '%26');
        str = str.replace(/\=/g, '%3D');
        str = str.replace(/#/g, '%23');
        return str;
    }

    //对象转为？a=xx&b=xx格式的query string
    function formateObjToParamStr(paramObj, questionMark = false) {
        const sdata = [];
        for (let attr in paramObj) {
            sdata.push(`${attr}=${filter(paramObj[attr])}`);
        }
        return (!questionMark ? '' : ('?')) + sdata.join('&');
    };

    HACKER.formateObjToParamStr = formateObjToParamStr;

    HACKER.isFetchRequest=(request)=>{
        let proto=Reflect.getPrototypeOf(request)
        return 'json blob clone signal text'.split(" ").every((key)=>key in proto)
    }


    function urlToObj(str) {
        let obj = {};
        let str1 = str.split("?");
        if(!str1[1]){
            return obj
        }
        let str2 = str1[1].split("&");  //["a=1", "b=2", "c=3"]
        for (let i = 0; i <str2.length ; i++) {
            let str3 = str2[i].split("=");
            obj[str3[0]] = str3[1]
        }
        return obj
    }

    HACKER.urlToObj = urlToObj;

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







})();