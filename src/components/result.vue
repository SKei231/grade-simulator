<template>
  <div v-if="logErrer" id="errerArea">
    <h2 style="text-align: center;">エラーが発生しました。</h2>
    <p style="text-align: center; margin: 0 10vw;">データの読み込みに失敗しました。<br v-if="mobileView">入力画面へ戻り、再度シュミレートを行ってください。</p>
    <br>
    <p style="text-align: center; font-size: .8rem; margin: 0 10vw;">※ページのリロードを行うとシュミレート結果が破棄されます。</p>
    <p style="text-align: center; font-size: .8rem;">リロード以外で何度もこの画面が表示される場合、<br v-if="mobileView">
      <a href="https://twitter.com/messages/1000751929008447489-1341019207417221122" style="text-decoration: underline;">管理者のTwitter</a>へメッセージを送信してください。
    </p>
  </div>
  <div v-if="!displayChart && !logErrer">
    <h2 style="text-align: center;">解析中...</h2>
  </div>
  <div v-if="displayChart">
    <h1 style="text-align: center;">Result</h1>
    <div id="settingArea">
      <div>
        表示方法: 
        <select v-model="graphTurn" @change="changeTurn();">
          <option value="0">全てのターン</option>
          <option v-for="turn in vault.log" v-bind:value="turn.Turn">{{ turn.Turn }}ターン目</option>
        </select>
      </div>
      <div>
        表示カテゴリ: 
        <select v-model="selectedGraphMode" @change="createCharts();" style="margin-right: 10px;">
          <option v-for="GraphMode in graphMode" v-bind:value="GraphMode.ModeID">{{ GraphMode.Name }}</option>
        </select>
        <br v-if="mobileView">
        <span v-if="graphTurn == 0">
          表示データ: 
          <select v-model="selectedDataMode" @change="createCharts();">
            <option v-for="DataMode in dataMode" v-bind:value="DataMode.ModeID">{{ DataMode.Name }}</option>
          </select>
        </span>
      </div>
      <div v-if="selectedGraphMode == 1 || selectedGraphMode == 2">
        <label style="user-select: none;">
          <input type="checkbox" v-model="selectedVo" @change="createCharts();">Vo を表示
        </label>
        <label style="user-select: none;">
          <input type="checkbox" v-model="selectedDa" @change="createCharts();">Da を表示
        </label>
        <label style="user-select: none;">
          <input type="checkbox" v-model="selectedVi" @change="createCharts();">Vi を表示
        </label>
      </div>
    </div>
    <div id="graphArea">
      <canvas ref="resultGraph">ブラウザがサポートしていないため、グラフを表示できません</canvas>
    </div>
    <p id="labelDiscription">{{ labelDiscription }}</p>
    <div id="listArea" v-if="graphTurn != 0">
      <h3>{{ vault.log[graphTurn - 1].Turn }}ターン目の詳細</h3>
      <ul class="accArea">
        <li>
          <section>
            <h2 v-bind:class="statusDetailClass" @click="toggleAccBtn('statusDetail', displayStatusDetail)">ステータスの詳細</h2>
            <div class="accBox" v-if="displayStatusDetail">
              <ul>
                <li v-for="DetailList in detailList">
                  {{ DetailList.label }}
                  <ul style="display: flex; flex-wrap: wrap;">
                    <span style="padding-right: 10px;">最大値:{{ DetailList.max }}</span>
                    <span style="padding-right: 10px;">最小値:{{ DetailList.min }}</span>
                    <span style="padding-right: 10px;">平均値:{{ DetailList.average }}</span>
                    <span style="padding-right: 10px;">中央値:{{ DetailList.median }}</span>
                    <span style="padding-right: 10px;">上位25%:{{ DetailList.firstQuartile }}</span>
                    <span style="padding-right: 10px;">下位25%:{{ DetailList.thirdQuartile }}</span>
                  </ul>
                </li>
              </ul>
            </div>
          </section>
        </li>
        <li>
          <section>
            <h2 v-bind:class="passiveDetailClass" @click="toggleAccBtn('passiveDetail', displayPassiveDetail)">パッシブ発動率</h2>
            <div class="accBox" v-if="displayPassiveDetail">
              <ul>
                <li v-for="passives in passiveActiveList" style="padding-bottom: 2px;" v-bind:class="passives.color">
                  <p style="margin: 2px;"><span style="font-weight: bold;">{{ passives.rate }}%</span> "{{ passives.label }}" <br v-if="mobileView">{{ passives.attribute }} {{ passives.value }}%up <br v-if="mobileView">条件:{{ passives.trigger }}</p>
                </li>
              </ul>
            </div>
          </section>
        </li>
        <li>
          <section>
            <h2 v-bind:class="appealDetailClass" @click="toggleAccBtn('appealDetail', displayAppealDetail)">アピール値の計算</h2>
            <div class="accBox" v-if="displayAppealDetail">
              <ul>
                <section style="margin: 10px;">
                    <h2 v-bind:class="appealUPClass" @click="toggleAccBtn('appealUP', displayAppealUP)" style="margin: 2px 0;">アピールUP系</h2>
                    <div class="accBox" v-if="displayAppealUP">
                      <ul>
                        <div>興味:<input type="number" v-model="interest" style="width: 50px; padding: 1px 5px; margin-left: 10px;" @change="appealCalc()">倍</div>
                        <div>スロースターター:
                          <select v-model="slowStart" @change="appealCalc()">
                            <option value="0">なし</option>
                            <option value="1">1人</option>
                            <option value="2">2人</option>
                            <option value="3">3人</option>
                            <option value="4">4人</option>
                            <option value="5">5人</option>
                          </select>
                        </div>
                        <div>スタートダッシュ:
                          <select v-model="startDash" @change="appealCalc()">
                            <option value="0">なし</option>
                            <option value="1">1人</option>
                            <option value="2">2人</option>
                            <option value="3">3人</option>
                            <option value="4">4人</option>
                            <option value="5">5人</option>
                          </select>
                        </div>
                        <div>アピールUP(思い出高):
                          <select v-model="memoryHigh" @change="appealCalc()">
                            <option value="0">なし</option>
                            <option value="1">1人</option>
                            <option value="2">2人</option>
                            <option value="3">3人</option>
                            <option value="4">4人</option>
                            <option value="5">5人</option>
                          </select>
                        </div>
                        <div>アピールUP(思い出低):
                          <select v-model="memoryLow" @change="appealCalc()">
                            <option value="0">なし</option>
                            <option value="1">1人</option>
                            <option value="2">2人</option>
                            <option value="3">3人</option>
                            <option value="4">4人</option>
                            <option value="5">5人</option>
                          </select>
                        </div>
                        <div>その他アピールUP:<input type="number" v-model="appealUp" style="width: 30px; padding: 1px 5px; margin-left: 10px;" @change="appealCalc()">%</div>
                      </ul>
                    </div>
                </section>
                <li style="border: none; margin: 0; padding-bottom: 0;">
                  <div>アピールアイドル</div>
                  <div style="padding-left: 10px;">
                    <select v-model="appealIdol" @change="appealCalc()">
                      <option v-for="(appealIdols, idolIndex) in vault.fesIdols" v-bind:value="idolIndex">{{ idolList[findByIdolID(appealIdols.Idol)].Name }}: {{ appealIdols.Position }}</option>
                    </select><br>
                    <select v-model="liveSkillIndex" @change="appealCalc()">
                      <option v-for="(liveskills, lsIndex) in vault.fesIdols[appealIdol].LiveSkill" v-bind:value="lsIndex">{{ appealLabel(lsIndex, 'appeal', 0) }}, {{ appealLabel(lsIndex, 'effect', 0) }}</option>
                      <option v-if="appealIdol == 4" value="2">思い出アピール</option>
                    </select>
                  </div>
                </li>
                <div>
                  表示データ: 
                  <select v-model="appealDataMode" @change="getBuff(); appealCalc();">
                    <option v-for="DataMode in dataMode" v-bind:value="DataMode.ModeID">{{ DataMode.Name }}</option>
                  </select>
                </div>
                <li style="border: none; margin: 5px 0 0 0;">
                  <div style="padding-left: 10px;" v-if="(appeals.normalAppeal.length > 0)">
                    <div>アピール</div>
                    <div v-for="(appeal, apIndex) in appeals.normalAppeal">
                      <p style="padding: 0; margin: 1px 0 0 0;">{{ appeals.normalAppeal[apIndex] }}</p>
                    </div>
                  </div>
                  <div style="padding-left: 10px;" v-if="(appeals.extraAppeal.length > 0)">
                    <div>{{ vault.fesIdols[appealIdol].LiveSkill[liveSkillIndex].Link.lType }}アピール</div>
                    <div v-for="(extraAppeal, exIndex) in appeals.extraAppeal">
                      <p style="padding: 0; margin: 1px 0 0 0;">{{ appeals.extraAppeal[exIndex] }}</p>
                    </div>
                  </div>
                </li>
                <!-- <li style="border: none; margin: 5px 0 0 0;" v-if="liveSkillIndex == 2">
                  <div>思い出アピール</div>
                  <div style="padding-left: 10px;">
                    <p style="padding: 0; margin: 1px 0 0 0;" v-if="appealLabel(2, 'memoryAppeal', 0)">{{ appealLabel(2, 'memoryAppeal', 0) }}</p>
                  </div>
                  <div v-if="appealLabel(2, 'memoryLink', 0)">思い出Link</div>
                  <div style="padding-left: 10px;">
                    <p style="padding: 0; margin: 1px 0 0 0;" v-if="appealLabel(2, 'memoryLink', 0)">{{ appealLabel(2, 'memoryLink', 0) }}</p>
                  </div>
                  <p>※現在、変動するアピール倍率において、倍率が最大の場合で計算を行っています。</p>
                </li> -->
                <!-- <li style="border: none; margin: 5px 0 0 0;">
                  <div style="padding-top: 20px;">アピール値</div>
                  <div style="padding: 10px 0 0 10px;">
                    <div style="font-size: 1.2rem;">Vo:{{ Math.floor(VoAppeal * interest) }}</div>
                    <div style="font-size: 1.2rem;">Da:{{ Math.floor(DaAppeal * interest) }}</div>
                    <div style="font-size: 1.2rem;">Vi :{{ Math.floor(ViAppeal * interest) }}</div>
                  </div>
                </li> -->
              </ul> 
            </div>
          </section>
        </li>
      </ul>
    </div>
  </div>
  <div v-if="display"></div>
  <div class="bigBtn" @click="(router.go(-1))">入力画面に戻る</div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import * as vault from '../logic/event/vault';
