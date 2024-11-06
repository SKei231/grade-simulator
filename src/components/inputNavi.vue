<template>
    <span style="position: fixed; bottom: 0; right: 0; height: 100vh; z-index: 90;">
        <div class="navi-btn" @click="navBtnActive(true)" id="noCircle">
            <div :class="naviState.ham">
                <div class="navi-patty"></div>
                <div class="navi-patty"></div>
                <div class="navi-patty"></div>
            </div>
        </div>
    </span>
    <div :class="naviState.wrapper">
        <div class="navi-menu">
            <div :class="naviState.circle" @click="navBtnActive(true)">
                <div :class="naviState.ham">
                    <div class="navi-patty"></div>
                    <div class="navi-patty"></div>
                    <div class="navi-patty"></div>
                </div>
            </div>
            <div :class="naviState.content">
                <nav style="display: flex; justify-content: center; height: 100%;">
                    <ul :class="naviState.ul.main" style="margin-top: 20nh;">
                        <li :class="naviState.link" style="padding-top: 8vh;"><p @click="emits('simulationOpen'); navBtnActive(false)">次へ</p></li>
                        <li :class="naviState.link"><p @click="saveData()">入力を保存</p></li>
                        <li :class="naviState.link"><p @click="naviState.ul.main='leave'; naviState.ul.inputData='active'; displayUpdate()">外部から入力</p></li>
                        <li :class="naviState.link"><p @click="emits('outputSetting'); navBtnActive(false)">入力の外部出力</p></li>
                        <li :class="naviState.link"><p @click="naviState.ul.main='leave'; naviState.ul.deleteData='active'; displayUpdate()">入力をクリア</p></li>
                        <li :class="naviState.link"><p @click="naviState.ul.main='leave'; naviState.ul.help='active'; displayUpdate()">ヘルプ</p></li>
                    </ul>
                    <ul :class="naviState.ul.saveData[0]">
                        <!-- 入力の保存 -->
                        <li style="padding-top: 20vh;"></li>
                        <li :class="naviState.link" v-if="!naviState.ul.saveData[1]"><span style="font-size: 500; font-weight: 500;">入力の保存に<br>失敗しました</span></li>
                        <li :class="naviState.link" v-if="naviState.ul.saveData[1]"><span style="font-size: 500; font-weight: 500;">入力を保存しました</span></li>
                        <br>
                        <li :class="naviState.link"><p @click="naviState.ul.main='active'; naviState.ul.saveData[0]='hide'; displayUpdate()">戻る</p></li>
                    </ul>
                    <ul :class="naviState.ul.inputData">
                        <!-- 外部から入力 -->
                        <li style="padding-top: 18vh;"></li>
                        <li :class="naviState.link"><p @click="emits('openFile', 'passive'); navBtnActive(false)">パッシブのみ入力</p></li>
                        <li :class="naviState.link"><p @click="emits('openFile', 'all'); navBtnActive(false)">すべて入力</p></li>
                        <br>
                        <li :class="naviState.link"><p @click="naviState.ul.main='active'; naviState.ul.inputData='hide'; displayUpdate()">戻る</p></li>
                    </ul>
                    <ul :class="naviState.ul.deleteData">
                        <!-- 入力の削除 -->
                        <li style="padding-top: 10vh;"></li>
                        <li :class="naviState.link"><span style="font-size: 500; font-weight: 500;">本当にクリア<br>（初期化）しますか？</span></li>
                        <br>
                        <li :class="naviState.link"><p @click="emits('deleteData'); navBtnActive(false)">クリアする</p></li>
                        <br>
                        <li :class="naviState.link"><p @click="naviState.ul.main='active'; naviState.ul.deleteData='hide'; displayUpdate()">戻る</p></li>
                    </ul>
                    <ul :class="naviState.ul.help">
                        <!-- ヘルプ -->
                        <li style="padding-top: 8vh;"></li>
                        <li :class="naviState.link"><span style="font-size: 200; font-weight: 100;">不具合の報告やご意見ご要望など<br>いつでもお待ちしております。</span></li>
                        <br>
                        <li :class="naviState.link"><p @click="openDM(); navBtnActive(false)">運営者DMへ</p></li>
                        <br>
                        <li :class="naviState.link"><p @click="naviState.ul.main='active'; naviState.ul.help='hide'; displayUpdate()">戻る</p></li>
                    </ul>
                </nav>
            </div>
        </div>
    </div>
    <span :key="renderKey"></span>
