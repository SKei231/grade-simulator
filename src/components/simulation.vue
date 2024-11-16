<template>
  <div id="simArea" v-if="displayBool">
    <div style="position: relative;">
        <div class="finalCheck" v-if="!correctData && !simulationRunning">
            <h2 style="padding-bottom: 10px;">入力データに不備があります</h2>
            <div style="overflow: scroll; height: 30vh;">
                <p v-for="eMessage in errerMessage" style="text-align: center;">{{ eMessage }}</p>
            </div>
            <div class="bigBtn" id="backBtn" @click="close()">戻る</div>
        </div>
        <div class="finalCheck" v-if="correctData">
            <div v-if="!appealPriority">
                <h2>シミュレート準備完了</h2>
                <div class="bigBtn" @click="apActive()">アピール設定</div>
                <div style="text-align: center; padding-top: 20px;">
                  <label style="user-select: none;">試行回数：
                    <select v-model="detailSetting.count" style="width: 50px;">
                        <option value="1">1</option>
                        <option value="5">5</option>
                        <option value="10">10</option>
                    </select>
                    000 回</label>
                </div>
                <div style="text-align: center; padding-top: 20px;">
                    <label style="user-select: none;"><input type="checkbox" v-model="noSet">設定を保存しない</label>
                </div>
                <div class="bigBtn" @click="play()">実行</div>
                <div class="bigBtn" id="backBtn" @click="close()">戻る</div>
            </div>
            <div style="text-align: center;" v-if="appealPriority">
                <p v-if="detailSetting.liveSkillRandom">優先度　高</p>
                <p v-if="!detailSetting.liveSkillRandom">ターン固定</p>
                <draggable v-model="liveSkills" item-key="no" handle=".dragHandle" @end="setPriority()" animation="100" style=" padding-bottom: 10px;" class="draggArea">
                    <template #item="{ element, index }">
                        <div style="display: flex; border-radius: 5px; margin: 2px; padding: 2px; justify-content: center;" v-bind:class="element.posision">
                            <span v-if="!detailSetting.liveSkillRandom && !mobileView" style="width: 110px;">
                                {{ index + 1 }}ターン
                            </span>
                            <span v-if="!detailSetting.liveSkillRandom && mobileView" style="width: 15px;">
                                {{ index + 1 }}
                            </span>
                            <div style="display: flex; justify-content: space-between; width: 100%;">
                                <span v-if="!mobileView" style="margin-left: 10px;">
                                    {{ element.idolName }}
                                </span>
                                <span style="margin-left: 5px;">
                                    {{ element.label }}
                                </span>
                                <div class="dragHandle">
                                    <span></span>
                                </div>
                            </div>
                            <span :key="renderKey"></span>
                        </div>
                    </template>
                </draggable>
                <p v-if="detailSetting.liveSkillRandom">優先度　低</p>
                <label style="user-select: none;"><input type="checkbox" v-model="detailSetting.liveSkillRandom" @change="displayUpdate();">ランダムに選ぶ(優先度)</label>
                <div class="bigBtn" id="backBtn" @click="apActive()">戻る</div>
            </div>
        </div>
        <div class="finalCheck" v-if="simulationRunning">
          <br><br>
          <h2 style="padding-top: 2%;">シミュレート中…</h2>
          <!-- <div style="text-align: center;">
            <progress min="0" :value="progressPer" style="will-change: auto;"></progress>
            <div class="loader" style="will-change: auto;">Loading...</div>
          </div> -->
        </div>
    </div>
  </div>
  <span :key="renderKey"><!-- displayUpdate --></span>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import draggable from 'vuedraggable'
import * as types from '../logic/data/type'
import * as vault from '../logic/event/vault'
import { findByIdolID, idolList } from '../logic/data/idolList';
import * as simulate from '../logic/event/simulate'
import router from '../router/router';
import { dataVerification } from '../logic/event/dataCheck';
import { findByLiveEffectID, liveSkillEffect } from '../logic/data/skillEffect';

