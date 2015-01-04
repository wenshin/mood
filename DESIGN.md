## 使用接口

使用绑定事件的方式实现双向绑定和元素自带事件的统一

```
/*
 * 1. 遍历 mo-app="myapp" 范围的DOM，形成 Scope schema，绑定定义的（更新和控制事件）。
 *    更新事件是指，Scope属性发生变化后触发的事件。控制事件是指可以修改Scope属性的时间。
 * 2. 初始化一个Mood对象，并返回。
 * * /

var app = mood.init('myapp');
var testElem = mood('#test-elem');
testElem.on('control.name', function(event, scope) {})
testElem.on('update.name', function(event, scope) {})


var myscope = app.getScope('myscope');


/* 什么是 controller 什么是updator？
 * controller 可以改变scope的值，mo-click, mo-mouseover, mo-mousein。
 * updator: 不能改变scope的值只能使用。比如，mo-html, mo-text, mo-each,
 *   mo-class, mo-id, mo-style, mo-value, ...
 * */

myscope.on('control.name', 'div', function(event, scope){ /* this is the scope elem */ });

mysope.on('update.prop', 'div', function(event, scope){/* this is the scope elem */});

events.Manager.bind(scope);

mysope.on('update.prop', 'div', function(event, scope){/* this is the scope elem */});

mysope.on('click.name', 'div' or elem, function(event, scope){/* this is the scope elem */});

mysope.on('click.name', [descendants selector], function(event, scope){/* this is the descendants elem */});

myscope.trigger('update.name');  // 手动触发帮定的函数；是否需要？


标记类型
mo-app
mo-scope
mo-each
mo-text
mo-html
mo-class
mo-shown="scope.isShown"
mo-click="controller"
mo-hover="controller"

```
