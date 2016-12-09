/**
 * Created by 80474 on 2016/10/22.
 */
/*作者：丁平中
* 开发日期：2016/10/22
* 版本 1.0
* 描述：通用框架
* 版权所有 违者必究*/
//    公共模块
(function(w){
    //    创建一个对象
    function webframe(str){
    }
    webframe.prototype={
//        封装each函数
        each:function(fn){
            for(var i=0;i<this.length;i++)
            {
                fn.call(this[i],i,this[i]);
            }
            return this;
        },
//        添加get eq方法
        get:function(index)
        {
            return this[index]
//            返回dom对象，终止了链式访问
        },
        eq:function(index)
        {
            var dom=this.get(index);
            this.init(dom);
            return this;
        },
        first:function(){
            return this.eq[0];
        },
        last:function(){
            return this.eq(this.length-1);
        }
    }
    //    实例化对象
//        var $=function(str,context) {
//            return new webframe(str,context);
//        }
//        双管齐下
    var $=function(str){
        if(typeof str==="function"){
            window.onload=str;
        }
        else{
            return new webframe().$all(str);
        }
    }
    w.$=$;
    $.extend=function(){
//            作用，当传递的是一个对象时，表示传入的方法参与链式访问，否则就在$符号上添加全局的方法
        var target,source,i=1;
        if(arguments.length===0)
        {
            return;
        }
        else if(arguments.length===1)
        {
            target=webframe.prototype;
            i--;
            source=arguments[i];
        }
        else {
            target=arguments[0];
            source=arguments[i];
        }
        for(var k in source){
            target[k]=source[k];
        }
    }
})(window);
//    外面函数无法访问。webframe对象，无法向里面扩充方法
//    所以在公共模块上在$对象上添加一个全局方法extend来进行扩充
//    标签选择框架
(function($){
    $.extend({
        $all:function(str){
            if(typeof str==="string"){
                var dom=$.$select(str);
                for(var i=0;i<dom.length;i++)
                {
                    this[i]=dom[i];
                }
                this.length=dom.length;
            }
            else{
                if(str.length){
                    //   把str变成真数组
                    for(var i=0;i<str.length;i++)
                    {
                        this[i]=str[i];
                    }
                    this.length=str.length;
                }
                else{
                    this[0]=str;
                    this.length=1;
                }
            }
            return this;
        }
    });
    $.extend($,{
//           id选择器
        //id选择框架
        $id:function(id){
            ////this.element=document.getElementById(id);
            //return this;
            return document.getElementById(id)
        },
        //标签选择框架
        $tag:function(tag,context){
            //滞后预防，先获得要寻找的上下文Dom容器
            //获得dom容器
            var dom =getDom(context);
            //获得最终要找到的tag标签容器
            var elements=getElements(tag,dom);
            return elements;
            //具体实现getDom与getElements两个方法
            function getDom(context)
            {
                if(context)
                {
                    return $.isString(context)?$.$id(context):context;
                }
                else{
                    return document;
                }
            }
            function getElements(tag,dom)
            {
                return dom.getElementsByTagName(tag);
            }
        },
        //class选择框架
        $class:function(selector,context){
            //获得要找的dom容器
            var dom=getDom(context);
            //获得要找的类元素
            var elements=getClass(selector,dom);
            return elements;
            //具体实现如何去找dom容器的方法
            function getDom(context) {
                if(context)
                {
                    return $.isString(context)?$.$id(context):context;
                }
                else{
                    return document
                }
            }
            //实现在dom容器内寻找类元素的方法
            function getClass(selector,dom) {
                //先判断浏览器是否支持document.getElementsByClassName方法，如果支持就用这个
                if(document.getElementsByClassName)
                {
                    return dom.getElementsByClassName(selector)
                }
                else{
                    //如果不支持的话，得到dom容器下的所有元素节点。
                    var domall=dom.getElementsByTagName("*");
                    //遍历循环所有节点，找到classname为selector的节点并放到数据里
                    var result=[];
                    //注意循环伪数组的方法不能用for in
                    var arr,list;
                    for(var i= 0,len=domall.length;i<len;i++)
                    {
                        //获得domall下所有元素的类名的集合字符串
                        arr=domall[i].className;
                        //把类名集合字符串分割成集合数组
                        list=arr.split(" ");
                        //循环里面的类名集合数组，判断里面是否含有所需要的类名
                        for(var k in list)
                        {
                            if(list[k]===selector)
                            {
                                result.push(domall[i])//在结果集中存放domall节点
                            }
                        }
                    }
                    return result;
                }
            }
        },
        //多组选择器
        $group:function(str){
            var result=[];
//        分割字符串
            var firstr,name,domarr;
            var arr=str.split(",");
            for(var k in arr)
            {
//            各个击破法则
//            去除字符串的左右空格
                arr[k]=$.trim(arr[k]);
                firstr=arr[k].charAt(0);
                name=arr[k].substr(1);
                switch(firstr){
                    case "#":
                        result.push($$.$id(name));
                        break ;
                    case  ".":
                        domarr =$$.$class(name);
//                 得到的可能是伪数组，转化真数组
                        Array.prototype.push.apply(result,domarr);
                        break;
                    default :
                        domarr =$$.$tag(arr[k]);
                        Array.prototype.push.apply(result,domarr);
                        break ;
                }
            }
            return  result;
        },
        //层次选择器
        $layer:function(str){
            //  去除前后空格
            str=$.trim(str);
//        获取字符串集并分割成数组
            var arr=str.split(" ");
            var firstr,name;
//        定义一个放回要操作的dom元素集合
            var result;
//        设置当前寻找容器为容器
            var context=[document];//当前要找的元素的入口dom容器
//        注意上面两个数组赋值不能是push
//        管道思想
//        目的是为找到当前筛选匹配的Dom容器
            for(var k in arr){
                firstr=arr[k].charAt(0);
                name=arr[k].slice(1);
                result=[];
                switch(firstr){
                    case "#":
//                  因为id选择器只有一个，所以可以直接再document中去寻找
                        result.push($$.$id(name));
//                    把找到的dom元素赋值给结果集，如果后面循环没有元素的话，只能返回这个数据了。如果有的话，
//                    则把当前的dom容器给context下一次就在context容器内寻找下一个循环的选择器了
                        context =result;
                        break;
                    case ".":
//                    这里匹配到的是class选择器，所以根据上一次的context的容器来寻找找这一次的类选择器。
//                     遍历循环context
                        for(var i= 0,len=context.length;i<len;i++)
                        {
//                          有可能第一个值就是类型选择器，前面的context容器没有值，或者我已经设置了document对象容器入口。
//                          在context[i]值里面去寻找，当前的后代类选择器
                            Array.prototype.push.apply(result,$.$class(name,context[i]));
                        }
//                      如果下一次循环没有后代选择器了，那么就会退出循环返回result结果集，如果有的话，还需要把
//                      当前的result结果集赋值给context容器，刷新context容器的查找入口
                        context =result;
                        break;
                    default :
//                     这里匹配的是标签选择器
//                     遍历循环查找容器入口
                        for(var i= 0,len=context.length;i<len;i++)
                        {
//                            在这个容器里面去寻找标签选择器
                            Array.prototype.push.apply(result,$.$tag(arr[k],context[i]));
                        }
//                        把找到的结果集赋值给下一次要循环查找的context容器入口
                        context=result;
                        break;
                }
            }
            return result;
        },
        //多组加层次
        $select:function(str){
            var result=[];
//        先逗号分隔字符集
            var arr=str.split(",");
            for(var i in arr)
            {
                arr[i]=$.trim(arr[i]);
//            根据空格分隔字符集
                Array.prototype.push.apply(result,$.$layer(arr[i]));
            }
            return result;
        },
    });
})($);
//    css模块
(function($){
//       参与链式访问的模块
    $.extend({
        css:function(key,value){
//               设置模块
            if(value){
                this.each(function(){
                    this.style[key]=value;
                })
                return this;
            }
            else{
                return  getStyle(this[0],key);
            }
            function getStyle (context,str){
                return context.currentStyle?context.currentStyle[str]:window.getComputedStyle(context,null)[str];
            }
        },
        show:function(){
            this.each(function(){
                this.style.display="block";
            });
            return this;
        },
        hide:function(){
            this.each(function(){
                this.style.display="none";//this指向当前遍历的单个dom元素
                //index代表索引号，value代表值
            })
            return this;
        }
    });
//       不参与链式访问的模块
    $.extend($,{

    });
})($);
//    内容模块
(function($){
    $.extend({
        //        封装html方法
        html:function(){
            var str=arguments[0];
            if(str)
            {
//                参与链式访问的代码
                this.each(function(){
                    this.innerHTML=str;
                })
                return this;
            }
            else{
//                不参与链式访问的代码
                return this[0].innerHTML;
            }
        }
    });
    $.extend($,{
    });
})($);
//    事件模块
(function($){
    $.extend($,{});
    $.extend({
        //        封装事件
        on:function(type,fn){
            this.each(function(){
                var that=this;
                if(document.addEventListener)
                {
                    this.addEventListener(type,function(e){
                        fn(e);
                    })
                }
                else if(document.attachEvent){
                    this.attachEvent("on"+type,function(e){
                        e=window.event;
                        fn.call(that,e);
                    })
                }
                else{
                    this["on"+type]=function(e)
                    {
                        fn(e);
                    }
                }
            })
            return this;
        },
//        委派事件
        delegate:function(type,selector,fn){
            var that=this;
            this.each(function(){
                that.init(this).on(type, handler);  //this指向dom对象，要转化为jQuery对象才能调用on方法
            });
            function handler(e) {
//                    得到委派的目标
                var target = e.target || e.srcElement;
                if (target.nodeName.toLowerCase() === selector || target.id.toLowerCase() === selector || target.className === selector) {
                    fn.call(target,e);
                }

            }
            return this;
        }
    });
})($);
//   字符串处理框架
(function($){
    $.extend($,{
        //去除字符串之间的空格
        ltrim:function(str){
            return str.replace(/(^\s*)/g,"");
        },
        rtrim:function(str)
        {
            return str.replace(/(\s*$)/g,"");
        },
        trim:function(str){
            return str.replace(/(^\s*)|(\s*$)/g,"");
        },
        //简单的数据绑定
        formatString:function(reg,data){
            return reg.replace(/<%\s*([^%>]\w+)\s*%>/g,function(match,key){
                return typeof data[key] ==="undefined"? "":data[key]
            })
        },
        //查询字符串
        queryString:function(){
            var str =window.location.search;
            str=str.substr(1);
            str =str.split("&");
            var json={}
            for(var k in str)
            {
                var index =str[k].lastIndexOf("=");
                if(index==-1){
                    json[k]=str[k];
                    continue;
                }
                var key =str[k].substring(0,index);
                var val =str[k].substr(index+1);
                json[key]=val;
            }
            return json;
        }
    })
})($);
//   数据类型检测模块
(function($){
    $.extend($,{
        //数据类型检测
        isNumber:function(val){
            return typeof val ==="number"
        },
        isBoolean:function(val){
            return typeof val ==="boolean"
        },
        isString:function (val) {
            return typeof val === "string";
        },
        /*判断一个变量是不是isUndefined型*/
        isUndefined:function (val) {
            return typeof val === "undefined";
        },
        isObj:function (str){
            if(str === null || typeof str === 'undefined'){
                return false;
            }
            return typeof str === 'object';
        },
        isNull:function (val){
            return  val === null;
        },
        //判断一个变量是不是数组类型
        isArray:function(val){
            if(val === null || typeof val === 'undefined'){
                return false;
            }
            return val.constructor ===Array
        },
        isArray2:function(val)
        {
            return Object.prototype.toString.call(val) ==='[object Array]';
        }
    });
    $.extend({});
})($);
//    属性框架
(function($){
    $.extend({
        //设置或者获取某个元素属性
        attr:function(key,value){
            if(value) {
                //设置模式
                this.each(function(){
                    this.setAttribute(key,value);
                });
                return this;
            }
            else{
                return this[0].getAttribute(key);
            }
        },
        //删除一个或者多个元素属性
        removeAttr:function(){
//        获得传递过来的实参
//         将实参转化为真数组进行数组的一系列操作
            var arr=Array.prototype.slice.call(arguments);
            var attr=arr.slice(0);
            this.each(function(){
                deleteAttr(this);
            })
            function deleteAttr(obj) {
                for(var k in attr)
                {
                    obj.removeAttribute(attr[k])
                }
            }
            return this;
        },
        addClass:function(){
            var arr=Array.prototype.slice.call(arguments),
                attr=arr.slice(0);
            this.each(function(){
                add(this);
            });
            function add(obj)
            {
                for(var k in attr){
                    obj.className+=" "+attr[k]
                }
                obj.className=$.trim(obj.className)//去除classname的前后空格
            }
            return this;
        },
        removeClass:function(){
            //把伪数组转化为真数组进行操作
            var arr=Array.prototype.slice.call(arguments),attr=arr.slice(0);
            //遍历dom元素，循环删除要删的属性值
            this.each(function(){
                deleteAttr(this);
            });
            function deleteAttr(obj){
                //获得当前元素节点的className集合字符串
                var attribute=obj.className;
                //去除前后的空格
                attribute =$.trim(attribute);
                //把集合字符串转化为数组
                var list =attribute.split(" ");
                //循环list数组，和attr数组进行对比，有相同的就删除
                var result=[];//定义最后存放删除过后的数组集合
                var flag;
                //遍历list
                for(var k in list)
                {
                    flag=true;
                    for(var j in attr)
                    {
                        if(list[k]===attr[j]) flag=false;
                    }
                    if(flag)
                    {
                        result.push(list[k])
                    }
                };
                //把最后的结果集数组，转化为字符串集，并赋值给obj.className
                result =result.join(" ");
                obj.className=result;
            }
            return this;
        },
        hasClass:function(){
            var result;
//                一个的模式
            var className=arguments[0];
            result=findClass(this[0],className);
            function findClass(obj,className){
                var targetClass=obj.className,res=false;
                targetClass= $.trim(targetClass);
//                    分割数组
                targetClass =targetClass.split(" ");
                for(var k in targetClass){
                    if(targetClass[k]===className) res=true;
                }
                return res;
            }
            return result;
        },
        //获取元素宽高度值padding+width+body
        height:function(height){
            if(height){
                this.each(function(){
                    this.style.height=parseInt(height)+"px";
                });
                return this;
            }
            else{
                return this[0].offsetHeight;
            }
        },
        width:function(width){
            if(width){
                this.each(function(){
                    this.style.width=parseInt(width)+"px";
                });
                return this;
            }
            else{
                return this[0].offsetWidth;
            }
        },
    });
    $.extend($,{
        scrollTop:function(){
            return document.documentElement.scrollTop || document.body.scrollTop || window.pageYOffset;
        },
        scrollLeft:function(){
            return document.documentElement.scrollLeft || document.body.scrollLeft || window.pageXOffset;
        },
        //获得当前的选中文字
        textselected:function(){
            return window.getSelection?window.getSelection().removeAllRanges():document.selection.empty();
        }
    });
})($);
//     ajax框架
(function($){
    $.extend($,{
        param:function(str){
            var content ="";
            for(var k in str)
            {
                content+=k+"="+str[k]+"&";
            }
            var s =  content.slice(0,content.length-1);
            return s;
        },
        ajax :function(options) {
            var url =options.url || location.pathname;
            var type =options.type || "get";
            var data =this.param(options.data);
            var xhr =new XMLHttpRequest();
            if(type=="get")
            {
                url =url +"?"+data;
                data=null;
            }
            xhr.open(type,url);
            if(type =="post")
            {
                xhr.setRequestHeader("Content-Type","application/x-www-form-urlencoded");
            }
            xhr.send(data);
            xhr.onreadystatechange =function(){
                if(this.status ==200 && this.readyState ==4)
                {
                    var str =this.getResponseHeader('Content-Type');
                    var result="";
                    if(str.indexOf("xml")!=-1)
                    {
                        result =this.responseXML;
                    }
                    else{
                        result =this.responseText;
                    }
                    options.success(result);
                }
                else{
                    options.error("执行错误");
                }
            }
        }
    })
})($);
//动画框架  基于时间的匀速动画框架
(function($){
    $.extend({
        animate:function(json,duration,fn){
//        分析动画函数需要哪些变量
//     /   1.执行动画的dom对象，json属性数据，动画总时长，我们需要把用户传递过来的数据转化为动画函数需要的数据
//    动画函数需要的数据：执行动画的开始时间，每次执行动画经过的时间，循环执行动画的定时器，动画的进程，
//      用户传递的目标属性值，根据用户传递过来的json属性，计算当前各个属性的初始值。
//        定义一个适配器函数，将用户传递过来的数据，转化动画函数所需要的执行变量

//        var obj=adapter(context,json,duration);//单个物体的所有属性放到一个obj字面量对象里保存
////        适配器函数，为obj对象适配anmiate函数所需要的属性
////        添加部
//        run(obj);
            var obj={};
            var dom=this[0];
//        var flag=false;//设置物体运动是点击无效
            var target=true;//设置物体到达目标位置是点击无效
            for(var k in json)
            {
                var startPosition =parseFloat($(dom).css(k));
                if(startPosition!==parseFloat(json[k])) target=false;
            }
            if(target) return;
            clearInterval(dom.timer);
            run();
            function adapter(json,duration) {
//            var obj={};
                obj.duration=duration;
                obj.startTime=+new Date();
                obj.passTime=0;
                obj.tween=0;//动画的进程
                obj.style=getStyle(json);
//            return obj;
            }
//        根据json值适配style样式数组{left:200px,top:100px} [{name:left,start:xxx,target200px},{},{}]
            function getStyle(json){
                var result=[];
                for(var k in json)
                {
                    var obj={};
                    obj.name=k;
                    obj.start= parseFloat($(dom).css(k));
                    obj.target=parseFloat(json[k]);
                    result.push(obj);
                }
                return result;
            }
//        动画运行函数,不断循环move
//        运行部
            function run(){
//            得到适配器的值
                adapter(json,duration);
                obj.flag=true;
                dom.timer=setInterval(function(){
                    move();
                },20);
            }
            function move(){
//            得到每次的动画进程,要传递的数值为开始的时间，当前经过的时间总时间
                var pass=+new Date();
                obj.tween =getTween(obj.startTime,pass,obj.duration);
//            计算各个属性要运动的距离
                setDistance(obj.tween);
                isOver(obj.tween);
            }
            function getTween(start,pass,duration) {
                var tween;
                tween=(pass-start)/duration;
                return tween
            }
            function setDistance(tween){
                var styles=obj.style;
                for(var k in styles)
                {
                    var arr=styles[k];
//                设置单个物体单个属性
                    setOneDistance(arr.name,arr.start,arr.target,tween);
                }
            }
            function stop() {
                if(fn){
                    fn();
                }
            }
            function setOneDistance(name,start,target,tween){
                var moveDistane;
                if(name==="opacity")
                {
                    moveDistane=start+(target-start)*tween;
                }
                else{
                    moveDistane=start+(target-start)*tween+"px";
                }
                $(dom).css(name,moveDistane);
            }
            function isOver(tween){
                if(tween>=1)
                {
                    clearInterval(dom.timer);
                    setDistance(1);
                    stop();
                }
            }
        }
    })
})($);
//缓动动画框架  基于距离的变速动画框架
(function($){
    $.extend({
        animateH:function(json,speed,fn) {
//        缓动动画需要哪些变量
//        dom对象，物体的开始位置，目标位置，样式数组。回调函数，可选
            var dom=this[0];
            var obj={

            };
            clearInterval(dom.timer);
            run();
//        运行部
            function run(){
                adpter(json,speed);
                dom.timer=setInterval(function(){move()},20)
            }
            function move(){
                var style=obj.styles;
                setManyAttr(style);
                isOver(style);
            }
            function setManyAttr(style) {
                for(var k in style)
                {
                    setOneAttr(style[k])
                }
            }
            function setOneAttr(style) {
                var moveDistance,currentPosition;
                if(style.name==="opacity")
                {
                    currentPosition=parseFloat($(dom).css(style.name))*100;
                }
                else{
                    currentPosition=parseFloat($(dom).css(style.name));
                }
                var step=(style.target-currentPosition)/obj.speed;
                step=step>0?Math.ceil(step):Math.floor(step);
                if(style.name==="opacity")
                {
                    moveDistance=(currentPosition+step);
                    $(dom).css(style.name,moveDistance/100);
                }
                else{
                    moveDistance=currentPosition+step+"px";
                    $(dom).css(style.name,moveDistance);
                }
            }
            function isOver(style){
                var flag=true;
                for(var k in style){
                    if(style[k].name==="opacity")
                    {
                        if(parseFloat($(dom).css(style[k].name))*100!==style[k].target) flag=false;
                    }
                    else{
                        if(parseFloat($(dom).css(style[k].name))!==style[k].target) flag=false;
                    }
                }
                if(flag)
                {
                    clearInterval(dom.timer);
                    if(fn)
                    {
                        fn();
                    }
                }
            }
//        添加部
            function adpter(json,speed){
                obj.speed=speed || 10;
                obj.styles=getStyle(json)
            }
            function getStyle(json){
                var result=[];
                for(var k in json){
                    var obj={};
                    obj.name=k;
                    if(k==="opacity")
                    {
                        obj.target=parseFloat(json[k])*100;
                    }
                    else{
                        obj.target=parseFloat(json[k])
                    }
                    result.push(obj);
                }
                return result;
            }
        }
    })
})($);
//移动端框架
(function($){
    $.extend({
        //触摸开始事件
        touchstart:function(fn){
            this.each(function(){
                $(this).on("touchstart",fn)
            });
        },
        touchmove:function(fn){
            this.each(function(){
                $(this).on("touchmove",fn)
            });
        },
        touchend:function(fn)
        {
            this.each(function(){
                $(this).on("touchend",fn)
            });
        },
        tap:function(fn){
            var starTime=0;
            this.each(function(){
                var isMove=false;
                $(this).touchstart(function(){
                    starTime =Date.now();
                })
                $(this).touchmove(function(){
                    isMove =true;
                })
                $(this).touchend(function(e){
                    if(!isMove && (Date.now()-starTime)<300)
                    {
                        if(fn)
                        {
                            fn(e);
                        }
                    }
                    isMove =false;
                })
            })
        },
        swipeLeft:function(){

        },
        swipeRight:function(){

        }
    })
})($);