</template>

<script setup lang="ts">
import { ref } from 'vue';

/**
 * @param naviActive        ナビを  開く:true |閉じる:false
 * @param simulationOpen    シミュレーション確認画面
 * @param setLocalStorage   ローカルストレージへ保存
 * @param openfile          入力の外部入力 すべて:true |パッシブのみ:false 
 * @param outputSetting     入力の外部出力
 * @param deleteData        入力をクリア
 */
const emits = defineEmits(['naviActive', 'simulationOpen', 'setLocalStorage', 'openFile', 'outputSetting', 'deleteData'])

// ハンバーガーメニュー
const naviState = {
    wrapper: ref('navi-menu-wrapper').value,
    circle: ref('navi-btn').value,
    link: ref('navi-patty').value,
    ham: ref('navi-hamburger').value,
    content: ref('navi-content').value,
    ul: {
        main: ref('avtive').value,
        saveData: [ref('hide').value, ref(true).value],
        inputData: ref('hide').value,
        deleteData: ref('hide').value,
        help: ref('hide').value
    }
}
/**
 * ナビゲーションメニューの開閉
 * @param mode トグル:true |閉じる:false
 */
const navBtnActive = (mode:boolean) => {
    if (naviState.circle == "navi-btn" && mode) {
        naviState.wrapper = "navi-menu-wrapper active"
        naviState.circle = "navi-btn active"
        naviState.ham = "navi-hamburger navi-close"
        naviState.link = "navi-patty active"
        naviState.content = "navi-content active"
        displayUpdate()
        emits('naviActive', true);
    } else {
        naviState.wrapper = "navi-menu-wrapper"
        naviState.circle = "navi-btn"
        naviState.ham = "navi-hamburger"
        naviState.link = "navi-patty"
        naviState.content = "navi-content"
        naviState.ul.main = 'active'
        naviState.ul.saveData[0] = 'hide'
        naviState.ul.inputData = 'hide'
        naviState.ul.deleteData = 'hide'
        naviState.ul.help = 'hide'
        emits('naviActive',false)
        displayUpdate()
        
    }
}

// 入力データの保存
const saveData = () => {
    try {
        emits('setLocalStorage');
        naviState.ul.saveData[1] = true;
    } catch(e) {
        naviState.ul.saveData[1] = false;
    }
    naviState.ul.main='leave';
    naviState.ul.saveData[0]='active';
    displayUpdate()
}

const openDM = () => {
    const dm = "https://www.twitter.com/messages/compose?recipient_id=1341019207417221122"
    window.open(dm);
}

const renderKey = ref(0);
const displayUpdate = () => {
    renderKey.value++;
}

// モバイル切り替え
const mobileView = ref(false);
const watchWindowSize = () => {
    if (window.innerWidth <= 1030) {
        mobileView.value = true;
    } else {
        mobileView.value = false;
        navBtnActive(false) // ナビを閉じる
    }
}
watchWindowSize()
window.addEventListener('resize', watchWindowSize)
</script>

<style scoped>
.navi-menu-wrapper {
    position: fixed;
    bottom: 0;
    right: 0;
    height: 100vh;
    width: 20vw;
    z-index: 0;
    overflow: hidden;

    &.active {
        z-index: 80;
    }
}

.navi-menu {
    position: relative;
    width: 100%;
    height: 100%;
}

