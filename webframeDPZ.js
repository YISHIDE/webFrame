/**
 * Created by 80474 on 2016/10/22.
 */
/*���ߣ���ƽ��
* �������ڣ�2016/10/22
* �汾 1.0
* ������ͨ�ÿ��
* ��Ȩ���� Υ�߱ؾ�*/
//    ����ģ��
(function(w){
    //    ����һ������
    function webframe(str){
    }
    webframe.prototype={
//        ��װeach����
        each:function(fn){
            for(var i=0;i<this.length;i++)
            {
                fn.call(this[i],i,this[i]);
            }
            return this;
        },
//        ���get eq����
        get:function(index)
        {
            return this[index]
//            ����dom������ֹ����ʽ����
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
    //    ʵ��������
//        var $=function(str,context) {
//            return new webframe(str,context);
//        }
//        ˫������
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
//            ���ã������ݵ���һ������ʱ����ʾ����ķ���������ʽ���ʣ��������$���������ȫ�ֵķ���
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
//    ���溯���޷����ʡ�webframe�����޷����������䷽��
//    �����ڹ���ģ������$���������һ��ȫ�ַ���extend����������
//    ��ǩѡ����
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
                    //   ��str���������
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
//           idѡ����
        //idѡ����
        $id:function(id){
            ////this.element=document.getElementById(id);
            //return this;
            return document.getElementById(id)
        },
        //��ǩѡ����
        $tag:function(tag,context){
            //�ͺ�Ԥ�����Ȼ��ҪѰ�ҵ�������Dom����
            //���dom����
            var dom =getDom(context);
            //�������Ҫ�ҵ���tag��ǩ����
            var elements=getElements(tag,dom);
            return elements;
            //����ʵ��getDom��getElements��������
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
        //classѡ����
        $class:function(selector,context){
            //���Ҫ�ҵ�dom����
            var dom=getDom(context);
            //���Ҫ�ҵ���Ԫ��
            var elements=getClass(selector,dom);
            return elements;
            //����ʵ�����ȥ��dom�����ķ���
            function getDom(context) {
                if(context)
                {
                    return $.isString(context)?$.$id(context):context;
                }
                else{
                    return document
                }
            }
            //ʵ����dom������Ѱ����Ԫ�صķ���
            function getClass(selector,dom) {
                //���ж�������Ƿ�֧��document.getElementsByClassName���������֧�־������
                if(document.getElementsByClassName)
                {
                    return dom.getElementsByClassName(selector)
                }
                else{
                    //�����֧�ֵĻ����õ�dom�����µ�����Ԫ�ؽڵ㡣
                    var domall=dom.getElementsByTagName("*");
                    //����ѭ�����нڵ㣬�ҵ�classnameΪselector�Ľڵ㲢�ŵ�������
                    var result=[];
                    //ע��ѭ��α����ķ���������for in
                    var arr,list;
                    for(var i= 0,len=domall.length;i<len;i++)
                    {
                        //���domall������Ԫ�ص������ļ����ַ���
                        arr=domall[i].className;
                        //�����������ַ����ָ�ɼ�������
                        list=arr.split(" ");
                        //ѭ������������������飬�ж������Ƿ�������Ҫ������
                        for(var k in list)
                        {
                            if(list[k]===selector)
                            {
                                result.push(domall[i])//�ڽ�����д��domall�ڵ�
                            }
                        }
                    }
                    return result;
                }
            }
        },
        //����ѡ����
        $group:function(str){
            var result=[];
//        �ָ��ַ���
            var firstr,name,domarr;
            var arr=str.split(",");
            for(var k in arr)
            {
//            �������Ʒ���
//            ȥ���ַ��������ҿո�
                arr[k]=$.trim(arr[k]);
                firstr=arr[k].charAt(0);
                name=arr[k].substr(1);
                switch(firstr){
                    case "#":
                        result.push($$.$id(name));
                        break ;
                    case  ".":
                        domarr =$$.$class(name);
//                 �õ��Ŀ�����α���飬ת��������
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
        //���ѡ����
        $layer:function(str){
            //  ȥ��ǰ��ո�
            str=$.trim(str);
//        ��ȡ�ַ��������ָ������
            var arr=str.split(" ");
            var firstr,name;
//        ����һ���Ż�Ҫ������domԪ�ؼ���
            var result;
//        ���õ�ǰѰ������Ϊ����
            var context=[document];//��ǰҪ�ҵ�Ԫ�ص����dom����
//        ע�������������鸳ֵ������push
//        �ܵ�˼��
//        Ŀ����Ϊ�ҵ���ǰɸѡƥ���Dom����
            for(var k in arr){
                firstr=arr[k].charAt(0);
                name=arr[k].slice(1);
                result=[];
                switch(firstr){
                    case "#":
//                  ��Ϊidѡ����ֻ��һ�������Կ���ֱ����document��ȥѰ��
                        result.push($$.$id(name));
//                    ���ҵ���domԪ�ظ�ֵ����������������ѭ��û��Ԫ�صĻ���ֻ�ܷ�����������ˡ�����еĻ���
//                    ��ѵ�ǰ��dom������context��һ�ξ���context������Ѱ����һ��ѭ����ѡ������
                        context =result;
                        break;
                    case ".":
//                    ����ƥ�䵽����classѡ���������Ը�����һ�ε�context��������Ѱ������һ�ε���ѡ������
//                     ����ѭ��context
                        for(var i= 0,len=context.length;i<len;i++)
                        {
//                          �п��ܵ�һ��ֵ��������ѡ������ǰ���context����û��ֵ���������Ѿ�������document����������ڡ�
//                          ��context[i]ֵ����ȥѰ�ң���ǰ�ĺ����ѡ����
                            Array.prototype.push.apply(result,$.$class(name,context[i]));
                        }
//                      �����һ��ѭ��û�к��ѡ�����ˣ���ô�ͻ��˳�ѭ������result�����������еĻ�������Ҫ��
//                      ��ǰ��result�������ֵ��context������ˢ��context�����Ĳ������
                        context =result;
                        break;
                    default :
//                     ����ƥ����Ǳ�ǩѡ����
//                     ����ѭ�������������
                        for(var i= 0,len=context.length;i<len;i++)
                        {
//                            �������������ȥѰ�ұ�ǩѡ����
                            Array.prototype.push.apply(result,$.$tag(arr[k],context[i]));
                        }
//                        ���ҵ��Ľ������ֵ����һ��Ҫѭ�����ҵ�context�������
                        context=result;
                        break;
                }
            }
            return result;
        },
        //����Ӳ��
        $select:function(str){
            var result=[];
//        �ȶ��ŷָ��ַ���
            var arr=str.split(",");
            for(var i in arr)
            {
                arr[i]=$.trim(arr[i]);
//            ���ݿո�ָ��ַ���
                Array.prototype.push.apply(result,$.$layer(arr[i]));
            }
            return result;
        },
    });
})($);
//    cssģ��
(function($){
//       ������ʽ���ʵ�ģ��
    $.extend({
        css:function(key,value){
//               ����ģ��
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
                this.style.display="none";//thisָ��ǰ�����ĵ���domԪ��
                //index���������ţ�value����ֵ
            })
            return this;
        }
    });
//       ��������ʽ���ʵ�ģ��
    $.extend($,{

    });
})($);
//    ����ģ��
(function($){
    $.extend({
        //        ��װhtml����
        html:function(){
            var str=arguments[0];
            if(str)
            {
//                ������ʽ���ʵĴ���
                this.each(function(){
                    this.innerHTML=str;
                })
                return this;
            }
            else{
//                ��������ʽ���ʵĴ���
                return this[0].innerHTML;
            }
        }
    });
    $.extend($,{
    });
})($);
//    �¼�ģ��
(function($){
    $.extend($,{});
    $.extend({
        //        ��װ�¼�
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
//        ί���¼�
        delegate:function(type,selector,fn){
            var that=this;
            this.each(function(){
                that.init(this).on(type, handler);  //thisָ��dom����Ҫת��ΪjQuery������ܵ���on����
            });
            function handler(e) {
//                    �õ�ί�ɵ�Ŀ��
                var target = e.target || e.srcElement;
                if (target.nodeName.toLowerCase() === selector || target.id.toLowerCase() === selector || target.className === selector) {
                    fn.call(target,e);
                }

            }
            return this;
        }
    });
})($);
//   �ַ���������
(function($){
    $.extend($,{
        //ȥ���ַ���֮��Ŀո�
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
        //�򵥵����ݰ�
        formatString:function(reg,data){
            return reg.replace(/<%\s*([^%>]\w+)\s*%>/g,function(match,key){
                return typeof data[key] ==="undefined"? "":data[key]
            })
        },
        //��ѯ�ַ���
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
//   �������ͼ��ģ��
(function($){
    $.extend($,{
        //�������ͼ��
        isNumber:function(val){
            return typeof val ==="number"
        },
        isBoolean:function(val){
            return typeof val ==="boolean"
        },
        isString:function (val) {
            return typeof val === "string";
        },
        /*�ж�һ�������ǲ���isUndefined��*/
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
        //�ж�һ�������ǲ�����������
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
//    ���Կ��
(function($){
    $.extend({
        //���û��߻�ȡĳ��Ԫ������
        attr:function(key,value){
            if(value) {
                //����ģʽ
                this.each(function(){
                    this.setAttribute(key,value);
                });
                return this;
            }
            else{
                return this[0].getAttribute(key);
            }
        },
        //ɾ��һ�����߶��Ԫ������
        removeAttr:function(){
//        ��ô��ݹ�����ʵ��
//         ��ʵ��ת��Ϊ��������������һϵ�в���
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
                obj.className=$.trim(obj.className)//ȥ��classname��ǰ��ո�
            }
            return this;
        },
        removeClass:function(){
            //��α����ת��Ϊ��������в���
            var arr=Array.prototype.slice.call(arguments),attr=arr.slice(0);
            //����domԪ�أ�ѭ��ɾ��Ҫɾ������ֵ
            this.each(function(){
                deleteAttr(this);
            });
            function deleteAttr(obj){
                //��õ�ǰԪ�ؽڵ��className�����ַ���
                var attribute=obj.className;
                //ȥ��ǰ��Ŀո�
                attribute =$.trim(attribute);
                //�Ѽ����ַ���ת��Ϊ����
                var list =attribute.split(" ");
                //ѭ��list���飬��attr������жԱȣ�����ͬ�ľ�ɾ��
                var result=[];//���������ɾ����������鼯��
                var flag;
                //����list
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
                //�����Ľ�������飬ת��Ϊ�ַ�����������ֵ��obj.className
                result =result.join(" ");
                obj.className=result;
            }
            return this;
        },
        hasClass:function(){
            var result;
//                һ����ģʽ
            var className=arguments[0];
            result=findClass(this[0],className);
            function findClass(obj,className){
                var targetClass=obj.className,res=false;
                targetClass= $.trim(targetClass);
//                    �ָ�����
                targetClass =targetClass.split(" ");
                for(var k in targetClass){
                    if(targetClass[k]===className) res=true;
                }
                return res;
            }
            return result;
        },
        //��ȡԪ�ؿ�߶�ֵpadding+width+body
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
        //��õ�ǰ��ѡ������
        textselected:function(){
            return window.getSelection?window.getSelection().removeAllRanges():document.selection.empty();
        }
    });
})($);
//     ajax���
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
                    options.error("ִ�д���");
                }
            }
        }
    })
})($);
//�������  ����ʱ������ٶ������
(function($){
    $.extend({
        animate:function(json,duration,fn){
//        ��������������Ҫ��Щ����
//     /   1.ִ�ж�����dom����json�������ݣ�������ʱ����������Ҫ���û����ݹ���������ת��Ϊ����������Ҫ������
//    ����������Ҫ�����ݣ�ִ�ж����Ŀ�ʼʱ�䣬ÿ��ִ�ж���������ʱ�䣬ѭ��ִ�ж����Ķ�ʱ���������Ľ��̣�
//      �û����ݵ�Ŀ������ֵ�������û����ݹ�����json���ԣ����㵱ǰ�������Եĳ�ʼֵ��
//        ����һ�����������������û����ݹ��������ݣ�ת��������������Ҫ��ִ�б���

//        var obj=adapter(context,json,duration);//����������������Էŵ�һ��obj�����������ﱣ��
////        ������������Ϊobj��������anmiate��������Ҫ������
////        ��Ӳ�
//        run(obj);
            var obj={};
            var dom=this[0];
//        var flag=false;//���������˶��ǵ����Ч
            var target=true;//�������嵽��Ŀ��λ���ǵ����Ч
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
                obj.tween=0;//�����Ľ���
                obj.style=getStyle(json);
//            return obj;
            }
//        ����jsonֵ����style��ʽ����{left:200px,top:100px} [{name:left,start:xxx,target200px},{},{}]
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
//        �������к���,����ѭ��move
//        ���в�
            function run(){
//            �õ���������ֵ
                adapter(json,duration);
                obj.flag=true;
                dom.timer=setInterval(function(){
                    move();
                },20);
            }
            function move(){
//            �õ�ÿ�εĶ�������,Ҫ���ݵ���ֵΪ��ʼ��ʱ�䣬��ǰ������ʱ����ʱ��
                var pass=+new Date();
                obj.tween =getTween(obj.startTime,pass,obj.duration);
//            �����������Ҫ�˶��ľ���
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
//                ���õ������嵥������
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
//�����������  ���ھ���ı��ٶ������
(function($){
    $.extend({
        animateH:function(json,speed,fn) {
//        ����������Ҫ��Щ����
//        dom��������Ŀ�ʼλ�ã�Ŀ��λ�ã���ʽ���顣�ص���������ѡ
            var dom=this[0];
            var obj={

            };
            clearInterval(dom.timer);
            run();
//        ���в�
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
//        ��Ӳ�
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
//�ƶ��˿��
(function($){
    $.extend({
        //������ʼ�¼�
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