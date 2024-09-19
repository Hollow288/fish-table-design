<script lang="ts">

import {computed, defineComponent, ref} from 'vue'
import {NButton, useMessage, NInput, UploadFileInfo} from 'naive-ui'
import PaperPlaneOutline from '@vicons/ionicons5/PaperPlaneOutline'
import ReloadOutline from '@vicons/ionicons5/ReloadOutline'
import {onMounted} from 'vue';

export default defineComponent({
    components: {ReloadOutline},
    setup() {

        onMounted(() => {
            message.info("点了？")
            // Todo
        });

        const message = useMessage()

        const loading = ref(false)
        const onlinePeopleLoading = ref(false)

        const avatars = [
            'https://07akioni.oss-cn-beijing.aliyuncs.com/07akioni.jpeg',
            'https://avatars.githubusercontent.com/u/20943608?s=60&v=4',
            'https://avatars.githubusercontent.com/u/46394163?s=60&v=4',
            'https://avatars.githubusercontent.com/u/39197136?s=60&v=4',
            'https://avatars.githubusercontent.com/u/19239641?s=60&v=4'
        ]

        const messages = ['星期一星期一星期一星期一星期一星期一星期一星期一星期一星期一星期一星期一星期一星期一星期一星期一星期一星期一星期一星期一星期一星期一星期一星期一星期一星期一星期一星期一星期一星期一星期一星期一星期一星期一星期一星期一星期一星期一星期一星期一星期一星期一星期一星期一星期一', '星期二', '星期三', '星期四', '星期五']

        const mock = (i: number) => ({
            key: `${i}`,
            value: i,
            avatar: avatars[i % avatars.length],
            message: messages[Math.floor(Math.random() * messages.length)]
        })

        const items = ref(Array.from({length: 100}, (_, i) => mock(i)))
        const noMore = computed(() => items.value.length > 16)

        const handleLoad = async () => {
            if (loading.value || noMore.value)
                return
            loading.value = true
            await new Promise(resolve => setTimeout(resolve, 1000))
            items.value.push(
                ...[mock(items.value.length), mock(items.value.length + 1)]
            )
            loading.value = false
        }

        return {
            onlinePeopleLoading,
            items,
            noMore,
            loading,
            handleLoad,
            PaperPlaneOutline,
            ReloadOutline,
            flushedOnlinePeople() {

                onlinePeopleLoading.value = true
                setTimeout(() => {
                    onlinePeopleLoading.value = false
                }, 5000) // 5秒后执行
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
                <n-divider class="sticky-divider">
                    在线用户
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
                        <li v-for="(user, index) in items" :key="user.id">
                            <img class="avatar" :src="user.avatar" alt="">
                            <span>{{ '赫赫' }}</span>
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
            </div>

            <!-- 聊天内容区域 -->
            <div class="chat-box">
                <div
                        v-for="(item, index) in items"
                        :key="item.key"
                        class="message"
                        :class="{ reverse: index % 5 === 0 }"
                >
                    <img class="avatar" :src="item.avatar" alt="">

                    <div class="message-content">
                        <!-- 显示名字 -->
                        <div class="name">赫赫</div>

                        <!-- 包裹消息的白色卡片 -->
                        <div class="message-bubble">
                            <span>{{ item.message }} {{ index % 5 === 0 ? '?' : '' }}</span>
                        </div>
                    </div>
                </div>

                <div v-if="loading" class="text">
                    加载中...
                </div>
                <div v-if="noMore" class="text">
                    没有更多了 🤪
                </div>
            </div>

            <!-- 固定在底部的 footer -->
            <div class="footer">
                <!-- 你可以在这里放一些内容，比如输入框，按钮等 -->
                <NInput type="textarea" placeholder="输入消息..." :autosize="{minRows: 3}"></NInput>
                <div class="button-container">
                    <n-button>
                        <template #icon>
                            <n-icon :component="PaperPlaneOutline"></n-icon>
                        </template>
                        {{ '发送' }}
                    </n-button>
                    <n-button>
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
    position: sticky;
    top: 0;
    z-index: 1;
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
    background-color: #f0f0f0;
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