.navi-btn {
    will-change: transform;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-wrap: wrap;
    position: absolute;
    z-index: 90;
    bottom: 20px;
    right: 20px;
    width: 75px;
    height: 75px;
    background: transparent;
    cursor: pointer;
    transition: all 0.35s ease-out;

    &.active:before {
        transform: scale(18);
    }

    &:active:before {
        opacity: 0.75;
    }

    &:before {
        content: "";
        position: absolute;
        top: 0;
        left: 0;
        z-index: -1;
        width: 75px;
        height: 75px;
        background: rgba(0, 19, 34, 0.319);
        border-radius: 50%;
        box-shadow: 0 5px 10px rgba(0, 0, 0, 0.5);
        cursor: pointer;
        transform-origin: center 70%;
        transform: scale(1);
        transition: all 0.35s ease-out;
        /* blur */
        -webkit-backdrop-filter: blur(1px);
        backdrop-filter: blur(1px);
    }

    &.delete{
        opacity: 0;
    }
}

#noCircle {
    &:before {
        background: none;
        box-shadow: none;
        /* blur */
        -webkit-backdrop-filter: none;
        backdrop-filter: none;
    }

    .navi-patty {
        background: none;
    }
}

.navi-content {
    &.active {
        position: fixed;
        width: 20vw;
        height: 85vh;
        z-index: 91;
    }
}

nav {
    position: relative;
    ul {
        display: block;
        justify-content: center;
        list-style-type: none;
        padding: 0;
        text-align: center;
        overflow: hidden;
        transition: all .4s;
        
        /* ナビゲーションの遷移 */
        &.hide {
            width: 0;
            opacity: 0;
            transform: translateX(50px);
        }
        &.leave {
            width: 0;
            opacity: 0;
            transform: translateX(-50px);
        }
        &.active {
            opacity: 1;
        }
    }
    li {
        will-change: transform, opacity;
        margin: 5vh 0;
        transform: translateY(100px);
        opacity: 0;


        &.active {
            z-index: 99;
            padding: 0 50px;
            transform: translateY(0);
            opacity: 1;
            transition: 0.4s ease-out;

            >p {
                font-family: 'meiryo';
                font-weight: 400;
                /* hover animation */
                cursor: pointer;
                margin: 0;
                padding: 10px;
                position: relative;
                z-index: 99;
                &::before {
                    background: #0000005b;
                    content: '';
                    width: 100%;
                    height: 2px;
                    position: absolute;
                    left: 0;
                    bottom: 0;
                    margin: auto;
                    transform-origin: right top;
                    transform: scale(0, 1);
                    transition: transform .3s;
                }
    
                &:hover {
                    &::before {
                        transform-origin: left top;
                        transform: scale(1, 1);
                    }
                }
            }
        }
    }
}

.navi-hamburger {
    transition: all 0.3s ease-out;

    .navi-patty {
        will-change: transform, opacity;
        width: 32px;
        height: 3px;
        margin: 0 0 6px 0;
        background: #333333;
        opacity: 1;
        transform: translate(0) rotate(0deg);
        transition: all 0.2s ease-out;
        
        &:last-child {
            margin-bottom: 0;
        }
    }

    &.navi-close {
        transform: rotate(-180deg);

        .navi-patty {
            &:nth-child(1) {
                transform: translate(-10px, 4px) rotate(-45deg) scale(0.5, 1);
            }
            
            &:nth-child(3) {
                transform: translate(-10px, -4px) rotate(45deg) scale(0.5, 1);
            }
        }
    }
}




/* general purpose */
.blur {
    -webkit-backdrop-filter: blur(3px);
    backdrop-filter: blur(3px);
}


/* モバイル　1000px
--------------------------------------------------------------------------------- */
@media screen and (max-width: 1030px) {
    .navi-btn.active:before {
      transform: scale(25);
    }
    .navi-content {
        &.active {
            width: 80vw;
            height: 85vh;
        }

        &.active+#navi-wrapper {
            z-index: 90;
            width: 80vw;
        }
    }
    .navi-menu-wrapper {
        width: 80vw;
    }
    .navi-menu {
        z-index: 80;
    }
}
</style>