// データのセット
let passiveSkills: types.passive[] = [];
let fesIdols: types.fesIdol[] = [];
let detailSetting: types.detail;
let liveSkills: {
    posision: 'Leader'| 'Vocal'| 'Dance'| 'Visual'| 'Center',
    idolName: string,
    appealIndex: number[],
    label: string,
}[] = [];
const setData = (data: {
  passive: types.passive[],
  fesIdol: types.fesIdol[],
  detail: types.detail
}) => {
  correctData = false;
  errerMessage.length = 0;
  errerMessage = dataVerification(data.passive, data.fesIdol, data.detail);
  if(errerMessage.length == 0) {
    passiveSkills = data.passive;
    fesIdols = data.fesIdol;
    detailSetting = data.detail;
    setLiveSkills();
    correctData = true;
  }
  displayUpdate();
}

// 再レンダリング
const renderKey = ref(0);
const displayUpdate = () => {
    renderKey.value++;
}

// アピール札リストの作成
const setLiveSkills = () => {
    let liveskill:{
        posision: 'Leader' | 'Vocal' | 'Dance' | 'Visual' | 'Center',
        idolName: string,
        appealIndex: number[],
        label: string,
    } = {
        posision: 'Leader',
        idolName: "",
        appealIndex: [],
        label: "",
    }

    // liveSkills初期化
    liveSkills.length = 0;
    for(let i = 0; i < 10; i++) {
        liveSkills.push(Object.assign({},liveskill));
    }
    for(let i = 0; i < 5; i++) {
        switch(i) {
            case 0:
                liveskill.posision = 'Leader';
                break;
            case 1:
                liveskill.posision = 'Vocal';
                break;
            case 2:
                liveskill.posision = 'Dance';
                break;
            case 3:
                liveskill.posision = 'Visual';
                break;
            case 4:
                liveskill.posision = 'Center';
                break;
        }
        liveskill.idolName = idolList[findByIdolID(fesIdols[i].Idol)].Name;
        for(let j = 0; j < 2; j++) {
            let label = "";
            if(fesIdols[i].LiveSkill[j].Appeal[0].aID != 1) {
                label += fesIdols[i].LiveSkill[j].Appeal[0].aAttribute;
                label += fesIdols[i].LiveSkill[j].Appeal[0].aValue;
                label += "倍"
            } else {
                if(fesIdols[i].LiveSkill[j].Effect[0].eID != 1) {
                    label = liveSkillEffect[findByLiveEffectID(fesIdols[i].LiveSkill[j].Effect[0].eID)].parsedLabel[0];
                    if(liveSkillEffect[findByLiveEffectID(fesIdols[i].LiveSkill[j].Effect[0].eID)].existAttribute && !liveSkillEffect[findByLiveEffectID(fesIdols[i].LiveSkill[j].Effect[0].eID)].existM) {
                        label += fesIdols[i].LiveSkill[j].Effect[0].eNote;
                    }
                    if(liveSkillEffect[findByLiveEffectID(fesIdols[i].LiveSkill[j].Effect[0].eID)].existN) {
                        label += fesIdols[i].LiveSkill[j].Effect[0].eValue;
                        label +=  liveSkillEffect[findByLiveEffectID(fesIdols[i].LiveSkill[j].Effect[0].eID)].parsedLabel[1];
                    }
                    if(liveSkillEffect[findByLiveEffectID(fesIdols[i].LiveSkill[j].Effect[0].eID)].existAttribute && liveSkillEffect[findByLiveEffectID(fesIdols[i].LiveSkill[j].Effect[0].eID)].existM) {
                        label += fesIdols[i].LiveSkill[j].Effect[0].eNote;
                    }
                } else {
                    label = "アピール無し"
                }
            }
            liveskill.label = label;
            liveskill.appealIndex = [i,j];
            liveSkills[fesIdols[i].LiveSkill[j].Priority - 1] = Object.assign({},liveskill);
        }
    }
}