import { Chart, registerables } from 'chart.js';
import router from '../router/router';
import { triggerList, findByTriggerID } from '../logic/data/skillTrigger';
import { idolList, findByIdolID } from '../logic/data/idolList';
import { liveSkillAppeal, findByAppealID, liveSkillEffect, findByLiveEffectID } from '../logic/data/skillEffect';
import { appealCalculation } from '../logic/data/appealCalculate'

Chart.register(...registerables);

const logErrer = ref(false);
const displayChart = ref(false);
const graphTurn = ref(0); // グラフの表示ターン
const graphMode: { Name: string, ModeID: number }[] = [{
  Name: "バフ（総合）",
  ModeID: 1
}, {
  Name: "バフ（パッシブのみ）",
  ModeID: 2
}, {
  Name: "メンタル",
  ModeID: 3
}, {
  Name: "注目度",
  ModeID: 4
}, {
  Name: "回復回数",
  ModeID: 5
}, {
  Name: "思い出ゲージ",
  ModeID: 6
},
]
const selectedGraphMode = ref(1); // グラフの表示項目
const dataMode: { Name: string, ModeID: number }[] = [{
    Name: "平均値",
    ModeID: 1
  },{
    Name: "中央値",
    ModeID: 2
  },{
    Name: "上位25%",
    ModeID: 3
  },{
    Name: "下位25%",
    ModeID: 4
  },
]
const selectedDataMode = ref(1); // グラフの表示データ
const selectedVo = ref(true); // Vo の選択
const selectedDa = ref(true); // Ds の選択
const selectedVi = ref(true); // Vi の選択
const labelDiscription = ref("") // ラベルの説明文

