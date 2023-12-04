<template>
    <div id="userHelp" v-if="displayBool">
        <div id="helpInfo">
            <h1>このページについて</h1>
            <h3>グレードフェス用の非公式シミュレーターです</h3>
            <p>シミュレーターの使い方は<a href="https://note.com/tunakan_yt212/n/na0cd640b09b5">こちら</a><br><span style="font-size: .8rem;">※外部リンク</span></p>
            <div style="padding-top: 10vh;"></div>
            <p>シミュレーターに関するご意見・ご要望は<a href="https://www.twitter.com/messages/compose?recipient_id=1341019207417221122">こちら</a><br><span style="font-size: .8rem;">※管理者のX(Twitter)のDMへ移ります</span></p>
            <div style="padding-top: 10vh;"></div>
        </div>
    </div>
    <div id="UHCloseBtn" v-if="displayBool" @click="close()">とじる </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const version = '1.1.1'

console.log(version)

const displayBool = ref(false);
const open = () => {
    displayBool.value = true;
}
const close = () => {
    displayBool.value = false;
}
defineExpose({
    open,close
})
</script>

<style scoped>/* User help page style */
#userHelp {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    backdrop-filter: blur(10px);
    overflow: scroll;
    z-index: 90;
}
#helpInfo {
    width: 80%;
    margin: 15% 0 10% 10%;
    background-color: rgb(255, 255, 255);
    border: 1px solid rgba(0,0,0,.5);
    border-radius: 20px;
}
#helpInfo h1 {
    text-align: center;
    margin: 5%;
}
#helpInfo h3 {
    text-align: center;
    margin: 5%;
}
#helpInfo p {
    text-align: center;
    margin-top: 2%;
}
#UHCloseBtn {
    position: fixed;
    cursor: pointer;
    top: 5%;
    right: 5%;
    font-size: 20px;
    padding: 10px;
    border-radius: 15px;
    background-color: rgba(235, 235, 235, 0.8);
    z-index: 99;
}
#UHCloseBtn:hover {
    background-color: rgba(197, 197, 197, 0.8);
}
#UHCloseBtn::after {
    content: "×";
}

/* モバイル　1000px
--------------------------------------------------------------------------------- */
@media screen and (max-width: 1030px) {
    #helpInfo h1 {
        font-size: 1.5rem;
    }
    #helpInfo {
        margin: 30% 0 10% 10%;
}
}
</style>