// アピール優先度
let appealPriority:boolean = false;
const apActive = () => {
    appealPriority = !appealPriority;
    displayUpdate();
}

const setPriority = () => {
    for(let i = 1; i <= liveSkills.length; i++) {
        fesIdols[liveSkills[i-1].appealIndex[0]].LiveSkill[liveSkills[i-1].appealIndex[1]].Priority = i;
    }
    displayUpdate();
}

// データチェック
let correctData = false
let errerMessage:string[] = []

// ボタン
const noSet = ref(false)
const play = () => {
  if (noSet.value != true) {
    setLocalStorage();
  }
  correctData = false;
  simulationRunning.value = true;
  vault.setData(passiveSkills, fesIdols, detailSetting);
  setTimeout(() => { simulateStart(); }, 100)
}
const simulationRunning = ref(false)
// localStorage へ保存
const setLocalStorage = () => {
  const setData = makeJson();
  localStorage.setItem('GradeFes', setData)
}
// JSONへ変換
const makeJson = () => {
  const data = {
    passive: passiveSkills,
    fesIdol: fesIdols,
    detail: detailSetting
  }
  return JSON.stringify(data);
}

// 画面表示
const displayBool = ref(false);
const ready = () => {
  displayBool.value = true;
}
const close = () => {
  displayBool.value = false;
}
defineExpose({
  ready, setData
})

// プログレスバー
const progressPer = ref(0);

// シミュレーション
const simulateStart = () => {
  vault.createLog()
  let count = 0
  const simulateBox = () => {
    for(let j = 0; j < 100 * detailSetting.count; j++) {
      simulate.run();
    }
  }
  while(count < 10) {
    simulateBox();
    progressPer.value += 10
    displayUpdate();
    count++;
  }
  setTimeout(() => { router.push('/Result'); }, 100)
}

// モバイル切り替え
const mobileView = ref(false);
const watchWindowSize = () => {
    if (window.innerWidth <= 1030) {
        mobileView.value = true;
    } else {
        mobileView.value = false;
    }
}
watchWindowSize()
window.addEventListener('resize', watchWindowSize)
</script>

<style scoped>
#simArea {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    backdrop-filter: blur(10px);
    overflow: scroll;
    z-index: 100;
}

.finalCheck {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, 50%);
    width: 60%;
    margin: auto;
    padding: 30px 0;
    background-color: rgb(255, 255, 255);
    border: 1px solid rgba(0, 0, 0, .5);
    border-radius: 20px;

    h2{
        margin-top: 0;
        text-align: center;
    }
}

.bigBtn {
    width: 130px;
    padding: 10px;
    text-align: center;
    font-size: 17px;
    font-weight: bold;
    border-radius: 10px;
    margin: auto;
    margin-top: 10px;
    color: aliceblue;
    background-color: rgba(0, 0, 0, 0.603);
}
.bigBtn:hover {
    cursor: pointer;
    background-color: rgba(0, 0, 0, 0.7);
}

#backBtn {
    margin-top: 30px;
    font-weight: lighter;
    width: 100px;
    border: 1px solid rgba(0, 0, 0, 0.603);
    color: rgba(0, 0, 0, 0.8);
    background-color: rgb(255, 255, 255);
}
#backBtn:hover {
    background-color: rgba(0, 0, 0, 0.1);
}

.draggArea {
    margin: 0 20%;
    
    >.Leader {
        border: 3px solid rgba(204, 68, 255, .3);
    }
    >.Vocal {
        border: 3px solid rgba(255, 68, 68, .3);
    }
    >.Dance {
        border: 3px solid rgba(51, 187, 255, .3);
    }
    >.Visual {
        border: 3px solid rgba(255, 187, 51, .3);
    }
    >.Center {
        border: 3px solid rgba(121, 248, 206, 0.3);
    }
}

