<template>
    <div class="smallnavbtn-wrapper" v-if="mobileView">
            <div v-bind:class="smallnavbtn" @click="snavBtnActive()"><span></span><span></span><span></span>
                <p></p>
            </div>
        </div>
        <div class="smallnav" v-if="smallnavDisplay">
            <ul id="snavMain">
                <li @click="simulationOpen()">次へ</li>
                <li @click="userHelp()">使い方</li>
                <li @click="(deleteConfirm = true),displayUpdate()">設定を初期化</li>
                <li @click="setLocalStorage()">設定を保存</li>
                <li @click="openFile('all')">設定をすべて入力</li>
                <li @click="openFile('passive')">パッシブのみ入力</li>
                <li @click="outputSetting()">設定を出力</li>
            </ul>
        </div>
        <div class="smallnav" v-if="deleteConfirm">
            <ul style="height: 30%; padding-left: 0; background-color: rgba(255, 255, 255, 0.9); border-radius: 20px; min-width: 300px;">
                <p style="margin: auto; text-align: center;">本当に削除（初期化）しますか？</p>
                <div style="display: flex; justify-content: space-between; min-width: 30vw; margin: auto; margin-left: 10vw; margin-right: 10vw;">
                    <div class="bigBtn deleteConfBtn" style="width: 90px;" @click="deleteData(),(deleteConfirm = false)">はい</div>
                    <div class="bigBtn deleteConfBtn" style="width: 90px;" @click="(deleteConfirm = false),displayUpdate()">いいえ</div>
                </div>
            </ul>
        </div>
        <div v-if="!mobileView" style="display: flex; justify-content: space-between; padding-left: 40px;">
            <div id="deleteBtn" class="bigBtn" @click="(deleteConfirm = true),displayUpdate()">入力を初期化</div>
            <div id="saveBtn" class="bigBtn" @click="setLocalStorage()">設定を保存</div>
        </div>
</template>

<script setup lang="ts">

</script>

<style scoped>

/* smallnav-btn setting
----------------------------------------------------------------------------*/
.smallnavbtn-wrapper {
    position: fixed;
    top: 5px;
    right: 2vw;
    z-index: 90;
}

.smallnav-btn {
    position: relative;
    cursor: pointer;
    width: 50px;
    height: 50px;
    border-radius: 15px;
    background-color: rgb(114, 113, 113);
    z-index: 99;
    -webkit-tap-highlight-color:rgba(0,0,0,0);
}

.smallnav-btn span {
    display: inline-block;
    transition: all .4s;
    /*アニメーションの設定*/
    position: absolute;
    left: 14px;
    height: 2px;
    border-radius: 5px;
    background: #ffffff;
    width: 45%;
}

.smallnav-btn span:nth-of-type(1) {
    top: 13px;
}

.smallnav-btn span:nth-of-type(2) {
    top: 19px;
}

.smallnav-btn span:nth-of-type(3) {
    top: 25px;
}

.smallnav-btn p::after {
    content: "Menu";
    position: absolute;
    top: 30px;
    left: 10px;
    color: #ffffff;
    font-size: 0.6rem;
    text-transform: uppercase;
}

.smallnav-btn.active span:nth-of-type(1) {
    top: 14px;
    left: 18px;
    transform: translateY(6px) rotate(-45deg);
    width: 30%;
}

.smallnav-btn.active span:nth-of-type(2) {
    opacity: 0;
}

.smallnav-btn.active span:nth-of-type(3) {
    top: 26px;
    left: 18px;
    transform: translateY(-6px) rotate(45deg);
    width: 30%;
}

.smallnav-btn.active p::after {
    content: "Close";
    top: 30px;
    left: 8px;
}

/* smallnav
------------------------------------------------------------------------------------*/
.smallnav {
    width: 100%;
    height: 100%;
    position: fixed;
    z-index: 50;
    top: 0;
    left: 0;
    -webkit-backdrop-filter: blur(10px);
    backdrop-filter: blur(10px);
    background: rgba(255, 255, 255, 0.3);
    transition: all 0.3s;
}

.smallnav ul {
    display: flex;
    flex-flow: column;
    justify-content: space-between;
    position: absolute;
    width: 50%;
    height: 70%;
    z-index: 59;
    top: 0;
    bottom: 0;
    right: 0;
    left: 0;
    margin: auto;
    list-style: none;
}

.smallnav ul>li {
    text-align: center;
    font-size: large;
    font-weight: bolder;
    color: #000000;
}


/* モバイル　1000px
--------------------------------------------------------------------------------- */
@media screen and (max-width: 1030px) {
}
</style>
