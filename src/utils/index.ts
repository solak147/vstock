const Utils = {

    /** 深度拷贝对象 */
    deepClone(target : any, source : any) {
        var copyed_objs : any = [];//此数组解决了循环引用和相同引用的问题，它存放已经递归到的目标对象
        function _deepCopy(target : any){
            if((typeof target !== 'object')||!target){return target;}
            for(let i= 0 ;i<copyed_objs.length;i++){
                if(copyed_objs[i].target === target){
                    return copyed_objs[i].copyTarget;
                }
            }
            let obj : any = {};
            if(Array.isArray(target)){
                obj = [];//处理target是数组的情况
            }
            copyed_objs.push({target:target,copyTarget:obj});
            Object.keys(target).forEach(key=>{
                if(obj[key]){ return;}
                obj[key] = _deepCopy(target[key]);
            });
            return obj;
        }
        return Object.assign(_deepCopy(target),source);
    },

    objToQueryString(object : any, source : any){
        if((typeof object !== 'object')||!object){return ''}
        const obj = Object.assign({},object,source);
        const keys = Object.keys(obj);
        return keys.map(key => {
            const value = object[key];
            if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
                try {
                    return key+'='+encodeURIComponent(String(value))
                } catch {
                    return ''
                }
            }else{
                return ''
            }
        }).filter(x => x.length > 0).join('&');
    },

    /**
     * 获取URL的参数值
     * @param {string} name
     * @param {string} url
     */
    getURLQuery(name : any ,url = location.href) {
        if(url.indexOf('?')===-1)return name?'':{};
        var query = url.substring(url.indexOf('?')+1);
        var arr = query.split("&");
        var obj : any = {};
        for (var i=0;i<arr.length;i++) {
            var item 

            try{
               item = decodeURIComponent(arr[i])
            }catch{
               item = ''
            }

            var key = item.substring(0,item.indexOf('='));
            if(key){
                obj[key]=item.substring(item.indexOf('=')+1);
            }
        }
        return name?(obj[name]||''):obj;
    },

    // example:
    // importScript("/js/swiper.min.js", data => {
    //     after do
    // })
    importScript(path : any, success : any, error : any) {

        if (document.querySelector(`script[src="${path}"]`) ) {
            console.log('特定的 <script> 元素已存在');
            return
        } 

        var oS = document.createElement('script')
        oS.src = path
        document.getElementsByTagName('head')[0].appendChild(oS)
        oS.onload = function () {
          success && success()
        }
      
        oS.onerror = function () {
          error && error()
        }
    },

    //2024-08-02T10:25:00.000+08:00 -> 2024-08-02 09:00:00
    dateFormate(str: string, format: string) {
        let isoDateString = str;
        let date = new Date(isoDateString);

        let year = date.getFullYear();
        let month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-based
        let day = String(date.getDate()).padStart(2, '0');
        let hours = String(date.getHours()).padStart(2, '0');
        let minutes = String(date.getMinutes()).padStart(2, '0');
        let seconds = String(date.getSeconds()).padStart(2, '0');

        if(format == 'hhmm'){
            return `${hours}:${minutes}`
        }else if(format == 'yymmdd'){
            return `${year}-${month}-${day}`
        }else if(format == 'yymm'){
             return `${year}-${month}`
        }

        return`${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    }
}

export default Utils