// グラフの描写
const resultGraph = ref<HTMLCanvasElement | null>(null);
let ctx: Chart; // @ts-ignore
const drawChart = (data, option) => {
  const canvas = resultGraph.value;
  if (canvas === null) {
    return
  } else {
    if (ctx) {
      ctx.destroy();
    }
    ctx = new Chart(canvas, {
      type: 'line',
      data: data,
      options: option
    })
  }
}
type Datasets = {
  label: string,
  data: number[],
  borderColor: string,
}
const chartColor = {
  Vo: '#f44',
  Da: '#3bf',
  Vi: '#fb3',
  Me: '#c4f',
  Attention: '#f50',
  RecTime: '#3fb',
  Memory: '#61f'
}
const createCharts = () => {
  try {
    // 平均値、中央値、四分位数の取得
    const searchData = (searchArray:number[]):number => {
      if(selectedDataMode.value == 1) {
        // 平均値の取得
        let sum = 0;
        for(let i = 0; i < searchArray.length; i++) {
          sum += searchArray[i];
        }
        return (Math.floor((sum * 10) / (vault.detailSetting.count * 1000)) / 10); // 小数点第一位まで計算
      }else if(selectedDataMode.value == 2) {
        // 中央値の取得
        return searchArray[vault.detailSetting.count * 500 - 1];
      }else if(selectedDataMode.value == 3) {
        // 上位25% (第一四分位数) の取得
        return searchArray[vault.detailSetting.count * 250 - 1];
      }else if(selectedDataMode.value == 4) {
        // 下位25% (第二四分位数) の取得
        return searchArray[vault.detailSetting.count * 750 - 1];
      }else {
        console.log("searchMode is not found");
        return 0;
      }
    }
  
    // 全ターンのデータの作成
    const createAllTurnChart = () => {
      if(vault.log[1].MemoryGauge) {} // errer の発生
      type psData = {
        label: string,
        data: number[],
        borderColor: string
      }
      let data:{labels:string[], datasets:Datasets[]} = {
        labels: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'],
        datasets: [],
      }
      data.datasets.length = 0;
      if(selectedGraphMode.value == 1) {
        if(selectedVo.value) {
          let pushData:psData = {
            label: 'Vo総合',
            data: [],
            borderColor: chartColor.Vo,
          }
          for(let i = 0; i < vault.log.length; i++) {
            pushData.data.push(searchData(vault.log[i].Buff.Total.tVo))
          }
          data.datasets.push(pushData)
        }
        if(selectedDa.value) {
          let pushData:psData = {
            label: 'Da総合',
            data: [],
            borderColor: chartColor.Da,
          }
          for(let i = 0; i < vault.log.length; i++) {
            pushData.data.push(searchData(vault.log[i].Buff.Total.tDa))
          }
          data.datasets.push(pushData)
        }
        if(selectedVi.value) {
          let pushData:psData = {
            label: 'Vi総合',
            data: [],
            borderColor: chartColor.Vi,
          }
          for(let i = 0; i < vault.log.length; i++) {
            pushData.data.push(searchData(vault.log[i].Buff.Total.tVi))
          }
          data.datasets.push(pushData)
        }
        labelDiscription.value = "縦軸:バフの倍率、横軸:ターン数";
        drawChart(data, {})
      }else if(selectedGraphMode.value == 2) {
        if(selectedVo.value) {
          let pushData:psData = {
            label: 'Voパッシブ',
            data: [],
            borderColor: chartColor.Vo,
          }
          for(let i = 0; i < vault.log.length; i++) {
            pushData.data.push(searchData(vault.log[i].Buff.Passive.pVo))
          }
          data.datasets.push(pushData)
        }
        if(selectedDa.value) {
          let pushData:psData = {
            label: 'Daパッシブ',
            data: [],
            borderColor: chartColor.Da,
          }
          for(let i = 0; i < vault.log.length; i++) {
            pushData.data.push(searchData(vault.log[i].Buff.Passive.pDa))
          }
          data.datasets.push(pushData)
        }
        if(selectedVi.value) {
          let pushData:psData = {
            label: 'Viパッシブ',
            data: [],
            borderColor: chartColor.Vi,
          }
          for(let i = 0; i < vault.log.length; i++) {
            pushData.data.push(searchData(vault.log[i].Buff.Passive.pVi))
          }
          data.datasets.push(pushData)
        }
        labelDiscription.value = "縦軸:バフの倍率、横軸:ターン数";
        drawChart(data, {})
      }else if(selectedGraphMode.value == 3) {
        let pushData:psData = {
          label: 'メンタル',
          data: [],
          borderColor: chartColor.Me,
        }
        for(let i = 0; i < vault.log.length; i++) {
          pushData.data.push(searchData(vault.log[i].Mental))
        }
        data.datasets.push(pushData)
        labelDiscription.value = "縦軸:ターン開始メンタルの値、横軸:ターン数";
        drawChart(data, {
            scales: {
              y: {
                min: 0,
                max: vault.staticStatus.Me
              }
            }
          })
      }else if(selectedGraphMode.value == 4) {
        let pushData:psData = {
          label: '注目度',
          data: [],
          borderColor: chartColor.Attention,
        }
        for(let i = 0; i < vault.log.length; i++) {
          pushData.data.push(searchData(vault.log[i].Attention))
        }
        data.datasets.push(pushData)
        labelDiscription.value = "縦軸:変動した注目度の値、横軸:ターン数";
        drawChart(data, {})
      }else if(selectedGraphMode.value == 5) {
        let pushData:psData = {
          label: '回復回数',
          data: [],
          borderColor: chartColor.RecTime,
        }
        for(let i = 0; i < vault.log.length; i++) {
          pushData.data.push(searchData(vault.log[i].RecoveryTimes))
        }
        data.datasets.push(pushData)
        labelDiscription.value = "縦軸:回復回数、横軸:ターン数";
        drawChart(data, {
            scales: {
              y: {
                min: 0
              }
            }
          })
      }else if(selectedGraphMode.value == 6) {
        let pushData:psData = {
          label: '思い出ゲージ',
          data: [],
          borderColor: chartColor.Memory,
        }
        for(let i = 0; i < vault.log.length; i++) {
          pushData.data.push(searchData(vault.log[i].MemoryGauge) / 10)
        }
        data.datasets.push(pushData)
        labelDiscription.value = "縦軸:思い出ゲージ(%)、横軸:ターン数";
        drawChart(data, {
            scales: {
              y: {
                min: 0,
                max: 100
              }
            }
          })
      }
    }
  
    // 1ターンのデータの作成
    const createOneTurnChart = (turn:number) => {
      let Turn = turn -1;
      vault.log[Turn]
      type psData = {
        label: string,
        data: number[],
        borderColor: string
      }
      let data:{labels:string[], datasets:Datasets[]} = {
        labels: [],
        datasets: [],
      }
      data.labels.length = 0;
      data.datasets.length = 0;
      const createLabel = (array:number[]):number[] => {
        let returnArray = [];
        returnArray.length = 0;
        let labelValue = 0;
            data.labels.push(String(labelValue));
            returnArray.push(0);
        for(let i = array.length - 1; i >= 0; i--) {
          if(array[i] > labelValue) {
            labelValue += 10;
            data.labels.push(String(labelValue));
            returnArray.push(0);
          }
        }
        return returnArray;
      }
      if(selectedGraphMode.value == 1) {
        let maxArray = [0];
        if(selectedVo.value && maxArray[maxArray.length - 1] <= vault.log[Turn].Buff.Total.tVo[vault.log[Turn].Buff.Total.tVo.length - 1]) {
          maxArray = vault.log[Turn].Buff.Total.tVo;
        }
        if(selectedDa.value && maxArray[maxArray.length - 1] <= vault.log[Turn].Buff.Total.tDa[vault.log[Turn].Buff.Total.tDa.length - 1]) {
          maxArray = vault.log[Turn].Buff.Total.tDa;
        }
        if(selectedVi.value && maxArray[maxArray.length - 1] <= vault.log[Turn].Buff.Total.tVi[vault.log[Turn].Buff.Total.tVi.length - 1]) {
          maxArray = vault.log[Turn].Buff.Total.tVi;
        }
        let dataModel = createLabel(maxArray);
        if(selectedVo.value) {
          let pushData:psData = {
            label: 'Vo総合',
            data: [],
            borderColor: chartColor.Vo,
          }
          pushData.data.length = 0;
          for(let i = 0; i < dataModel.length; i++) {
            pushData.data.push(0);
          }
          let sum = 0;
          for(let i = 0; i < vault.log[Turn].Buff.Total.tVo.length; i++) {
            pushData.data[Math.floor(vault.log[Turn].Buff.Total.tVo[i] / 10)] += 1;
            sum += vault.log[Turn].Buff.Total.tVo[i];
          }
          data.datasets.push(pushData)
          detailListPush(pushData.label, vault.log[Turn].Buff.Total.tVo[0], vault.log[Turn].Buff.Total.tVo[vault.detailSetting.count * 1000 - 1], (Math.floor((sum * 10) / (vault.detailSetting.count * 1000)) / 10), vault.log[Turn].Buff.Total.tVo[vault.detailSetting.count * 500 - 1], vault.log[Turn].Buff.Total.tVo[vault.detailSetting.count * 250 - 1], vault.log[Turn].Buff.Total.tVo[vault.detailSetting.count * 750 - 1])
        }
        if(selectedDa.value) {
          let pushData:psData = {
            label: 'Da総合',
            data: [],
            borderColor: chartColor.Da,
          }
          pushData.data.length = 0;
          for(let i = 0; i < dataModel.length; i++) {
            pushData.data.push(0);
          }
          let sum = 0;
          for(let i = 0; i < vault.log[Turn].Buff.Total.tDa.length; i++) {
            pushData.data[Math.floor(vault.log[Turn].Buff.Total.tDa[i] / 10)] += 1;
            sum += vault.log[Turn].Buff.Total.tDa[i];
          }
          data.datasets.push(pushData)
          detailListPush(pushData.label, vault.log[Turn].Buff.Total.tDa[0], vault.log[Turn].Buff.Total.tDa[vault.detailSetting.count * 1000 - 1], (Math.floor((sum * 10) / (vault.detailSetting.count * 1000)) / 10), vault.log[Turn].Buff.Total.tDa[vault.detailSetting.count * 500 - 1], vault.log[Turn].Buff.Total.tDa[vault.detailSetting.count * 250 - 1], vault.log[Turn].Buff.Total.tDa[vault.detailSetting.count * 750 - 1])
        }
        if(selectedVi.value) {
          let pushData:psData = {
            label: 'Vi総合',
            data: [],
            borderColor: chartColor.Vi,
          }
          pushData.data.length = 0;
          for(let i = 0; i < dataModel.length; i++) {
            pushData.data.push(0);
          }
          let sum = 0;
          for(let i = 0; i < vault.log[Turn].Buff.Total.tVi.length; i++) {
            pushData.data[Math.floor(vault.log[Turn].Buff.Total.tVi[i] / 10)] += 1;
            sum += vault.log[Turn].Buff.Total.tVi[i];
          }
          data.datasets.push(pushData)
          detailListPush(pushData.label, vault.log[Turn].Buff.Total.tVi[0], vault.log[Turn].Buff.Total.tVi[vault.detailSetting.count * 1000 - 1], (Math.floor((sum * 10) / (vault.detailSetting.count * 1000)) / 10), vault.log[Turn].Buff.Total.tVi[vault.detailSetting.count * 500 - 1], vault.log[Turn].Buff.Total.tVi[vault.detailSetting.count * 250 - 1], vault.log[Turn].Buff.Total.tVi[vault.detailSetting.count * 750 - 1])
        }
        for(let i = 0; i < data.datasets.length; i++) {
          for(let j = 0; j < data.datasets[i].data.length; j++) {
            data.datasets[i].data[j] = Math.floor((data.datasets[i].data[j] / (vault.detailSetting.count * 1000)) * 10000) / 100
          }
        }
        labelDiscription.value = "縦軸:試行回数に対する割合(%)、横軸:バフの値";
        drawChart(data, {})
      }else if(selectedGraphMode.value == 2) {
        let maxArray = [0];
        if(selectedVo.value && maxArray[maxArray.length - 1] <= vault.log[Turn].Buff.Total.tVo[vault.log[Turn].Buff.Total.tVo.length - 1]) {
          maxArray = vault.log[Turn].Buff.Passive.pVo;
        }
        if(selectedDa.value && maxArray[maxArray.length - 1] <= vault.log[Turn].Buff.Total.tDa[vault.log[Turn].Buff.Total.tDa.length - 1]) {
          maxArray = vault.log[Turn].Buff.Passive.pDa;
        }
        if(selectedVi.value && maxArray[maxArray.length - 1] <= vault.log[Turn].Buff.Total.tVi[vault.log[Turn].Buff.Total.tVi.length - 1]) {
          maxArray = vault.log[Turn].Buff.Passive.pVi;
        }
        let dataModel = createLabel(maxArray);
        if(selectedVo.value) {
          let pushData:psData = {
            label: 'Voパッシブ',
            data: [],
            borderColor: chartColor.Vo,
          }
          pushData.data.length = 0;
          for(let i = 0; i < dataModel.length; i++) {
            pushData.data.push(0);
          }
          let sum = 0;
          for(let i = 0; i < vault.log[Turn].Buff.Passive.pVo.length; i++) {
            pushData.data[Math.floor(vault.log[Turn].Buff.Passive.pVo[i] / 10)] += 1;
            sum += vault.log[Turn].Buff.Passive.pVo[i];
          }
          data.datasets.push(pushData);
          detailListPush(pushData.label, vault.log[Turn].Buff.Passive.pVo[0], vault.log[Turn].Buff.Passive.pVo[vault.detailSetting.count * 1000 - 1], (Math.floor((sum * 10) / (vault.detailSetting.count * 1000)) / 10),vault.log[Turn].Buff.Passive.pVo[vault.detailSetting.count * 500 - 1], vault.log[Turn].Buff.Passive.pVo[vault.detailSetting.count * 250 - 1], vault.log[Turn].Buff.Passive.pVo[vault.detailSetting.count * 750 - 1])
        }
        if(selectedDa.value) {
          let pushData:psData = {
            label: 'Daパッシブ',
            data: [],
            borderColor: chartColor.Da,
          }
          pushData.data.length = 0;
          for(let i = 0; i < dataModel.length; i++) {
            pushData.data.push(0);
          }
          let sum = 0;
          for(let i = 0; i < vault.log[Turn].Buff.Passive.pDa.length; i++) {
            pushData.data[Math.floor(vault.log[Turn].Buff.Passive.pDa[i] / 10)] += 1;
            sum += vault.log[Turn].Buff.Passive.pDa[i];
          }
          data.datasets.push(pushData);
          detailListPush(pushData.label, vault.log[Turn].Buff.Passive.pDa[0], vault.log[Turn].Buff.Passive.pDa[vault.detailSetting.count * 1000 - 1], (Math.floor((sum * 10) / (vault.detailSetting.count * 1000)) / 10), vault.log[Turn].Buff.Passive.pDa[vault.detailSetting.count * 500 - 1], vault.log[Turn].Buff.Passive.pDa[vault.detailSetting.count * 250 - 1], vault.log[Turn].Buff.Passive.pDa[vault.detailSetting.count * 750 - 1]);
        }
        if(selectedVi.value) {
          let pushData:psData = {
            label: 'Viパッシブ',
            data: [],
            borderColor: chartColor.Vi,
          }
          pushData.data.length = 0;
          for(let i = 0; i < dataModel.length; i++) {
            pushData.data.push(0);
          }
          let sum = 0;
          for(let i = 0; i < vault.log[Turn].Buff.Passive.pVi.length; i++) {
            pushData.data[Math.floor(vault.log[Turn].Buff.Passive.pVi[i] / 10)] += 1;
            sum += vault.log[Turn].Buff.Passive.pVi[i];
          }
          data.datasets.push(pushData);
          detailListPush(pushData.label, vault.log[Turn].Buff.Passive.pVi[0], vault.log[Turn].Buff.Passive.pVi[vault.detailSetting.count * 1000 - 1], (Math.floor((sum * 10) / (vault.detailSetting.count * 1000)) / 10), vault.log[Turn].Buff.Passive.pVi[vault.detailSetting.count * 500 - 1], vault.log[Turn].Buff.Passive.pVi[vault.detailSetting.count * 250 - 1], vault.log[Turn].Buff.Passive.pVi[vault.detailSetting.count * 750 - 1]);
        }
        for(let i = 0; i < data.datasets.length; i++) {
          for(let j = 0; j < data.datasets[i].data.length; j++) {
            data.datasets[i].data[j] = Math.floor((data.datasets[i].data[j] / (vault.detailSetting.count * 1000)) * 10000) / 100
          }
        }
        labelDiscription.value = "縦軸:試行回数に対する割合(%)、横軸:バフの値";
        drawChart(data, {})
      }else if(selectedGraphMode.value == 3) {
        const createMentalLabel = ():number[] => {
          let returnArray = [];
          returnArray.length = 0;
          for(let i = 0; i <= 100; i += 5) {
            data.labels.push(String(i));
            returnArray.push(0);
          }
          return returnArray;
        }
        let pushData:psData = {
          label: 'メンタル',
          data: createMentalLabel(),
          borderColor: chartColor.Me,
        }
        let sum = 0;
        for(let i = 0; i < vault.log[Turn].Mental.length; i++) {
          pushData.data[Math.floor(Math.floor((vault.log[Turn].Mental[i] / vault.staticStatus.Me) * 100) / 5)] += 1;
          sum += vault.log[Turn].Mental[i];
        }
        data.datasets.push(pushData);
        detailListPush(pushData.label, vault.log[Turn].Mental[0], vault.log[Turn].Mental[vault.detailSetting.count * 1000 - 1], (Math.floor((sum * 10) / (vault.detailSetting.count * 1000)) / 10), vault.log[Turn].Mental[vault.detailSetting.count * 500 - 1], vault.log[Turn].Mental[vault.detailSetting.count * 250 - 1], vault.log[Turn].Mental[vault.detailSetting.count * 750 - 1]);
        for(let i = 0; i < data.datasets[0].data.length; i++) {
          data.datasets[0].data[i] = Math.floor((data.datasets[0].data[i] / (vault.detailSetting.count * 1000)) * 10000) / 100;
        }
        labelDiscription.value = "縦軸:試行回数に対する割合(%)、横軸:メンタルの割合(%以上)";
        drawChart(data, {
            scales: {
              y: {
                min: 0,
              }
            }
          })
      }else if(selectedGraphMode.value == 4) {
      const createAttentionLabel = ():number[] => {
        let returnArray = [];
        returnArray.length = 0;
        let labelValue = -100;
        for(let i = vault.log[Turn].Attention.length - 1; i >= 0; i--) {
          if(vault.log[Turn].Attention[i] > labelValue) {
            labelValue += 10;
            data.labels.push(String(labelValue));
            returnArray.push(0);
          }
        }
        return returnArray;
      }
        let pushData:psData = {
            label: '注目度',
            data: createAttentionLabel(),
            borderColor: chartColor.Attention,
        }
        let sum = 0;
        for(let i = 0; i < vault.log[Turn].Attention.length; i++) {
          pushData.data[Math.floor(vault.log[Turn].Attention[i] / 10) + 9] += 1;
          sum += vault.log[Turn].Attention[i];
        }
        data.datasets.push(pushData);
          detailListPush(pushData.label, vault.log[Turn].Attention[0], vault.log[Turn].Attention[vault.detailSetting.count * 1000 - 1], (Math.floor((sum * 10) / (vault.detailSetting.count * 1000)) / 10), vault.log[Turn].Attention[vault.detailSetting.count * 500 - 1], vault.log[Turn].Attention[vault.detailSetting.count * 250 - 1], vault.log[Turn].Attention[vault.detailSetting.count * 750 - 1]);
        for(let i = 0; i < data.datasets.length; i++) {
          for(let j = 0; j < data.datasets[i].data.length; j++) {
            data.datasets[i].data[j] = Math.floor((data.datasets[i].data[j] / (vault.detailSetting.count * 1000)) * 10000) / 100
          }
        }
        labelDiscription.value = "縦軸:試行回数に対する割合(%)、横軸:注目度の値";
        drawChart(data, {})
      }else if(selectedGraphMode.value == 5) {
          const createRecTimeLabel = ():number[] => {
            let returnArray = [];
            returnArray.length = 0;
            let labelValue = 0;
            data.labels.push(String(labelValue));
            returnArray.push(0);
            for(let i = vault.log[Turn].RecoveryTimes.length - 1; i >= 0; i--) {
              if(vault.log[Turn].RecoveryTimes[i] > labelValue) {
                labelValue++;
                data.labels.push(String(labelValue));
                returnArray.push(0);
              }
            }
            return returnArray;
          }
          let pushData:psData = {
            label: '回復回数',
            data: createRecTimeLabel(),
            borderColor: chartColor.RecTime,
          }
          let sum = 0;
          for(let i = 0; i < vault.log[Turn].Buff.Passive.pVi.length; i++) {
            pushData.data[vault.log[Turn].RecoveryTimes[i]] += 1;
            sum += vault.log[Turn].RecoveryTimes[i];
          }
          data.datasets.push(pushData);
          detailListPush(pushData.label, vault.log[Turn].RecoveryTimes[0], vault.log[Turn].RecoveryTimes[vault.detailSetting.count * 1000 - 1], (Math.floor((sum * 10) / (vault.detailSetting.count * 1000)) / 10), vault.log[Turn].RecoveryTimes[vault.detailSetting.count * 500 - 1], vault.log[Turn].RecoveryTimes[vault.detailSetting.count * 250 - 1], vault.log[Turn].RecoveryTimes[vault.detailSetting.count * 750 - 1]);
        for(let i = 0; i < data.datasets.length; i++) {
          for(let j = 0; j < data.datasets[i].data.length; j++) {
            data.datasets[i].data[j] = Math.floor((data.datasets[i].data[j] / (vault.detailSetting.count * 1000)) * 10000) / 100
          }
        }
        labelDiscription.value = "縦軸:試行回数に対する割合(%)、横軸:回復回数";
        drawChart(data, {
            scales: {
              y: {
                min: 0
              }
            }
          })
      }else if(selectedGraphMode.value == 6) {
        const createMemoryLabel = ():number[] => {
          let returnArray = [];
          returnArray.length = 0;
          for(let i = 0; i <= 100; i++) {
            data.labels.push(String(i));
            returnArray.push(0);
          }
          return returnArray;
        }
        let pushData:psData = {
          label: '思い出ゲージ',
          data: createMemoryLabel(),
          borderColor: chartColor.Memory,
        }
        let sum = 0;
        for(let i = 0; i < vault.log[Turn].Buff.Total.tVo.length; i++) {
          pushData.data[Math.floor(vault.log[Turn].MemoryGauge[i] / 10)] += 1;
          sum += vault.log[Turn].MemoryGauge[i];
        }
        data.datasets.push(pushData);
        detailListPush(pushData.label, vault.log[Turn].MemoryGauge[0], vault.log[Turn].MemoryGauge[vault.detailSetting.count * 1000 - 1], (Math.floor((sum * 10) / (vault.detailSetting.count * 1000)) / 10), vault.log[Turn].MemoryGauge[vault.detailSetting.count * 500 - 1], vault.log[Turn].MemoryGauge[vault.detailSetting.count * 250 - 1], vault.log[Turn].MemoryGauge[vault.detailSetting.count * 750 - 1]);
        for(let i = 0; i < data.datasets[0].data.length; i++) {
          data.datasets[0].data[i] = Math.floor((data.datasets[0].data[i] / (vault.detailSetting.count * 1000)) * 10000) / 100;
        }
        labelDiscription.value = "縦軸:試行回数に対する割合(%)、横軸:思い出ゲージ";
        drawChart(data, {
            scales: {
              y: {
                min: 0
              }
            }
          })
      }
    }
    
    detailList.length = 0;
    if(graphTurn.value == 0) {
      createAllTurnChart();
    }else {
      createOneTurnChart(graphTurn.value);
      createTriggerList();
    }
    displayChart.value = true;
  } catch (error) {
    console.log(error)
    logErrer.value = true;
    displayChart.value = false;
  }
}

