<template>
  <div id="simArea" v-if="displayBool">
    <div class="finalCheck" id="errerCheck" v-if="!correctData && !simulationRunning">
      <h2 style="padding-bottom: 10px;">入力データに不備があります</h2>
      <p v-for="eMessage in errerMessage">{{ eMessage }}</p>
      <div class="bigBtn" id="backBtn" @click="close()">戻る</div>
    </div>
    <div class="finalCheck" v-if="correctData">
      <h2>シュミレート準備完了</h2>
      <div style="text-align: center; padding-top: 20px;"><label style="user-select: none;"><input type="checkbox"
            v-model="noSet">設定を保存しない</label></div>
      <div class="bigBtn" @click="play()">実行</div>
      <div class="bigBtn" id="backBtn" @click="close()">戻る</div>
    </div>
    <div class="finalCheck" v-if="simulationRunning">
      <h2 style="padding-top: 2%;">シミュレート中…</h2>
      <div style="text-align: center;">
        <div class="loader">Loading...</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import * as types from '../logic/data/type'
import * as vault from '../logic/event/vault'
import * as simulate from '../logic/event/simulate'
import router from '../router/router';
import { dataVerification } from '../logic/event/dataCheck';

const emit = defineEmits(["displayUpdate"])

// データのセット
let passiveSkills: types.passive[] = [];
let fesIdols: types.fesIdol[] = [];
let detailSetting: types.detail;
const setData = (data: {
  passive: types.passive[],
  fesIdol: types.fesIdol[],
  detail: any
}) => {
  correctData = false;
  errerMessage.length = 0;
  errerMessage = dataVerification(data.passive, data.fesIdol, data.detail);
  if(errerMessage.length == 0) {
    passiveSkills = data.passive;
    fesIdols = data.fesIdol;
    detailSetting = data.detail;
    correctData = true;
  }
  emit('displayUpdate');
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

// シミュレーション
const simulateStart = () => {
  vault.createLog()
  for(let i = 0; i < 1000 * detailSetting.count ; i++){
    simulate.run();
  }
  setTimeout(() => { router.push('/Result'); }, 100)
}
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
  z-index: 90;
}

.finalCheck {
  width: 60%;
  height: 35%;
  margin: auto;
  margin-top: 15%;
  padding: 30px 0;
  background-color: rgb(255, 255, 255);
  border: 1px solid rgba(0, 0, 0, .5);
  border-radius: 20px;
}

.finalCheck h2 {
  margin-top: 0;
  text-align: center;
}

#errerCheck {
  margin: 5% auto;
  height: auto;
}
#errerCheck>p {
  text-align: center;
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
  background-color: rgba(3, 36, 182, 0.658);
}

.bigBtn:hover {
  cursor: pointer;
  background-color: rgba(3, 36, 182, 0.9);
}

#backBtn {
  margin-top: 30px;
  width: 100px;
  background-color: rgba(3, 182, 167, 0.658);
}

#backBtn:hover {
  background-color: rgba(3, 182, 167, 0.9);
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
  #helpInfo h1 {
    font-size: 1.5rem;
  }

  #helpInfo {
    margin: 30% 0 10% 10%;
  }

  .finalCheck h2 {
    font-size: 18px;
    padding-bottom: 20px;
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
    height: 38%;
    margin-top: 40%;
    padding: 30px 0;
  }

  .bigBtn {
    border: 1px solid black;
    color: white;
    background-color: rgba(0, 0, 0, 0.603);
  }

  #backBtn {
    font-weight: 200;
    color: black;
    background-color: white;
  }
}
</style>