/* progress {
    margin: auto;
    width: 50vw;
} */
.loader {
    margin: 100px auto;
    font-size: 25px;
    width: 1em;
    height: 1em;
    border-radius: 50%;
    position: relative;
    text-indent: -9999em;
    -webkit-animation: load5 1.1s infinite ease;
    animation: load5 1.1s infinite ease;
    -webkit-transform: translateZ(0);
    -ms-transform: translateZ(0);
    transform: translateZ(0);
}

.dragHandle {
    width: 50px;
    height: 20px;
    position: relative;

    >span {
        display: block;
        position: absolute;
        top: 50%;
        left: 50%;
        margin: -4px 0 0 -10px;
        width: 20px;
        height: 4px;
        border-top: 2px rgba(0, 0, 0, .4) solid;
        border-bottom: 2px rgba(0, 0, 0, .4) solid;
    }
}

@-webkit-keyframes load5 {

    0%,
    100% {
        box-shadow: 0em -2.6em 0em 0em #5e5e5e, 1.8em -1.8em 0 0em rgba(94, 94, 94, 0.2), 2.5em 0em 0 0em rgba(94, 94, 94, 0.2), 1.75em 1.75em 0 0em rgba(94, 94, 94, 0.2), 0em 2.5em 0 0em rgba(94, 94, 94, 0.2), -1.8em 1.8em 0 0em rgba(94, 94, 94, 0.2), -2.6em 0em 0 0em rgba(94, 94, 94, 0.5), -1.8em -1.8em 0 0em rgba(94, 94, 94, 0.7);
    }

    12.5% {
        box-shadow: 0em -2.6em 0em 0em rgba(94, 94, 94, 0.7), 1.8em -1.8em 0 0em #5e5e5e, 2.5em 0em 0 0em rgba(94, 94, 94, 0.2), 1.75em 1.75em 0 0em rgba(94, 94, 94, 0.2), 0em 2.5em 0 0em rgba(94, 94, 94, 0.2), -1.8em 1.8em 0 0em rgba(94, 94, 94, 0.2), -2.6em 0em 0 0em rgba(94, 94, 94, 0.2), -1.8em -1.8em 0 0em rgba(94, 94, 94, 0.5);
    }

    25% {
        box-shadow: 0em -2.6em 0em 0em rgba(94, 94, 94, 0.5), 1.8em -1.8em 0 0em rgba(94, 94, 94, 0.7), 2.5em 0em 0 0em #5e5e5e, 1.75em 1.75em 0 0em rgba(94, 94, 94, 0.2), 0em 2.5em 0 0em rgba(94, 94, 94, 0.2), -1.8em 1.8em 0 0em rgba(94, 94, 94, 0.2), -2.6em 0em 0 0em rgba(94, 94, 94, 0.2), -1.8em -1.8em 0 0em rgba(94, 94, 94, 0.2);
    }

    37.5% {
        box-shadow: 0em -2.6em 0em 0em rgba(94, 94, 94, 0.2), 1.8em -1.8em 0 0em rgba(94, 94, 94, 0.5), 2.5em 0em 0 0em rgba(94, 94, 94, 0.7), 1.75em 1.75em 0 0em #5e5e5e, 0em 2.5em 0 0em rgba(94, 94, 94, 0.2), -1.8em 1.8em 0 0em rgba(94, 94, 94, 0.2), -2.6em 0em 0 0em rgba(94, 94, 94, 0.2), -1.8em -1.8em 0 0em rgba(94, 94, 94, 0.2);
    }

    50% {
        box-shadow: 0em -2.6em 0em 0em rgba(94, 94, 94, 0.2), 1.8em -1.8em 0 0em rgba(94, 94, 94, 0.2), 2.5em 0em 0 0em rgba(94, 94, 94, 0.5), 1.75em 1.75em 0 0em rgba(94, 94, 94, 0.7), 0em 2.5em 0 0em #5e5e5e, -1.8em 1.8em 0 0em rgba(94, 94, 94, 0.2), -2.6em 0em 0 0em rgba(94, 94, 94, 0.2), -1.8em -1.8em 0 0em rgba(94, 94, 94, 0.2);
    }

    62.5% {
        box-shadow: 0em -2.6em 0em 0em rgba(94, 94, 94, 0.2), 1.8em -1.8em 0 0em rgba(94, 94, 94, 0.2), 2.5em 0em 0 0em rgba(94, 94, 94, 0.2), 1.75em 1.75em 0 0em rgba(94, 94, 94, 0.5), 0em 2.5em 0 0em rgba(94, 94, 94, 0.7), -1.8em 1.8em 0 0em #5e5e5e, -2.6em 0em 0 0em rgba(94, 94, 94, 0.2), -1.8em -1.8em 0 0em rgba(94, 94, 94, 0.2);
    }

    75% {
        box-shadow: 0em -2.6em 0em 0em rgba(94, 94, 94, 0.2), 1.8em -1.8em 0 0em rgba(94, 94, 94, 0.2), 2.5em 0em 0 0em rgba(94, 94, 94, 0.2), 1.75em 1.75em 0 0em rgba(94, 94, 94, 0.2), 0em 2.5em 0 0em rgba(94, 94, 94, 0.5), -1.8em 1.8em 0 0em rgba(94, 94, 94, 0.7), -2.6em 0em 0 0em #5e5e5e, -1.8em -1.8em 0 0em rgba(94, 94, 94, 0.2);
    }

    87.5% {
        box-shadow: 0em -2.6em 0em 0em rgba(94, 94, 94, 0.2), 1.8em -1.8em 0 0em rgba(94, 94, 94, 0.2), 2.5em 0em 0 0em rgba(94, 94, 94, 0.2), 1.75em 1.75em 0 0em rgba(94, 94, 94, 0.2), 0em 2.5em 0 0em rgba(94, 94, 94, 0.2), -1.8em 1.8em 0 0em rgba(94, 94, 94, 0.5), -2.6em 0em 0 0em rgba(94, 94, 94, 0.7), -1.8em -1.8em 0 0em #5e5e5e;
    }
}