// 詳細リスト
type dList = {
  label: string,
  max: number,
  min: number,
  average: number,
  median: number,
  firstQuartile: number,
  thirdQuartile: number
}
let detailList:dList[] = [{
  label: 'test',
  max: 0,
  min: 0,
  average: 0,
  median: 0,
  firstQuartile: 0,
  thirdQuartile: 0
}]
detailList.length = 0;
/**
 * ステータス詳細リストへの挿入
 * @param label ラベル
 * @param max 最大値
 * @param min 最小値
 * @param average 平均値
 * @param median 中央値
 * @param fQuartile 第一四分位数
 * @param tQuartile 第三四分位数
 */
const detailListPush = (label:string, max:number, min:number, average:number, median:number, fQuartile:number, tQuartile:number) => {
  detailList.push({
    label: label,
    max: max,
    min: min,
    average: average,
    median: median,
    firstQuartile: fQuartile,
    thirdQuartile: tQuartile
  });
  displayUpdate();
}

// パッシブ発動率
type pActiveList = {
  label: string,
  attribute: string,
  color: "white" | "gold" | "rainbow",
  value: number,
  trigger: string,
  rate: number
}
let passiveActiveList:pActiveList[] = [{
  label: 'test',
  attribute: '',
  color: 'white',
  value: 0,
  trigger: 'test',
  rate: 0
}]
const createTriggerList = () => {
  passiveActiveList.length = 0;
  const Turn = graphTurn.value - 1;
  for(let i = 0; i < vault.passiveSkills.length; i++) {
    passiveActiveList.push({
      label: vault.passiveSkills[i].Name,
      attribute: vault.passiveSkills[i].Attribute,
      color: vault.passiveSkills[i].Color,
      value: vault.passiveSkills[i].Value,
      trigger: triggerList[findByTriggerID(vault.passiveSkills[i].Trigger.tID)].label.replace('【X】', String(vault.passiveSkills[i].Trigger.tX)),
      rate: Math.floor((vault.log[Turn].PassiveActTime[i] / (vault.detailSetting.count * 1000)) * 10000) / 100
    })
  }
  // ソート
  for(let i = 0; i < passiveActiveList.length - 1; i++) {
    for(let j = 0; j < passiveActiveList.length - 1 - i; j++) {
      if(passiveActiveList[j].rate < passiveActiveList[j + 1].rate) {
        let tmp:pActiveList = passiveActiveList[j];
        passiveActiveList[j] = passiveActiveList[j + 1];
        passiveActiveList[j + 1] = tmp;
      }
    }
  }
}

