<script lang="ts">

import {computed, defineComponent, ref} from 'vue'
import {NButton, useMessage, NInput, UploadFileInfo} from 'naive-ui'
import PaperPlaneOutline from '@vicons/ionicons5/PaperPlaneOutline'
import ReloadOutline from '@vicons/ionicons5/ReloadOutline'
import {onMounted} from 'vue';

export default defineComponent({
    components: {ReloadOutline},
    setup() {

        type User = {
            userId: string
        }

        let socket: WebSocket;
        const userId = ref(localStorage.getItem("ms_uuid"))
        const content = ref('')

        const message = useMessage()

        const loading = ref(false)
        const onlinePeopleLoading = ref(false)

        const webSocketOpen = ref(false)

        const generateUUID = () => {
            return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
                const r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
                return v.toString(16);
            });
        }

        const avatars = 'https://07akioni.oss-cn-beijing.aliyuncs.com/07akioni.jpeg'


        const messageList = ref([])
        const userList = ref<string[]>([]);


        const openSocket = () => {
            if (typeof WebSocket == "undefined") {
                console.log("您的浏览器不支持WebSocket");
            } else {
                console.log("您的浏览器支持WebSocket");
                //实现化WebSocket对象，指定要连接的服务器地址与端口  建立连接
                //等同于socket = new WebSocket("ws://localhost:8888/xxxx/im/25");
                //var socketUrl="${request.contextPath}/im/"+$("#userId").val();
                var socketUrl =
                    "http://localhost:8999/fish-table-design-api/imserver/" + userId.value;
                socketUrl = socketUrl.replace("https", "ws").replace("http", "ws");
                console.log(socketUrl);
                debugger
                if (socket !== null && socket instanceof WebSocket) {
                    socket.close()
                    socket = null
                }
                socket = new WebSocket(socketUrl);
                //打开事件
                // socket.value = new WebSocket(socketUrl);
                //打开事件
                socket.onopen = function () {
                    console.log("websocket已打开");
                    //socket.send("这是来自客户端的消息" + location.href + new Date());
                    webSocketOpen.value = true
                };
                //获得消息事件
                socket.onmessage = function (msg) {
                    // console.log(msg.data);
                    let rtn = JSON.parse(msg.data)
                    if (rtn.messageType == 'message') {
                        messageList.value.push(JSON.parse(msg.data))
                    }
                    if (rtn.messageType == 'userList') {
                        userList.value = JSON.parse(JSON.parse(msg.data).content)

                    }

                    //发现消息进入    开始处理前端触发逻辑
                };
                //关闭事件
                socket.onclose = function () {
                    console.log("websocket已关闭");
                    webSocketOpen.value = false
                };
                //发生了错误事件
                socket.onerror = function () {
                    console.log("websocket发生了错误");
                    webSocketOpen.value = false
                };
            }
        }


        return {
            webSocketOpen,
            WebSocket,
            socket,
            userId,
            avatars,
            content,
            onlinePeopleLoading,
            messageList,
            userList,
            loading,
            PaperPlaneOutline,
            ReloadOutline,
            flushedOnlinePeople() {
                try {
                    onlinePeopleLoading.value = true
                    let parms = {messageType: "userList"}
                    socket.send(JSON.stringify(parms));
                } catch (e) {
                    message.error("出错了...")
                    onlinePeopleLoading.value = false
                } finally {
                    onlinePeopleLoading.value = false
                }

            },
            openSocket,
            sendMessage() {
                if (typeof WebSocket == "undefined") {
                    console.log("您的浏览器不支持WebSocket");
                } else {
                    console.log("您的浏览器支持WebSocket");
                    let parms = {content: content.value, messageType: "message"}
                    socket.send(JSON.stringify(parms));
                    content.value = ''
                }
            },
            joinContact() {
                if (typeof localStorage.getItem("ms_uuid") == 'undefined' || localStorage.getItem("ms_uuid") == null || localStorage.getItem("ms_uuid") == '') {
                    let temVal = generateUUID()
                    localStorage.setItem("ms_uuid", temVal)
                    userId.value = temVal
                }
                openSocket()
                message.info("加入成功...")
            },
            cleanMessage() {
                messageList.value = []
            }
        }


    }


})
</script>


