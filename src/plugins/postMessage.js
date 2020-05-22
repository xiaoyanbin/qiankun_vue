"use strict";
import Vue from 'vue';
/**
 * 封装 相互通信的底层方法
 * */
// 消息回调队列
class MessageQueue {
    constructor(){

    }
    // 同意注入的相关的权限内容
    acceptMessageQueue = []
    // 加入通信队列
    addMessageQueue(type,callback) {
        let acceptMessageQueue = allMessageQueue.acceptMessageQueue;
        let data = {};
        data.type = type;
        data.callBack = callback;
        data.mark = acceptMessageQueue.length + 1;
        acceptMessageQueue.push(data);
        // 返回 消息队列的唯一标识 方便删除
        return data.mark;
    }
    // 删除通信队列
    removeMessageQueue (mark) {
        let acceptMessageQueue = allMessageQueue.acceptMessageQueue;
        for(let i = 0 ; i < acceptMessageQueue.length ; i ++){
            if(acceptMessageQueue[i].mark == mark){
                acceptMessageQueue.splice(i,1);
            }
        }
    }
    // 给父发送消息
    sendParentMessage(data,origin=undefined) {
        if(!origin){
            // 获取 身份相关的校验信息 发送到父节点信息
            origin = localStorage.getItem('origin') || '*'
        }
        window.parent.postMessage(data,origin)
    }
    // 给子目标发送消息
    sendChildrenMessage(data,origin) {
        window.frames[0].postMessage(data,origin)
    }
    initMessageQueue() {
        let acceptMessageQueue = allMessageQueue.acceptMessageQueue;
        // 监听通信
        window.addEventListener("message", function( event ){
            // 循环每一个子组件注入的 方法对象 进行以此回调
            for(let i = 0 ; i < acceptMessageQueue.length ; i++){
                // 消息类型 判断
                if(acceptMessageQueue[i].type == event.data.type){
                    acceptMessageQueue[i].callBack(event.data,event)
                }
            }
        }, false );
    }
}
let allMessageQueue = new MessageQueue();
// 初始化 监听
allMessageQueue.initMessageQueue();

// 加入 vue 插件内容
let message = {}; message.install = function(Vue, options) {
    window.messageQueueOperation = allMessageQueue;
    Object.defineProperties(Vue.prototype, {
        addMessageQueue: {
            get() {
                return allMessageQueue.addMessageQueue
            }
        },
        removeMessageQueue: {
            get() {
                return allMessageQueue.removeMessageQueue
            }
        },
        sendParentMessage:{
            get(){
                return allMessageQueue.sendParentMessage
            }
        },
        sendChildrenMessage:{
            get(){
                return allMessageQueue.sendChildrenMessage
            }
        }
    });
};

Vue.use(message)
