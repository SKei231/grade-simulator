<template>
    <div id="userHelp" v-if="displayBool">
        <div id="helpInfo">
            <h1>使い方</h1>
            <p style="padding-top: 100vh; padding-bottom: 100vh;">aaa</p>
        </div>
    </div>
    <div id="UHCloseBtn" v-if="displayBool" @click="close()">とじる </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

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
    margin-top: 5%;
}
#UHCloseBtn {
    position: fixed;
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
@media screen and (max-width: 999px) {
    #helpInfo h1 {
        font-size: 1.5rem;
    }
    #helpInfo {
        margin: 30% 0 10% 10%;
}
}
</style>