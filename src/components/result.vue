<!--  -->
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
        <select v-model="graphTurn" @change="createCharts();">
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
      list
    </div>
  </div>
  <div class="bigBtn" @click="(router.go(-1))">入力画面に戻る</div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import * as vault from '../logic/event/vault';
import { Chart, registerables } from 'chart.js';
import router from '../router/router';

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
const labelDiscription = ref("aaa") // ラベルの説明文

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
  Attention: '#ff4',
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
          for(let i = 0; i < vault.log[Turn].Buff.Total.tVo.length; i++) {
            pushData.data[Math.floor(vault.log[Turn].Buff.Total.tVo[i] / 10)] += 1;
          }
          data.datasets.push(pushData)
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
          for(let i = 0; i < vault.log[Turn].Buff.Total.tDa.length; i++) {
            pushData.data[Math.floor(vault.log[Turn].Buff.Total.tDa[i] / 10)] += 1;
          }
          data.datasets.push(pushData)
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
          for(let i = 0; i < vault.log[Turn].Buff.Total.tVi.length; i++) {
            pushData.data[Math.floor(vault.log[Turn].Buff.Total.tVi[i] / 10)] += 1;
          }
          data.datasets.push(pushData)
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
            label: 'Voパッシブ',
            data: [],
            borderColor: chartColor.Vo,
          }
          pushData.data.length = 0;
          for(let i = 0; i < dataModel.length; i++) {
            pushData.data.push(0);
          }
          for(let i = 0; i < vault.log[Turn].Buff.Passive.pVo.length; i++) {
            pushData.data[Math.floor(vault.log[Turn].Buff.Passive.pVo[i] / 10)] += 1;
          }
          data.datasets.push(pushData)
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
          for(let i = 0; i < vault.log[Turn].Buff.Passive.pDa.length; i++) {
            pushData.data[Math.floor(vault.log[Turn].Buff.Passive.pDa[i] / 10) - 1] += 1;
          }
          data.datasets.push(pushData)
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
          for(let i = 0; i < vault.log[Turn].Buff.Passive.pVi.length; i++) {
            pushData.data[Math.floor(vault.log[Turn].Buff.Passive.pVi[i] / 10) - 1] += 1;
          }
          data.datasets.push(pushData)
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
        for(let i = 0; i < vault.log[Turn].Buff.Total.tVo.length; i++) {
          pushData.data[Math.floor(Math.floor((vault.log[Turn].Mental[i] / vault.staticStatus.Me) * 100) / 5)] += 1;
        }
        data.datasets.push(pushData)
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
        for(let i = 0; i < vault.log[Turn].Attention.length; i++) {
          pushData.data[Math.floor(vault.log[Turn].Attention[i] / 10) + 9] += 1;
        }
        data.datasets.push(pushData)
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
          for(let i = 0; i < vault.log[Turn].Buff.Passive.pVi.length; i++) {
            pushData.data[vault.log[Turn].RecoveryTimes[i]] += 1;
          }
          data.datasets.push(pushData)
        for(let i = 0; i < data.datasets.length; i++) {
          for(let j = 0; j < data.datasets[i].data.length; j++) {
            data.datasets[i].data[j] = Math.floor((data.datasets[i].data[j] / (vault.detailSetting.count * 1000)) * 10000) / 100
          }
        }
        labelDiscription.value = "縦軸:試行回数に対する割合(%)、横軸:回復回数";
        drawChart(data, {})
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
        for(let i = 0; i < vault.log[Turn].Buff.Total.tVo.length; i++) {
          pushData.data[Math.floor(vault.log[Turn].MemoryGauge[i] / 10)] += 1;
        }
        data.datasets.push(pushData)
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
    
    if(graphTurn.value == 0) {
      createAllTurnChart();
    }else {
      createOneTurnChart(graphTurn.value);
    }
    displayChart.value = true;
  } catch (error) {
    console.log(error)
    logErrer.value = true;
    displayChart.value = false;
  }
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
  margin-left: 20vw;
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

@media screen and (max-width: 999px) {
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
    margin-left: 5vw;
  }
  .bigBtn {
    padding: 5px;
    color: white;
    background-color: rgba(0, 0, 0, 0.603);
  }
}
</style>