// アピールラベル
const appealLabel = (lsindex:number, mode: 'appeal' | 'effect', elseIndex:number) => {
  if(mode == 'appeal') {
    return vault.fesIdols[appealIdol.value].LiveSkill[lsindex].Appeal[elseIndex].aAttribute + liveSkillAppeal[findByAppealID(vault.fesIdols[appealIdol.value].LiveSkill[lsindex].Appeal[elseIndex].aID)].label.replace('【N】', String(vault.fesIdols[appealIdol.value].LiveSkill[lsindex].Appeal[elseIndex].aValue));
  }else if(mode == 'effect') {
    let str = liveSkillEffect[findByLiveEffectID(vault.fesIdols[appealIdol.value].LiveSkill[lsindex].Effect[elseIndex].eID)].label.replace('【N】', String(vault.fesIdols[appealIdol.value].LiveSkill[lsindex].Effect[elseIndex].eValue));
    str =  str.replace('【M】', String(vault.fesIdols[appealIdol.value].LiveSkill[lsindex].Effect[elseIndex].eTurn[1]));
    if(liveSkillEffect[findByLiveEffectID(vault.fesIdols[appealIdol.value].LiveSkill[lsindex].Effect[elseIndex].eID)].existAttribute) {
      return vault.fesIdols[appealIdol.value].LiveSkill[lsindex].Effect[elseIndex].eNote + str;
    }
  }else {
    console.log("appeal label error");
    return '';
  }
}