@keyframes load5 {

    0%,
    100% {
        box-shadow: 0em -2.6em 0em 0em #5e5e5e, 1.8em -1.8em 0 0em rgba(94, 94, 94, 0.2), 2.5em 0em 0 0em rgba(94, 94, 94, 0.2), 1.75em 1.75em 0 0em rgba(94, 94, 94, 0.2), 0em 2.5em 0 0em rgba(94, 94, 94, 0.2), -1.8em 1.8em 0 0em rgba(94, 94, 94, 0.2), -2.6em 0em 0 0em rgba(94, 94, 94, 0.5), -1.8em -1.8em 0 0em rgba(94, 94, 94, 0.7);
    }

    12.5% {
        box-shadow: 0em -2.6em 0em 0em rgba(94, 94, 94, 0.7), 1.8em -1.8em 0 0em #5e5e5e, 2.5em 0em 0 0em rgba(94, 94, 94, 0.2), 1.75em 1.75em 0 0em rgba(94, 94, 94, 0.2), 0em 2.5em 0 0em rgba(94, 94, 94, 0.2), -1.8em 1.8em 0 0em rgba(94, 94, 94, 0.2), -2.6em 0em 0 0em rgba(94, 94, 94, 0.2), -1.8em -1.8em 0 0em rgba(94, 94, 94, 0.5);
    }

    25% {
        box-shadow: 0em -2.6em 0em 0em rgba(94, 94, 94, 0.5), 1.8em -1.8em 0 0em rgba(94, 94, 94, 0.7), 2.5em 0em 0 0em #5e5e5e, 1.75em 1.75em 0 0em rgba(94, 94, 94, 0.2), 0em 2.5em 0 0em rgba(94, 94, 94, 0.2), -1.8em 1.8em 0 0em rgba(94, 94, 94, 0.2), -2.6em 0em 0 0em rgba(94, 94, 94, 0.2), -1.8em -1.8em 0 0em rgba(94, 94, 94, 0.2);
    }

    37.5% {
        box-shadow: 0em -2.6em 0em 0em rgba(94, 94, 94, 0.2), 1.8em -1.8em 0 0em rgba(94, 94, 94, 0.5), 2.5em 0em 0 0em rgba(94, 94, 94, 0.7), 1.75em 1.75em 0 0em #5e5e5e, 0em 2.5em 0 0em rgba(94, 94, 94, 0.2), -1.8em 1.8em 0 0em rgba(94, 94, 94, 0.2), -2.6em 0em 0 0em rgba(94, 94, 94, 0.2), -1.8em -1.8em 0 0em rgba(94, 94, 94, 0.2);
    }

    50% {
        box-shadow: 0em -2.6em 0em 0em rgba(94, 94, 94, 0.2), 1.8em -1.8em 0 0em rgba(94, 94, 94, 0.2), 2.5em 0em 0 0em rgba(94, 94, 94, 0.5), 1.75em 1.75em 0 0em rgba(94, 94, 94, 0.7), 0em 2.5em 0 0em #5e5e5e, -1.8em 1.8em 0 0em rgba(94, 94, 94, 0.2), -2.6em 0em 0 0em rgba(94, 94, 94, 0.2), -1.8em -1.8em 0 0em rgba(94, 94, 94, 0.2);
    }

    62.5% {
        box-shadow: 0em -2.6em 0em 0em rgba(94, 94, 94, 0.2), 1.8em -1.8em 0 0em rgba(94, 94, 94, 0.2), 2.5em 0em 0 0em rgba(94, 94, 94, 0.2), 1.75em 1.75em 0 0em rgba(94, 94, 94, 0.5), 0em 2.5em 0 0em rgba(94, 94, 94, 0.7), -1.8em 1.8em 0 0em #5e5e5e, -2.6em 0em 0 0em rgba(94, 94, 94, 0.2), -1.8em -1.8em 0 0em rgba(94, 94, 94, 0.2);
    }

    75% {
        box-shadow: 0em -2.6em 0em 0em rgba(94, 94, 94, 0.2), 1.8em -1.8em 0 0em rgba(94, 94, 94, 0.2), 2.5em 0em 0 0em rgba(94, 94, 94, 0.2), 1.75em 1.75em 0 0em rgba(94, 94, 94, 0.2), 0em 2.5em 0 0em rgba(94, 94, 94, 0.5), -1.8em 1.8em 0 0em rgba(94, 94, 94, 0.7), -2.6em 0em 0 0em #5e5e5e, -1.8em -1.8em 0 0em rgba(94, 94, 94, 0.2);
    }

    87.5% {
        box-shadow: 0em -2.6em 0em 0em rgba(94, 94, 94, 0.2), 1.8em -1.8em 0 0em rgba(94, 94, 94, 0.2), 2.5em 0em 0 0em rgba(94, 94, 94, 0.2), 1.75em 1.75em 0 0em rgba(94, 94, 94, 0.2), 0em 2.5em 0 0em rgba(94, 94, 94, 0.2), -1.8em 1.8em 0 0em rgba(94, 94, 94, 0.5), -2.6em 0em 0 0em rgba(94, 94, 94, 0.7), -1.8em -1.8em 0 0em #5e5e5e;
    }
}


/* モバイル　1000px
--------------------------------------------------------------------------------- */
@media screen and (max-width: 999px) {
    #helpInfo {
        margin: 30% 0 10% 10%;
        
        h1 {
        font-size: 1.5rem;
        }
    }
    
    #errerCheck {
        width: 90%;
    }
    
    .bigBtn {
        width: 160px;
        font-size: 15px;
        margin-top: 20px;
    }
    
    .finalCheck {
        width: 70%;
        padding: 30px 0;
        
        h2 {
        font-size: 18px;
        padding-bottom: 20px;
        }
    }
  
    .draggArea {
        width: 80%;
        margin: 0 10%;
    }
}
</style>