<template>
    <div class="container">
        <!-- 左侧在线用户列表 -->
        <div class="left-panel">
            <div class="online-users">
                <n-divider class="sticky-divider" >
                    <h5>在线用户({{userList.length}})</h5>
                    <!--                    <n-icon :component="ReloadOutline" @click="flushedOnlinePeople" style="cursor: pointer"></n-icon>-->
                    <n-float-button position="relative" height="25" width="25" @click="flushedOnlinePeople"
                                    style="margin: -3px 0 0 5px">
                        <n-badge>
                            <n-icon>
                                <ReloadOutline/>
                            </n-icon>
                        </n-badge>
                    </n-float-button>
                </n-divider>
                <n-spin :show="onlinePeopleLoading">
                    <ul>
                        <li v-for="user in userList" :key="user">
                            <img class="avatar" :src="avatars" alt="">
                            <span>{{ user }}</span>
                        </li>
                    </ul>
                </n-spin>

            </div>
        </div>

        <!-- 右侧聊天内容 -->
        <div class="right-panel">
            <!-- 固定在顶部的公共聊天室标题 -->
            <div class="header">
                公共聊天室
                <div class="float-right">
                    <n-gradient-text type="success" class="float-right"
                                     v-if="webSocketOpen">
                        正在聊天
                    </n-gradient-text>
                    <n-gradient-text type="info" style="cursor: pointer" @click="joinContact" v-else>
                        加入聊天
                    </n-gradient-text>
                </div>

            </div>

            <!-- 聊天内容区域 -->
            <div class="chat-box">
                <div
                        v-for="item in messageList"
                        :key="item.userId"
                        class="message"
                        :class="{ reverse: item.userId  === userId }"
                >
                    <img class="avatar" :src="avatars" alt="">

                    <div class="message-content">
                        <!-- 显示名字 -->
                        <div class="name">{{ item.userId }}</div>

                        <!-- 包裹消息的白色卡片 -->
                        <div class="message-bubble">
                            <span>{{ item.content }}</span>
                        </div>
                    </div>
                </div>

                <div v-if="loading" class="text">
                    加载中...
                </div>
                <div class="text">
                    没有更多了 🤪
                </div>
            </div>

            <!-- 固定在底部的 footer -->
            <div class="footer">
                <!-- 你可以在这里放一些内容，比如输入框，按钮等 -->
                <NInput type="textarea" placeholder="输入消息..." :autosize="{minRows: 3}"
                        v-model:value="content"></NInput>
                <div class="button-container">
                    <n-button @click="sendMessage">
                        <template #icon>
                            <n-icon :component="PaperPlaneOutline"></n-icon>
                        </template>
                        {{ '发送' }}
                    </n-button>
                    <n-button @click="cleanMessage">
                        <template #icon>
                            <n-icon :component="ReloadOutline"></n-icon>
                        </template>
                        {{ '清屏' }}
                    </n-button>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
/* 容器布局 */
.container {
    display: flex;
    height: 100vh;
}

/* 左侧面板 */
.left-panel {
    width: 20%;
    border-right: 1px solid #ccc;
    overflow-y: auto;
}

.left-panel ul {
    padding: 0 0 0 10px;
}

.sticky-divider {
    height: 43px;
    position: sticky;
    top: 0;
    background-color: #f5f5f5; /* 保持背景色一致 */
    z-index: 10; /* 确保它在其他内容上方 */
    border-bottom: 1px solid #ccc;
}

.online-users li {
    display: flex;
    align-items: center;
    margin-bottom: 10px;
}

.online-users .avatar {
    width: 28px;
    height: 28px;
    border-radius: 50%;
    margin-right: 10px;
}

/* 右侧面板 */
.right-panel {
    width: 80%;
    display: flex;
    flex-direction: column;
    position: relative;
}

/* 固定在顶部的公共聊天室标题 */
.header {
    background-color: #f5f5f5;
    padding: 10px;
    text-align: center;
    font-weight: bold;
    border-bottom: 1px solid #ccc;
    position: relative;
    top: 0;
    z-index: 1;
}

.float-right {
    float: right;
}

/* 聊天内容区域 */
.chat-box {
    flex: 1;
    padding: 10px;
    overflow-y: auto;
//margin-bottom: 10px; /* 给底部留出空间 */
}


.message {
    display: flex;
    align-items: center;
    margin-bottom: 10px;
    padding: 10px;
}

.message:last-child {
    margin-bottom: 0;
}

.reverse {
    flex-direction: row-reverse;
}

.reverse .avatar {
    margin-left: 10px;
}

.avatar {
    width: 28px;
    height: 28px;
    border-radius: 50%;
    margin-right: 10px;
}

.text {
    text-align: center;
}


/* 固定在底部的 footer */
.footer {
    background-color: #f5f5f5;
    padding: 10px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    position: sticky;
    bottom: 0;
    border-top: 1px solid #ccc;
    z-index: 1;
}

.message-input {
    width: 80%;
    padding: 5px;
    border-radius: 4px;
    border: 1px solid #ccc;
    outline: none;
}


.button-container {
    display: flex;
    flex-direction: column; /* 垂直方向排列 */
    justify-content: space-between;
    height: 80px; /* 控制高度，按钮之间有间隔 */
    margin-left: 10px;
}


/* 名字样式 */
.name {
    font-size: 12px;
    color: gray;
    margin-top: -3px;
}

.message {
    display: flex;
    align-items: flex-start; /* 让头像和名字对齐 */
    margin-bottom: 10px;
    padding: 10px;
}

.reverse {
    flex-direction: row-reverse;
    text-align: right; /* 让内容靠右对齐 */
}

.reverse .avatar {
    margin-left: 10px;
}

.avatar {
    width: 28px;
    height: 28px;
    border-radius: 50%;
    margin-right: 5px;
}

.message-content {
    display: flex;
    flex-direction: column;
    align-items: flex-start; /* 默认情况下让名字和消息靠左对齐 */
}

.reverse .message-content {
    align-items: flex-end; /* 让名字和消息靠右对齐 */
}


.message-bubble {
    background-color: #fff;
    padding: 8px 12px;
    border-radius: 12px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    max-width: 70%;
    word-wrap: break-word;
}

.reverse .message-bubble {
    text-align: right;
}

.message-bubble span {
    font-size: 14px;
    color: #333;
}


.n-divider:not(.n-divider--vertical) {

    margin-top: 0;
    margin-bottom: 0;

}

/* 设置滚动条的宽度和颜色 */
::-webkit-scrollbar {
    width: 8px;
}

/* 滚动条轨道 */
::-webkit-scrollbar-track {
    background-color: #f1f1f1;
}

/* 滚动条滑块 */
::-webkit-scrollbar-thumb {
    background-color: rgba(85, 85, 85, 0.4);
    border-radius: 6px;
}

/* 滚动条滑块悬停样式 */
::-webkit-scrollbar-thumb:hover {
    background-color: rgba(85, 85, 85, 0.3);
}

</style>
