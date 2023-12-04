<template>
    <div id="Header">
        <h1>Fes-Simulator</h1>
        <div id="usehelp" @click="toggleDisplayUserHelp()"><p>ヘルプ</p></div>
    </div>
    <Help ref="displayUserHelp"></Help>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import Help from './help.vue'

const displayUserHelp = ref();

const toggleDisplayUserHelp = () => {
    // location.href = "https://note.com/tunakan_yt212/n/na0cd640b09b5";
    displayUserHelp.value.open();
}

</script>

<style scoped>
#Header {
    display: flex;
}
#Header h1 {
    padding-left: 5%;
    font-size: 35px;
}
#usehelp {
    display: flex;
    margin-left: 5%;
    text-align: center;
    justify-content: center;
    cursor: pointer;
}
#usehelp:hover p {
    text-decoration: underline;
}
#usehelp p {
    display: flex;
    height: 20px;
    font-size: 16px;
    padding-top: 10px;
    padding-bottom: 10px;
    margin: 25px 0;
}

/* User help page style */
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
    width: 60%;
    margin: 10% 0 10% 20%;
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
@media screen and (max-width: 1030px) {
    #Header h1 {
        font-size: 1.5rem;
    }
    #usehelp {
        display: none;
    }
}
</style>