const appealIdol = ref(0);
const liveSkillIndex = ref(0);
let appeals:{
  normalAppeal: [{Label: string, Value: number, AppealMode: 'Bad' | 'Normal' | 'Good' | 'Perfect' , Variable: boolean, RatioLabel: string, Ratio: number, Result: {Vo: number, Da: number, Vi: number}}],
  extraAppeal: [{Label: string, Value: number, AppealMode: 'Bad' | 'Normal' | 'Good' | 'Perfect' , Variable: boolean, RatioLabel: string, Ratio: number, Result: {Vo: number, Da: number, Vi: number}}],
};
const interest = ref(1); // 興味値
const slowStart = ref(0); // スロースターター
const startDash = ref(0); // スタートダッシュ
const memoryHigh = ref(0); // 思い出高
const memoryLow = ref(0) // 思い出低
const appealUp = ref(0); // その他アピールUP
const appealDataMode = ref(1);
let buff = {
  Vo: 0,
  Da: 0,
  Vi: 0,
  Passive: {
    Vo: 0,
    Da: 0,
    Vi: 0
  }
};
let memory = 0;
const getBuff = () => {
  // バフ、思い出ゲージの取得
  if(appealDataMode.value == 1) {
    let buffSum = {
      Vo: 0,
      Da: 0,
      Vi: 0,
      Passive: {
        Vo: 0,
        Da: 0,
        Vi: 0
      }
    }
    let memorySum = 0;
    for(let j = 0; j < vault.detailSetting.count * 1000; j++) {
      buffSum.Vo += vault.log[graphTurn.value - 1].Buff.Total.tVo[j];
      buffSum.Passive.Vo += vault.log[graphTurn.value - 1].Buff.Passive.pVo[j];
      buffSum.Da += vault.log[graphTurn.value - 1].Buff.Total.tDa[j];
      buffSum.Passive.Da += vault.log[graphTurn.value - 1].Buff.Passive.pDa[j];
      buffSum.Vi += vault.log[graphTurn.value - 1].Buff.Total.tVi[j];
      buffSum.Passive.Vi += vault.log[graphTurn.value - 1].Buff.Passive.pVi[j];
      memorySum += vault.log[graphTurn.value - 1].MemoryGauge[j];
    }
    buff.Vo = Math.floor(buffSum.Vo / (vault.detailSetting.count * 1000));
    buff.Da = Math.floor(buffSum.Da / (vault.detailSetting.count * 1000));
    buff.Vi = Math.floor(buffSum.Vi / (vault.detailSetting.count * 1000));
    buff.Passive.Vo = Math.floor(buffSum.Passive.Vo / (vault.detailSetting.count * 1000));
    buff.Passive.Da = Math.floor(buffSum.Passive.Da / (vault.detailSetting.count * 1000));
    buff.Passive.Vi = Math.floor(buffSum.Passive.Vi / (vault.detailSetting.count * 1000));
    memory = Math.floor(memorySum / (vault.detailSetting.count * 1000));
  }else if(appealDataMode.value == 2) {
    buff.Vo = vault.log[graphTurn.value - 1].Buff.Total.tVo[vault.detailSetting.count * 500 - 1];
    buff.Da = vault.log[graphTurn.value - 1].Buff.Total.tDa[vault.detailSetting.count * 500 - 1];
    buff.Vi = vault.log[graphTurn.value - 1].Buff.Total.tVi[vault.detailSetting.count * 500 - 1];
    memory = vault.log[graphTurn.value - 1].MemoryGauge[vault.detailSetting.count * 500 - 1];
  }else if(appealDataMode.value == 3) {
    buff.Vo = vault.log[graphTurn.value - 1].Buff.Total.tVo[vault.detailSetting.count * 250 - 1];
    buff.Da = vault.log[graphTurn.value - 1].Buff.Total.tDa[vault.detailSetting.count * 250 - 1];
    buff.Vi = vault.log[graphTurn.value - 1].Buff.Total.tVi[vault.detailSetting.count * 250 - 1];
    memory = vault.log[graphTurn.value - 1].MemoryGauge[vault.detailSetting.count * 250 - 1];
  }else if(appealDataMode.value == 4) {
    buff.Vo = vault.log[graphTurn.value - 1].Buff.Total.tVo[vault.detailSetting.count * 750 - 1];
    buff.Da = vault.log[graphTurn.value - 1].Buff.Total.tDa[vault.detailSetting.count * 750 - 1];
    buff.Vi = vault.log[graphTurn.value - 1].Buff.Total.tVi[vault.detailSetting.count * 750 - 1];
    memory = vault.log[graphTurn.value - 1].MemoryGauge[vault.detailSetting.count * 750 - 1];
  }
}
const appealCalcInit = () => {
  getBuff();
  // ラベル作成
  const isMemory = (liveSkillIndex.value == 2);
  let appealResult: {Label: string, Value: number, AppealMode: 'Bad' | 'Normal' | 'Good' | 'Perfect' , Variable: boolean, RatioLabel: string, Ratio: number, Result: {Vo: number, Da: number, Vi: number}} = {Label: "", Value: 0, AppealMode: 'Perfect', Variable: false, RatioLabel: "", Ratio: 0, Result: {Vo: 0, Da: 0, Vi: 0}}
  if(isMemory) {
    // 本体
    appealResult.Label = "思い出本体";
    appealResult.Value = 0;
    appealResult.Variable = false;
    appealResult.RatioLabel = "";
    appealResult.Ratio = 0;
    appealResult.Result = appealCalculation(
      appealIdol.value,
      1,
      appealResult.Value,
      'Excellent',
      'Perfect',
      appealResult.Ratio,
      buff,
      appealUp.value,
      true,
      false
    );
    // normal appeal
    for(let i = 0; i < vault.fesIdols[4].MemoryAppeal.mAppeal.length; i++) {
      appealResult.Label = vault.fesIdols[4].MemoryAppeal.mAppeal[i].maAttribute + liveSkillAppeal[findByAppealID(vault.fesIdols[4].MemoryAppeal.mAppeal[i].maID)].label.replace('【N】倍', '');
      appealResult.Value = vault.fesIdols[4].MemoryAppeal.mAppeal[i].maValue;
      appealResult.Variable = liveSkillAppeal[findByAppealID(vault.fesIdols[4].MemoryAppeal.mAppeal[i].maID)].variable;
      appealResult.RatioLabel = liveSkillAppeal[findByAppealID(vault.fesIdols[4].MemoryAppeal.mAppeal[i].maID)].ratioLabel;
      appealResult.Ratio = ref(liveSkillAppeal[findByAppealID(vault.fesIdols[4].MemoryAppeal.mAppeal[i].maID)].init).value;
      appealResult.Result = appealCalculation(
        appealIdol.value,
        vault.fesIdols[4].MemoryAppeal.mAppeal[i].maID,
        appealResult.Value,
        vault.fesIdols[4].MemoryAppeal.mAppeal[i].maAttribute,
        'Perfect',
        appealResult.Ratio,
        buff,
        appealUp.value,
        false,
        false
      );
      appeals.normalAppeal.push(appealResult);
    }
    // extra appeal
    for(let i = 0; i < vault.fesIdols[4].MemoryAppeal.mLink.mlAppeal.length; i++) {
      appealResult.Label = vault.fesIdols[4].MemoryAppeal.mLink.mlAppeal[i].mlaAttribute + liveSkillAppeal[findByAppealID(vault.fesIdols[4].MemoryAppeal.mLink.mlAppeal[i].mlaID)].label.replace('【N】倍', '');
      appealResult.Value = vault.fesIdols[4].MemoryAppeal.mLink.mlAppeal[i].mlaValue;
      appealResult.Variable = liveSkillAppeal[findByAppealID(vault.fesIdols[4].MemoryAppeal.mLink.mlAppeal[i].mlaID)].variable;
      appealResult.RatioLabel = liveSkillAppeal[findByAppealID(vault.fesIdols[4].MemoryAppeal.mAppeal[i].maID)].ratioLabel;
      appealResult.Ratio = ref(liveSkillAppeal[findByAppealID(vault.fesIdols[4].MemoryAppeal.mLink.mlAppeal[i].mlaID)].init).value;
      appealResult.Result = appealCalculation(
        appealIdol.value,
        vault.fesIdols[4].MemoryAppeal.mLink.mlAppeal[i].mlaID,
        appealResult.Value,
        vault.fesIdols[4].MemoryAppeal.mLink.mlAppeal[i].mlaAttribute,
        'Perfect',
        appealResult.Ratio,
        buff,
        appealUp.value,
        false,
        true
      );
      appeals.extraAppeal.push(appealResult);
    }
  }else {
    // normal appeal
    for(let i = 0; i < vault.fesIdols[appealIdol.value].LiveSkill[liveSkillIndex.value].Appeal.length; i++) {
      appealResult.Label = vault.fesIdols[4].LiveSkill[liveSkillIndex.value].Appeal[i].aAttribute + liveSkillAppeal[findByAppealID(vault.fesIdols[4].LiveSkill[liveSkillIndex.value].Appeal[i].aID)].label.replace('【N】倍', '');
      appealResult.Value = vault.fesIdols[4].LiveSkill[liveSkillIndex.value].Appeal[i].aValue;
      appealResult.Variable = liveSkillAppeal[findByAppealID(vault.fesIdols[4].LiveSkill[liveSkillIndex.value].Appeal[i].aID)].variable;
      appealResult.RatioLabel = liveSkillAppeal[findByAppealID(vault.fesIdols[4].LiveSkill[liveSkillIndex.value].Appeal[i].aID)].ratioLabel;
      appealResult.Ratio = ref(liveSkillAppeal[findByAppealID(vault.fesIdols[4].LiveSkill[liveSkillIndex.value].Appeal[i].aID)].init).value;
      appealResult.Result = appealCalculation(
        appealIdol.value,
        vault.fesIdols[appealIdol.value].LiveSkill[liveSkillIndex.value].Appeal[i].aID,
        appealResult.Value,
        vault.fesIdols[appealIdol.value].LiveSkill[liveSkillIndex.value].Appeal[i].aAttribute,
        'Perfect',
        appealResult.Ratio,
        buff,
        appealUp.value,
        false,
        false
      );
      appeals.normalAppeal.push(appealResult);
    }
    // extra appeal
    for(let i = 0; i < vault.fesIdols[appealIdol.value].LiveSkill[liveSkillIndex.value].Link.lAppeal.length; i++) {
      appealResult.Label = vault.fesIdols[4].LiveSkill[liveSkillIndex.value].Link.lAppeal[i].laAttribute + liveSkillAppeal[findByAppealID(vault.fesIdols[4].LiveSkill[liveSkillIndex.value].Link.lAppeal[i].laID)].label.replace('【N】倍', '');
      appealResult.Value = vault.fesIdols[4].LiveSkill[liveSkillIndex.value].Link.lAppeal[i].laValue;
      appealResult.Variable = liveSkillAppeal[findByAppealID(vault.fesIdols[4].LiveSkill[liveSkillIndex.value].Link.lAppeal[i].laID)].variable;
      appealResult.RatioLabel = liveSkillAppeal[findByAppealID(vault.fesIdols[4].LiveSkill[liveSkillIndex.value].Link.lAppeal[i].laID)].ratioLabel;
      appealResult.Ratio = ref(liveSkillAppeal[findByAppealID(vault.fesIdols[4].LiveSkill[liveSkillIndex.value].Link.lAppeal[i].laID)].init).value;
      appealResult.Result = appealCalculation(
        appealIdol.value,
        vault.fesIdols[appealIdol.value].LiveSkill[liveSkillIndex.value].Link.lAppeal[i].laID,
        appealResult.Value,
        vault.fesIdols[appealIdol.value].LiveSkill[liveSkillIndex.value].Link.lAppeal[i].laAttribute,
        'Perfect',
        appealResult.Ratio,
        buff,
        appealUp.value,
        false,
        true
      );
      appeals.extraAppeal.push(appealResult);
    }
  }
  
}
const appealCalc = () => {
  let normalIndex = 0;
  // 思い出本体
  if(liveSkillIndex.value == 2) {
    appeals.normalAppeal[0].Result = appealCalculation(
      appealIdol.value,
      1,
      appeals.normalAppeal[0].Value,
      'Excellent',
      appeals.normalAppeal[0].AppealMode,
      appeals.normalAppeal[0].Ratio,
      buff,
      appealUp.value,
      true,
      false
    )
    normalIndex = 1;
  }
  // 通常アピール
  for(let i = normalIndex; i < appeals.normalAppeal.length; i++) {
    appeals.normalAppeal[i].Result = appealCalculation(
      appealIdol.value,
      vault.fesIdols[appealIdol.value].LiveSkill[liveSkillIndex.value].Appeal[i].aID,
      appeals.normalAppeal[i].Value,
      vault.fesIdols[appealIdol.value].LiveSkill[liveSkillIndex.value].Appeal[i].aAttribute,
      appeals.normalAppeal[i].AppealMode,
      appeals.normalAppeal[i].Ratio,
      buff,
      appealUp.value,
      false,
      false
    )
  }
  // Link, Plusアピール
  for(let i = 0; i < appeals.extraAppeal.length; i++) {
    appeals.extraAppeal[i].Result = appealCalculation(
      appealIdol.value,
      vault.fesIdols[appealIdol.value].LiveSkill[liveSkillIndex.value].Link.lAppeal[i].laID,
      appeals.extraAppeal[i].Value,
      vault.fesIdols[appealIdol.value].LiveSkill[liveSkillIndex.value].Link.lAppeal[i].laAttribute,
      appeals.extraAppeal[i].AppealMode,
      appeals.extraAppeal[i].Ratio,
      buff,
      appealUp.value,
      false,
      false
    )
  }
}
const VoAppeal = ref(0);
const DaAppeal = ref(0);
const ViAppeal = ref(0);

