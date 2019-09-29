# vue-intelligent-cookie
## 智能数据持久化插件
* 0依赖
* 自动判断LocalStorage、cookie是否可用
* 解决特殊浏览器或者部分浏览器在无痕模式下，LocalStorage、cookie读写失败的问题
* LocalStorage、cookie均不可用时，使用内置数据存储方案

## 运行原理
* 项目基于高人气项目[tiny-cookie](https://www.npmjs.com/package/tiny-cookie "tiny-cookie"),[vue-cookie](https://www.npmjs.com/package/vue-cookie "vue-cookie"),[localstorage-cookie](https://www.npmjs.com/package/localstorage-cookie "localstorage-cookie")重构开发
* 初始化前，判断LocalStorage、cookie的可用性，默认优先使用localStorage，再尝试cookie
* 若两者都不可用，则将缓存保存在运行实例中，保证前端程序的正确运行

## 特别功能
* 可直接存储对象；
* 为LocalStorage拓展实现cookie的参数机制
* 当前采用的运行机制可以控制台查看window.IntelligentCookie.storageMode

## Installation

Install through npm

``` bash

npm install vue-intelligent-cookie --save

```

Include in ```<body>``` after loading Vue and it will automatically hook into Vue

``` html

<script src="/node_modules/vue-intelligent-cookie/dist/min.js'"></script>
or
<script src="/node_modules/vue-intelligent-cookie/src/vue-intelligent-cookie.js'"></script>

 ```

Or do it the cool way and load it in your ```main.js/app.js```

``` javascript

// Require dependencies
var Vue = require('vue');
var IntelligentCookie = require('vue-intelligent-cookie');
// Tell Vue to use the plugin
Vue.use(IntelligentCookie);

```

### Usage
The plugin is available through ```this.$cookie``` in components or ```Vue.cookie```

###### Example
``` javascript

// From some method in one of your Vue components
this.$cookie.set('test', 'Hello world!', 1);
// This will set a cookie with the name 'test' and the value 'Hello world!' that expires in one day

// To get the value of a cookie use
this.$cookie.get('test');

// To delete a cookie use
this.$cookie.delete('test');

```

###### Advanced examples
``` javascript

// Setting the cookie Domain
this.$cookie.set('test', 'Random value', {expires: 1, domain: 'localhost'});

// As this cookie is set with a domain then if you wish to delete it you have to provide the domain when calling delete
this.$cookie.delete('test', {domain: 'localhost'});

// Customizing expires
var date = new Date;
date.setDate(date.getDate() + 21);

this.$cookie.set('dateObject', 'A date object', { expires: date });
this.$cookie.set('dateString', 'A parsable date string', { expires: date.toGMTString() });
this.$cookie.set('integer', 'Seven days later', { expires: 7 });
this.$cookie.set('stringSuffixY', 'One year later', { expires: '1Y' });
this.$cookie.set('stringSuffixM', 'One month later', { expires: '1M' });
this.$cookie.set('stringSuffixD', 'One day later', { expires: '1D' });
this.$cookie.set('stringSuffixh', 'One hour later', { expires: '1h' });
this.$cookie.set('stringSuffixm', 'Ten minutes later', { expires: '10m' });
this.$cookie.set('stringSuffixs', 'Thirty seconds later', { expires: '30s' });

```

Thanks for using the plugin, I am happy to accept feedback/pull requests, do not forget to star if you like it!

Happy Coding! :D

## 下个版本开发计划
* 可配置默认存储
* ts支持
* 添加会话存储

# Thanks
[tiny-cookie](https://www.npmjs.com/package/tiny-cookie "tiny-cookie") 

[vue-cookie](https://www.npmjs.com/package/vue-cookie "vue-cookie") 

[localstorage-cookie](https://www.npmjs.com/package/localstorage-cookie "localstorage-cookie") 