// ステータス詳細画面
const statusDetailClass = ref("accBtn close")
const displayStatusDetail = ref(true)

// パッシブ発動率画面
const passiveDetailClass = ref("accBtn close")
const displayPassiveDetail = ref(true)

// アピール計算画面
const appealDetailClass = ref("accBtn close")
const displayAppealDetail = ref(true)

// アピールUP画面
const appealUPClass = ref("accBtn close")
const displayAppealUP = ref(true)

// アコーディオンエリアのトグルスイッチ
const toggleAccBtn = (eleClass: string, isBoxDisplay: boolean) => {
    if (eleClass == "statusDetail") {
      if (isBoxDisplay) {
        statusDetailClass.value = "accBtn";
        displayStatusDetail.value = false;
      } else {
        statusDetailClass.value = "accBtn close";
        displayStatusDetail.value = true;
      }
    } else if (eleClass == "passiveDetail") {
      if (isBoxDisplay) {
        passiveDetailClass.value = "accBtn";
        displayPassiveDetail.value = false;
      } else {
        passiveDetailClass.value = "accBtn close";
        displayPassiveDetail.value = true;
      }
    } else if (eleClass == "appealDetail") {
      if (isBoxDisplay) {
        appealDetailClass.value = "accBtn";
        displayAppealDetail.value = false;
      } else {
        appealDetailClass.value = "accBtn close";
        displayAppealDetail.value = true;
      }
    } else if (eleClass == "appealUP") {
      if (isBoxDisplay) {
        appealUPClass.value = "accBtn";
        displayAppealUP.value = false;
      } else {
        appealUPClass.value = "accBtn close";
        displayAppealUP.value = true;
      }
    }
}

// 表示ターン変更時
const changeTurn = () => {
  if(graphTurn.value != 0) {
    getBuff();
    appealCalc();
  }
  createCharts();
}

// 画面更新のための関数
const display = ref(false);
const displayUpdate = () => {
  display.value = true;
  display.value = false;
}

// モバイル切り替え
const mobileView = ref(false);
const watchWindowSize = () => {
  if (window.innerWidth < 1000) {
    mobileView.value = true;
  } else {
    mobileView.value = false;
  }
  createCharts();
}
watchWindowSize()
window.addEventListener('resize', watchWindowSize);

onMounted(() => {
  appealCalcInit();
  createCharts();
})

</script>

<style scoped>
#errerArea {
  margin-top: 10%;
}
#settingArea {
  margin-left: 20vw;
}
#graphArea {
  width: 60vw;
  height: auto;
  margin: auto;
}
#labelDiscription {
  text-align: center;
}
#listArea {
  margin: 10vh 0 0 15vw;
}
.bigBtn {
  width: 150px;
  padding: 10px;
  text-align: center;
  font-size: 17px;
  font-weight: bold;
  border-radius: 10px;
  user-select: none;
  color: aliceblue;
  background-color: rgba(3, 36, 182, 0.658);
  margin: auto;
  margin-top: 10vh;
}
.bigBtn:hover {
  cursor: pointer;
  background-color: rgba(3, 36, 182, 0.9);
}

.accArea {
    list-style: none;
  padding-inline-start: 2px;
}

.accArea li {
    margin: 10px 0;
}

.accArea section {
  margin-right: 15vw;
    border: 1px solid #ccc;
    border-radius: 10px;
}

.accArea section h2 {
    z-index: 10;
    user-select: none;
}

.accBtn {
    position: relative;
    cursor: pointer;
    font-size: 1rem;
    font-weight: normal;
    padding: 1% 0 1% 5%;
    -webkit-tap-highlight-color:rgba(0,0,0,0);
}

/*アイコンの＋と×*/
.accBtn::before,
.accBtn::after {
    position: absolute;
    content: '';
    width: 15px;
    height: 2px;
    background-color: #333;

}

.accBtn::before {
    top: 48%;
    left: 15px;
    transform: rotate(0deg);

}

.accBtn::after {
    top: 48%;
    left: 15px;
    transform: rotate(90deg);

}

/*　closeというクラスがついたら形状変化　*/
.accBtn.close::before {
    transform: rotate(45deg);
}

.accBtn.close::after {
    transform: rotate(-45deg);
}

/* accordion box style */
.accBox {
    margin: 0 2% 2% 2%;
}

.accBox ul {
  padding-inline-start: 10px;
  list-style: none;
  padding-right: 5px;
}

.accBox ul>li {
  justify-content: space-between;
  align-items: center;
  padding: 10px;
  border: 2px solid rgba(0, 0, 0, .3);
  border-radius: 10px;
}

.accBox ul li>div {
    border-radius: 10px;
}
.gold {
    background-color: rgba(255, 215, 0, 0.3);
}

.rainbow {
    background-color: rgba(87, 216, 255, 0.3);
}

@media screen and (max-width: 1030px) {
  #errerArea {
    margin-top: 20%;
  }
  #settingArea {
    margin-left: 5vw;
  }
  #graphArea {
    width: 90vw;
  }
  #labelDiscription {
    font-size: .8rem;
  }
  #listArea {
    margin: 5vh 0 0 5vw;
  }
  .bigBtn {
    padding: 5px;
    color: white;
    background-color: rgba(0, 0, 0, 0.603);
  }
  .accArea>li>section {
    margin-right: 5vw;
  }
  .accBox ul {
        padding-right: 0;
    }

    .accBtn {
        text-align: center;
    }

    .accBox>ul>li>div {
        min-width: 70vw;
    }
}
</style>
