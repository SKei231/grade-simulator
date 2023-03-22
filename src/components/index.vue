<template>
    <Header></Header>
    <div id="contents">
        <div class="smallnavbtn-wrapper" v-if="mobileView">
            <div v-bind:class="smallnavbtn" @click="snavBtnActive()"><span></span><span></span><span></span>
                <p></p>
            </div>
        </div>
        <Help ref="displayUserHelp"></Help>
        <div class="smallnav" v-if="smallnavDisplay">
            <ul>
                <li @click="simulationOpen()">次へ</li>
                <li @click="setLocalStorage()">設定を保存</li>
                <li @click="openFile()">設定を入力</li>
                <li @click="outputSetting()">設定を出力</li>
                <li @click="userHelp()">使い方</li>
            </ul>
        </div>
        <div v-if="!mobileView" id="saveBtn" class="bigBtn" @click="setLocalStorage()">設定を保存</div>
        <ul class="accArea">
            <li>
                <section>
                    <h2 v-bind:class="passiveSettingClass" @click="toggleAccBtn('passiveSetting', displayPassiveSetting)">パッシブスキルのセット</h2>
                    <div class="accBox" v-if="displayPassiveSetting" @click="">
                        <ul>
                            <li v-for="(ps, index) in passiveSkills">
                                <div v-bind:class="passiveSkills[index].Color">
                                    <div class="passiveSettingArea">
                                        パッシブ名:
                                        <input type="text" v-model="passiveSkills[index].Name" style="margin-right: 20px;" placeholder="パッシブの呼び名を入力" @change="displayUpdate()"><br v-if="mobileView">
                                        バフ:
                                        <select v-model="passiveSkills[index].Attribute">
                                            <option value="Vo">Vo</option>
                                            <option value="Da">Da</option>
                                            <option value="Vi">Vi</option>
                                            <option value="VoDa">Vo&Da</option>
                                            <option value="DaVi">Da&Vi</option>
                                            <option value="ViVo">Vi&Vo</option>
                                            <option value="All">All</option>
                                        </select>
                                        <input type="number" v-model="passiveSkills[index].Value" v-on:change="passiveColorCheck(index, passiveSkills[index].Gold)" style="width: 50px; margin-left: 10px;">%up<br v-if="mobileView">
                                        <input type="checkbox" v-bind:id="goldID(index)" style="margin-left: 10px;" v-model="passiveSkills[index].Gold" @change="passiveColorCheck(index, passiveSkills[index].Gold)"><label v-bind:for="goldID(index)">金パッシブ</label>
                                    </div>
                                    <div class="passiveSettingArea">
                                        発動条件:
                                        <select v-model="passiveSkills[index].Trigger.tID" @change="clearHistry(index)">
                                            <option v-for="passiveTrigers in passive_trigger.triggerList" v-bind:value="passiveTrigers.ID">{{ passiveTrigers.label }}</option>
                                        </select>
                                        <!-- X の入力 -->
                                        <span v-if="passive_trigger.triggerList[passive_trigger.findByTriggerID(passiveSkills[index].Trigger.tID)].existX" style="padding-left: 10px;"> X:
                                            <input type="number" style="width: 30px;" v-model="passiveSkills[index].Trigger.tX">
                                        </span>
                                    </div>
                                    <div class="passiveSettingArea"
                                        v-if="passiveSkills[index].Trigger.tID == 2 || passiveSkills[index].Trigger.tID == 3">
                                        <!-- 履歴 -->
                                        <span v-for="(his, Hindex) in passiveSkills[index].Trigger.tHis">
                                            履歴:
                                            <select v-model="passiveSkills[index].Trigger.tHis[Hindex]">
                                                <option v-for="idols in idol_list.idolList" v-bind:value="idols.ID">{{ idols.Name }}</option>
                                            </select>
                                        </span>
                                        <div @click="plusHistory(index)" class="btn" style="font-size: 13px;">履歴を追加</div>
                                    </div>
                                    <div class="passiveSettingArea">
                                        <input type="number" style="margin-left: 10px; width: 30px;" v-model="passiveSkills[index].ActiveTurn.after" min="1" v-bind:max="vault.maxTurn">ターン以降<br v-if="mobileView">
                                        <input type="number" style="margin-left: 10px; width: 30px;" v-model="passiveSkills[index].ActiveTurn.before" min="1" v-bind:max="vault.maxTurn">ターン以前　<br v-if="mobileView">確率:
                                        <input type="number" style="width: 45px;" v-model="passiveSkills[index].Probability">%　<br v-if="mobileView">回数:
                                        <input type="number" style="width: 30px;" v-model="passiveSkills[index].Times">回
                                    </div>
                                    <div class="passiveSettingArea" v-for="(ef, Eindex) in passiveSkills[index].Effect">
                                        スキル効果:
                                        <select v-model="passiveSkills[index].Effect[Eindex].eID" @change="displayUpdate()">
                                            <option v-for="passiveEffects in skill_effect.passiveEffect" v-bind:value="passiveEffects.ID">{{ passiveEffects.label }}</option>
                                        </select>
                                        <span
                                            v-if="skill_effect.passiveEffect[skill_effect.findByPassiveID(passiveSkills[index].Effect[Eindex].eID)].existN"
                                            style="padding-left: 10px;"> N:
                                            <input type="number" style="width: 30px;" v-model="passiveSkills[index].Effect[Eindex].eValue">
                                        </span>
                                    </div>
                                    <div @click="plusEffect(index)" class="btn" style="font-size: 13px;">スキル効果を追加</div>
                                </div>
                                <button class="passiveDelBtn"><img src="../assets/trashCan.png" alt="消去" @click="deletePassive(index)"></button>
                            </li>
                            <div class="btn" @click="plusPassive()">パッシブを追加</div>
                        </ul>
                    </div>
                </section>
            </li>
            <li>
                <section>
                    <h2 v-bind:class="formationSettingClass" @click="toggleAccBtn('formationSetting', displayFormationSetting)">編成</h2>
                    <div class="accBox" v-if="displayFormationSetting">
                        <ul>
                            <li v-for="(fesIdolStatus, index) in fesIdols" v-bind:id="fesIdolStatus.Position">
                                <div style="width: 100%; padding-left: 10px;">
                                    <div style="display: flex;">
                                        <h3 class="positionName">{{ fesIdolStatus.Position }} : </h3>
                                        <select v-model="fesIdols[index].Idol" style="margin: 5px;" @change="setLinkTrigger(index)">
                                            <option v-for="idols in idol_list.idolList" v-bind:value="idols.ID">{{ idols.Name }}</option>
                                        </select>
                                    </div>
                                    <div style="margin: 5px;">
                                        Vo: <input type="number" v-model="fesIdols[index].Status.VoValue" style="width: 60px;">
                                        Da: <input type="number" v-model="fesIdols[index].Status.DaValue" style="width: 60px;"><br v-if="mobileView">
                                        Vi: <input type="number" v-model="fesIdols[index].Status.ViValue" style="width: 60px;">
                                        Me: <input type="number" v-model="fesIdols[index].Status.MeValue" style="width: 60px;">
                                    </div>
                                    <div style="margin: 5px;">
                                        思い出レベル: 
                                        <select v-model="fesIdols[index].MemorieLevel" style="margin: 5px;">
                                            <option value='1'>1</option>
                                            <option value='2'>2</option>
                                            <option value='3'>3</option>
                                            <option value='4'>4</option>
                                            <option value='5'>Max</option>
                                        </select>
                                    </div>
                                    <p>ライブスキル</p>
                                    <ul style="padding-left: 0;">
                                        <li v-for="(liveSkills, lindex) in fesIdols[index].LiveSkill" style="display: block;">
                                            優先順位:
                                            <select v-model="fesIdols[index].LiveSkill[lindex].Priority"
                                                @change="prioritySelected()">
                                                <option v-for="(priorityLists, pIndex) in priorityList" v-bind:value="priorityLists.priority" v-bind:class="priorityList[pIndex].selectedClass" v-bind:disabled="priorityDisable(pIndex)">{{ priorityLists.priority }}
                                                </option>
                                            </select>
                                            <div style="padding: 3px;">
                                                <div v-for="(LSeffect, aIndex) in fesIdols[index].LiveSkill[lindex].Appeal" style="padding: 2px;">
                                                    アピール: 
                                                    <select v-model="fesIdols[index].LiveSkill[lindex].Appeal[aIndex].aID" @change="displayUpdate()">
                                                        <option v-for="liveSkillAppeals in skill_effect.liveSkillAppeal" v-bind:value="liveSkillAppeals.ID">{{ liveSkillAppeals.label }}
                                                        </option>
                                                    </select>
                                                    <span v-if="fesIdols[index].LiveSkill[lindex].Appeal[aIndex].aID != 1">
                                                        <br v-if="mobileView">属性:
                                                        <select v-model="fesIdols[index].LiveSkill[lindex].Appeal[aIndex].aAttribute">
                                                            <option value="Vo">Vo</option>
                                                            <option value="Da">Da</option>
                                                            <option value="Vi">Vi</option>
                                                            <option value="Excellent">Excellent</option>
                                                        </select>
                                                    </span>
                                                    <span v-if="fesIdols[index].LiveSkill[lindex].Appeal[aIndex].aID != 1" style="padding-left: 10px;"> N:
                                                        <input type="number" style="width: 30px;" v-model="fesIdols[index].LiveSkill[lindex].Appeal[aIndex].aValue">
                                                    </span>
                                                </div>
                                            </div>
                                            <div @click="plusLiveSkillAppeal(index, lindex)" class="btn" style="font-size: 11px;">アピールを追加</div>
                                            <div style="padding: 3px;">
                                                <div v-for="(LSeffect, lsIndex) in fesIdols[index].LiveSkill[lindex].Effect">
                                                    効果: 
                                                    <select v-model="fesIdols[index].LiveSkill[lindex].Effect[lsIndex].eID" @change="displayUpdate()">
                                                        <option v-for="liveSkillEffects in skill_effect.liveSkillEffect" v-bind:value="liveSkillEffects.ID">{{ liveSkillEffects.label }}
                                                        </option>
                                                    </select><br v-if="mobileView">
                                                    <span v-if="skill_effect.liveSkillEffect[skill_effect.findByLiveEffectID(fesIdols[index].LiveSkill[lindex].Effect[lsIndex].eID)].existM" style="padding-left: 10px;">
                                                        M: 
                                                        <input type="number" style="width: 30px;" v-model="fesIdols[index].LiveSkill[lindex].Effect[lsIndex].eTurn[1]">
                                                        <br>
                                                    </span>
                                                    <span v-if="skill_effect.liveSkillEffect[skill_effect.findByLiveEffectID(fesIdols[index].LiveSkill[lindex].Effect[lsIndex].eID)].existAttribute" style="padding-left: 10px;">
                                                        属性:
                                                        <select v-model="fesIdols[index].LiveSkill[lindex].Effect[lsIndex].eNote">
                                                            <option value="Vo">Vo</option>
                                                            <option value="Da">Da</option>
                                                            <option value="Vi">Vi</option>
                                                        </select><br v-if="mobileView">
                                                    </span>
                                                    <span v-if="fesIdols[index].LiveSkill[lindex].Effect[lsIndex].eID == 2">
                                                        :
                                                        <select v-model="fesIdols[index].LiveSkill[lindex].Effect[lsIndex].eValue">
                                                            <option v-for="idols in idol_list.duetList" v-bind:value="idols.ID">{{ idols.Name }}</option>
                                                        </select>
                                                    </span>
                                                    <span v-if="skill_effect.liveSkillEffect[skill_effect.findByLiveEffectID(fesIdols[index].LiveSkill[lindex].Effect[lsIndex].eID)].existN" style="padding-left: 10px;"> N:
                                                        <input type="number" style="width: 30px;" v-model="fesIdols[index].LiveSkill[lindex].Effect[lsIndex].eValue"><br v-if="mobileView">
                                                    </span>
                                                    <span v-if="skill_effect.liveSkillEffect[skill_effect.findByLiveEffectID(fesIdols[index].LiveSkill[lindex].Effect[lsIndex].eID)].existTurn" style="padding-left: 10px;">
                                                        <input type="number" style="width: 30px;" v-model="fesIdols[index].LiveSkill[lindex].Effect[lsIndex].eTurn[0]">
                                                        ターン<br v-if="mobileView">
                                                    </span>
                                                    <span v-if="skill_effect.liveSkillEffect[skill_effect.findByLiveEffectID(fesIdols[index].LiveSkill[lindex].Effect[lsIndex].eID)].existTime" style="padding-left: 10px;">
                                                        <input type="number" style="width: 30px;" v-model="fesIdols[index].LiveSkill[lindex].Effect[lsIndex].eTime"> 回
                                                    </span>
                                                </div>
                                            </div>
                                            <div @click="plusLiveSkillEffect(index, lindex)" class="btn" style="font-size: 11px;">スキル効果を追加</div>
                                            <div style="padding: 3px;" v-if="fesIdols[index].Idol >= 20 && fesIdols[index].Idol <= 23">
                                                Link条件: {{ idol_list.idolList[idol_list.findByIdolID(fesIdols[index].LiveSkill[lindex].LinkTrigger[0])].Name ?? "" }}
                                                <span v-for="(LT, ltindex) in fesIdols[index].LiveSkill[lindex].LinkTrigger">
                                                    <select v-if="ltindex != 0" v-model="fesIdols[index].LiveSkill[lindex].LinkTrigger[ltindex]" style="margin: 5px;" @change="displayUpdate()">
                                                        <option v-for="idols in idol_list.idolList" v-bind:value="idols.ID">{{ idols.Name }}</option>
                                                    </select>
                                                </span>
                                                <div @click="plusLinkTrigger(index, lindex)" class="btn" style="font-size: 11px;">Link条件を追加</div>
                                            </div>
                                            <div style="padding: 3px;">
                                                <div v-for="(LSeffect, laIndex) in fesIdols[index].LiveSkill[lindex].Link.lAppeal" style="padding: 2px;">
                                                    Linkアピール: 
                                                    <select v-model="fesIdols[index].LiveSkill[lindex].Link.lAppeal[laIndex].laID" @change="displayUpdate()">
                                                        <option v-for="liveSkillAppeals in skill_effect.liveSkillAppeal" v-bind:value="liveSkillAppeals.ID">{{ liveSkillAppeals.label }}
                                                        </option>
                                                    </select>
                                                    <span v-if="fesIdols[index].LiveSkill[lindex].Link.lAppeal[laIndex].laID != 1">
                                                        <br v-if="mobileView">属性:
                                                        <select v-model="fesIdols[index].LiveSkill[lindex].Link.lAppeal[laIndex].laAttribute">
                                                            <option value="Vo">Vo</option>
                                                            <option value="Da">Da</option>
                                                            <option value="Vi">Vi</option>
                                                            <option value="Excellent">Excellent</option>
                                                        </select>
                                                    </span>
                                                    <span v-if="fesIdols[index].LiveSkill[lindex].Link.lAppeal[laIndex].laID != 1" style="padding-left: 10px;"> N:
                                                        <input type="number" style="width: 30px;" v-model="fesIdols[index].LiveSkill[lindex].Link.lAppeal[laIndex].laValue">
                                                    </span>
                                                </div>
                                            </div>
                                            <div @click="plusLinkAppeal(index, lindex)" class="btn" style="font-size: 11px;">
                                                Linkアピールを追加</div>
                                            <div style="padding: 3px;">
                                                <div v-for="(LSeffect, leIndex) in fesIdols[index].LiveSkill[lindex].Link.lEffect" style="padding: 2px;">
                                                    Link効果:
                                                    <select v-model="fesIdols[index].LiveSkill[lindex].Link.lEffect[leIndex].leID" @change="displayUpdate()">
                                                        <option v-for="liveSkillEffects in skill_effect.liveSkillEffect" v-bind:value="liveSkillEffects.ID">{{ liveSkillEffects.label }}
                                                        </option>
                                                    </select><br v-if="mobileView">
                                                    <span v-if="skill_effect.liveSkillEffect[skill_effect.findByLiveEffectID(fesIdols[index].LiveSkill[lindex].Link.lEffect[leIndex].leID)].existM" style="padding-left: 10px;">
                                                        M: 
                                                        <input type="number" style="width: 30px;"
                                                            v-model="fesIdols[index].LiveSkill[lindex].Link.lEffect[leIndex].leTurn[1]">
                                                        <br>
                                                    </span>
                                                    <span v-if="skill_effect.liveSkillEffect[skill_effect.findByLiveEffectID(fesIdols[index].LiveSkill[lindex].Link.lEffect[leIndex].leID)].existAttribute" style="padding-left: 10px;">
                                                        属性:
                                                        <select v-model="fesIdols[index].LiveSkill[lindex].Link.lEffect[leIndex].leNote">
                                                            <option value="Vo">Vo</option>
                                                            <option value="Da">Da</option>
                                                            <option value="Vi">Vi</option>
                                                        </select><br v-if="mobileView">
                                                    </span>
                                                    <span v-if="fesIdols[index].LiveSkill[lindex].Link.lEffect[leIndex].leID == 2">
                                                        :
                                                        <select v-model="fesIdols[index].LiveSkill[lindex].Link.lEffect[leIndex].leValue">
                                                            <option v-for="idols in idol_list.duetList" v-bind:value="idols.ID">{{ idols.Name }}</option>
                                                        </select><br v-if="mobileView">
                                                    </span>
                                                    <span v-if="skill_effect.liveSkillEffect[skill_effect.findByLiveEffectID(fesIdols[index].LiveSkill[lindex].Link.lEffect[leIndex].leID)].existN" style="padding-left: 10px;"> N:
                                                        <input type="number" style="width: 30px;" v-model="fesIdols[index].LiveSkill[lindex].Link.lEffect[leIndex].leValue"><br v-if="mobileView">
                                                    </span>
                                                    <span v-if="skill_effect.liveSkillEffect[skill_effect.findByLiveEffectID(fesIdols[index].LiveSkill[lindex].Link.lEffect[leIndex].leID)].existTurn" style="padding-left: 10px;">
                                                        <input type="number" style="width: 30px;" v-model="fesIdols[index].LiveSkill[lindex].Link.lEffect[leIndex].leTurn[0]">
                                                        ターン<br v-if="mobileView">
                                                    </span>
                                                    <span v-if="skill_effect.liveSkillEffect[skill_effect.findByLiveEffectID(fesIdols[index].LiveSkill[lindex].Link.lEffect[leIndex].leID)].existTime" style="padding-left: 10px;">
                                                        <input type="number" style="width: 30px;" v-model="fesIdols[index].LiveSkill[lindex].Link.lEffect[leIndex].leTime"> 回
                                                    </span>
                                                </div>
                                            </div>
                                            <div @click="plusLinkEffect(index, lindex)" class="btn" style="font-size: 11px;">
                                                Link効果を追加
                                            </div>
                                        </li>
                                    </ul>
                                    <div v-if="index == 4">
                                        <p>思い出アピール</p>
                                        <ul style="padding-left: 0;">
                                            <li style="display: block;">
                                                <div style="padding: 3px;">
                                                    <div v-for="(Meffect, maIndex) in fesIdols[index].MemoryAppeal.mAppeal" style="padding: 2px;">
                                                        アピール: 
                                                        <select v-model="fesIdols[index].MemoryAppeal.mAppeal[maIndex].maID" @change="displayUpdate()">
                                                            <option v-for="liveSkillAppeals in skill_effect.liveSkillAppeal" v-bind:value="liveSkillAppeals.ID">{{ liveSkillAppeals.label }}
                                                            </option>
                                                        </select>
                                                        <span v-if="fesIdols[index].MemoryAppeal.mAppeal[maIndex].maID != 1">
                                                            <br v-if="mobileView">属性:
                                                            <select v-model="fesIdols[index].MemoryAppeal.mAppeal[maIndex].maAttribute">
                                                                <option value="Vo">Vo</option>
                                                                <option value="Da">Da</option>
                                                                <option value="Vi">Vi</option>
                                                                <option value="Excellent">Excellent</option>
                                                            </select>
                                                        </span>
                                                        <span v-if="fesIdols[index].MemoryAppeal.mAppeal[maIndex].maID != 1" style="padding-left: 10px;"> N:
                                                            <input type="number" style="width: 30px;" v-model="fesIdols[index].MemoryAppeal.mAppeal[maIndex].maValue">
                                                        </span>
                                                    </div>
                                                </div>
                                                <div @click="plusMemory('appeal')" class="btn" style="font-size: 11px;">思い出アピールを追加</div>
                                                <div style="padding: 3px;">
                                                    <div v-for="(Meffect, meIndex) in fesIdols[index].MemoryAppeal.mEffect">
                                                        効果: 
                                                        <select v-model="fesIdols[index].MemoryAppeal.mEffect[meIndex].meID" @change="displayUpdate()">
                                                            <option v-for="liveSkillEffects in skill_effect.liveSkillEffect" v-bind:value="liveSkillEffects.ID">{{ liveSkillEffects.label }}
                                                            </option>
                                                        </select><br v-if="mobileView">
                                                        <span v-if="skill_effect.liveSkillEffect[skill_effect.findByLiveEffectID(fesIdols[index].MemoryAppeal.mEffect[meIndex].meID)].existM" style="padding-left: 10px;">
                                                            M: 
                                                            <input type="number" style="width: 30px;" v-model="fesIdols[index].MemoryAppeal.mEffect[meIndex].meTurn[1]">
                                                            <br>
                                                        </span>
                                                        <span v-if="skill_effect.liveSkillEffect[skill_effect.findByLiveEffectID(fesIdols[index].MemoryAppeal.mEffect[meIndex].meID)].existAttribute" style="padding-left: 10px;">
                                                            属性:
                                                            <select v-model="fesIdols[index].MemoryAppeal.mEffect[meIndex].meNote">
                                                                <option value="Vo">Vo</option>
                                                                <option value="Da">Da</option>
                                                                <option value="Vi">Vi</option>
                                                            </select><br v-if="mobileView">
                                                        </span>
                                                        <span v-if="fesIdols[index].MemoryAppeal.mEffect[meIndex].meID == 2">
                                                            :
                                                            <select v-model="fesIdols[index].MemoryAppeal.mEffect[meIndex].meValue">
                                                                <option v-for="idols in idol_list.duetList" v-bind:value="idols.ID">{{ idols.Name }}</option>
                                                            </select>
                                                        </span>
                                                        <span v-if="skill_effect.liveSkillEffect[skill_effect.findByLiveEffectID(fesIdols[index].MemoryAppeal.mEffect[meIndex].meID)].existN" style="padding-left: 10px;"> N:
                                                            <input type="number" style="width: 30px;" v-model="fesIdols[index].MemoryAppeal.mEffect[meIndex].meValue"><br v-if="mobileView">
                                                        </span>
                                                        <span v-if="skill_effect.liveSkillEffect[skill_effect.findByLiveEffectID(fesIdols[index].MemoryAppeal.mEffect[meIndex].meID)].existTurn" style="padding-left: 10px;">
                                                            <input type="number" style="width: 30px;" v-model="fesIdols[index].MemoryAppeal.mEffect[meIndex].meTurn[0]">
                                                            ターン<br v-if="mobileView">
                                                        </span>
                                                        <span v-if="skill_effect.liveSkillEffect[skill_effect.findByLiveEffectID(fesIdols[index].MemoryAppeal.mEffect[meIndex].meID)].existTime" style="padding-left: 10px;">
                                                            <input type="number" style="width: 30px;" v-model="fesIdols[index].MemoryAppeal.mEffect[meIndex].meTime"> 回
                                                        </span>
                                                    </div>
                                                </div>
                                                <div @click="plusMemory('effect')" class="btn" style="font-size: 11px;">思い出効果を追加</div>
                                                <div style="padding: 3px;">
                                                    <div v-for="(LSeffect, mlaIndex) in fesIdols[index].MemoryAppeal.mLink.mlAppeal" style="padding: 2px;">
                                                        Linkアピール: 
                                                        <select v-model="fesIdols[index].MemoryAppeal.mLink.mlAppeal[mlaIndex].mlaID" @change="displayUpdate()">
                                                            <option v-for="liveSkillAppeals in skill_effect.liveSkillAppeal" v-bind:value="liveSkillAppeals.ID">{{ liveSkillAppeals.label }}
                                                            </option>
                                                        </select>
                                                        <span v-if="fesIdols[index].MemoryAppeal.mLink.mlAppeal[mlaIndex].mlaID != 1">
                                                            <br v-if="mobileView">属性:
                                                            <select v-model="fesIdols[index].MemoryAppeal.mLink.mlAppeal[mlaIndex].mlaAttribute">
                                                                <option value="Vo">Vo</option>
                                                                <option value="Da">Da</option>
                                                                <option value="Vi">Vi</option>
                                                                <option value="Excellent">Excellent</option>
                                                            </select>
                                                        </span>
                                                        <span v-if="fesIdols[index].MemoryAppeal.mLink.mlAppeal[mlaIndex].mlaID != 1" style="padding-left: 10px;"> N:
                                                            <input type="number" style="width: 30px;" v-model="fesIdols[index].MemoryAppeal.mLink.mlAppeal[mlaIndex].mlaValue">
                                                        </span>
                                                    </div>
                                                </div>
                                                <div @click="plusMemory('link')" class="btn" style="font-size: 11px;">
                                                    Linkアピールを追加
                                                </div>
                                            </li>
                                        </ul>
                                    </div>
                                    <p>パッシブスキル</p>
                                    <div>
                                        <ul style="padding-left: 0;">
                                            <li v-for="(ps, pasIndex) in fesIdols[index].PassiveIndex" style="border-radius: 5px; margin: 2px; padding: 2px;" v-bind:class="passiveClass(index, pasIndex)">
                                                <select v-model="fesIdols[index].PassiveIndex[pasIndex].index" @change="displayUpdate()">
                                                    <option v-for="(passive, aIndex) in passiveSkills" v-bind:class="passive.Color" v-bind:value="aIndex">【{{ passive.Name }}】{{ passive.Attribute }} {{ passive.Value }}%up</option>
                                                </select>
                                                <div class="btn" style="font-size: 12px; padding: 1px 10px;" @click="unsetPassive(index, pasIndex)">削除</div>
                                            </li>
                                        </ul>
                                        <div @click="setPassive(index)" class="btn" style="font-size: 11px; margin-top: 5px;">パッシブスキルを追加</div>
                                    </div>
                                </div>
                            </li>
                        </ul>
                    </div>
                </section>
            </li>
            <li>
                <section>
                    <h2 v-bind:class="detailSettingClass" @click="toggleAccBtn('detailSetting', displayDetailSetting)">
                        その他の設定</h2>
                    <div class="accBox" v-if="displayDetailSetting">
                        <ul>
                            <li>
                                <div>
                                    <label for="damage">審査員ダメージ（影響力）</label>
                                    <input type="number" id="damage" v-model="detailSetting.damage">
                                </div>
                            </li>
                            <li>
                                <div>
                                    <label for="damageStrong">打たれ強いを取得した人数</label>
                                    <input type="number" id="damageStrong" v-model="detailSetting.damageStrong" max="5">
                                </div>
                            </li>
                            <li>
                                <div>
                                    <label for="damageWeak">打たれ弱いを取得した人数</label>
                                    <input type="number" id="damageWeak" v-model="detailSetting.damageWeak" max="5">
                                </div>
                            </li>
                            <li>
                                <div>
                                    <label for="">思い出(ノウハウ)++ を取得した人数</label>
                                    <input type="number" id="omonouDPlus" v-model="detailSetting.omonouDPlus" max="5">
                                </div>
                            </li>
                            <li>
                                <div>
                                    <label for="">思い出(ノウハウ)+ を取得した人数</label>
                                    <input type="number" id="omonouPlus" v-model="detailSetting.omonouPlus" max="5">
                                </div>
                            </li>
                            <li>
                                <div>
                                    <label for="">思い出増加量 +2% を取得した人数</label>
                                    <input type="number" id="omonoukakin" v-model="detailSetting.omonoukakin" max="5">
                                </div>
                            </li>
                            <li>
                                <div>
                                    <label for="">注目の的 を取得した人数</label>
                                    <input type="number" id="centerOfAttention" v-model="detailSetting.centerOfAttention" max="5">
                                </div>
                            </li>
                            <li>
                                <div>
                                    <label for="">ひかえめ を取得した人数</label>
                                    <input type="number" id="noAttention" v-model="detailSetting.noAttention" max="5">
                                </div>
                            </li>
                            <li>
                                <div>
                                    <label for="count">試行回数</label>
                                    <input type="number" id="count" v-model="detailSetting.count" max="15">,000 回
                                </div>
                            </li>
                            <li>
                                <div>
                                    <label style="user-select: none;">
                                        <input type="checkbox" v-model="detailSetting.liveSkillRandom"> ライブスキルをランダムに選ぶ
                                    </label>
                                </div>
                            </li>
                        </ul>
                    </div>
                </section>
            </li>
        </ul>
        <div v-if="!mobileView" style="display: flex; padding-left: 40px;justify-content: space-between;">
            <div style="display: flex;;">
                <div id="outputBtn" class="bigBtn" @click="outputSetting()">設定を出力</div>
                <div id="inputBtn" class="bigBtn" @click="openFile()">設定を入力</div>
            </div>
            <div id="nextBtn" class="bigBtn" @click="simulationOpen()">次へ</div>
        </div>
        <input type="file" id="inputFile" style="display: none;" @change="inputSetting">
        <Simulation ref="simulationReady"></Simulation>
        <div v-if="displayUpdateData">
            <!-- displayUpdate() の為の空要素 -->
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import * as passive_trigger from '../logic/data/passiveTrigger'
import * as skill_effect from '../logic/data/skillEffect'
import * as idol_list from '../logic/data/idolList'
import * as vault from '../logic/event/vault'
import * as types from '../logic/data/type'
import Help from './help.vue'
import Simulation from './simulation.vue'
import Header from './header.vue'

// localStorage から読み込み
const loadLocalStorage = () => {
    if ('GradeFes' in localStorage) {
        const data = JSON.parse(localStorage.getItem('GradeFes') as string)
        setData(data)
    } else {
        console.log('localStrage is null')
    }
}

// データの読み込み
const setData = (data: {
    passive: types.passive[],
    fesIdol: types.fesIdol[],
    detail: types.detail
}) => {
    // パッシブ
    passiveSkills = []
    for (let i = 0; i < data.passive.length; i++) {
        let newPassive: types.passive = {
            Name: data.passive[i].Name ?? ref("").value,
            Attribute: data.passive[i].Attribute ?? ref("").value,
            Value: data.passive[i].Value ?? ref().value,
            Color: data.passive[i].Color ?? "white",
            Gold: data.passive[i].Gold ?? ref(false).value,
            Trigger: {
                tID: data.passive[i].Trigger.tID ?? ref(1).value,
                tX: data.passive[i].Trigger.tX ?? ref().value,
                tHis: data.passive[i].Trigger.tHis ?? [ref().value]
            },
            ActiveTurn: {
                after: data.passive[i].ActiveTurn.after ?? ref(1).value,
                before: data.passive[i].ActiveTurn.before ?? ref(vault.maxTurn).value
            },
            Probability: data.passive[i].Probability ?? ref().value,
            Times: data.passive[i].Times ?? ref().value,
            Effect: data.passive[i].Effect ?? [
                {
                    eID: ref(1).value,
                    eValue: ref().value
                }
            ]
        }
        for (let j = 0; j < data.passive[i].Effect.length; j++) {
            if (typeof newPassive.Effect[j].eID !== "number") {
                newPassive.Effect[j].eID = ref(1).value
            }
            if (typeof newPassive.Effect[j].eValue !== "number") {
                newPassive.Effect[j].eValue = ref().value
            }
        }
        passiveSkills.push(newPassive);
    }
    // 編成
    fesIdols = []
    for (let i = 0; i < 5; i++) {
        let newFesIdol: types.fesIdol = {
            Idol: data.fesIdol[i].Idol ?? ref().value,
            Position: data.fesIdol[i].Position ?? positionList[i],
            MemorieLevel: data.fesIdol[i].MemorieLevel ?? ref().value,
            Status: {
                VoValue: data.fesIdol[i].Status.VoValue ?? ref().value,
                DaValue: data.fesIdol[i].Status.DaValue ?? ref().value,
                ViValue: data.fesIdol[i].Status.ViValue ?? ref().value,
                MeValue: data.fesIdol[i].Status.MeValue ?? ref().value
            },
            LiveSkill: [
                {
                    Priority: data.fesIdol[i].LiveSkill[0].Priority ?? ref().value,
                    Appeal: data.fesIdol[i].LiveSkill[0].Appeal ?? [{
                        aID: ref(1).value,
                        aValue: ref().value,
                        aAttribute: ref().value
                    }],
                    Effect: data.fesIdol[i].LiveSkill[0].Effect ?? [{
                        eID: ref(1).value,
                        eValue: ref().value,
                        eTurn: [ref().value, ref().value],
                        eTime: ref().value,
                        eNote: ref().value
                    }],
                    Link: {
                        lAppeal: data.fesIdol[i].LiveSkill[0].Link.lAppeal ?? [{
                            laID: ref(1).value,
                            laValue: ref().value,
                            laAttribute: ref().value
                        }],
                        lEffect: data.fesIdol[i].LiveSkill[0].Link.lEffect ?? [{
                            leID: ref(1).value,
                            leValue: ref().value,
                            leTurn: [ref().value, ref().value],
                            leTime: ref().value,
                            leNote: ref().value
                        }],
                    },
                    LinkTrigger: data.fesIdol[i].LiveSkill[0].LinkTrigger ?? [ref().value]
                },
                {
                    Priority: data.fesIdol[i].LiveSkill[1].Priority ?? ref().value,
                    Appeal: data.fesIdol[i].LiveSkill[1].Appeal ?? [{
                        aID: ref(1).value,
                        aValue: ref().value,
                        aAttribute: ref().value
                    }],
                    Effect: data.fesIdol[i].LiveSkill[1].Effect ?? [{
                        eID: ref(1).value,
                        eValue: ref().value,
                        eTurn: [ref().value, ref().value],
                        eTime: ref().value,
                        eNote: ref().value
                    }],
                    Link: {
                        lAppeal: data.fesIdol[i].LiveSkill[1].Link.lAppeal ?? [{
                            laID: ref(1).value,
                            laValue: ref().value,
                            laAttribute: ref().value
                        }],
                        lEffect: data.fesIdol[i].LiveSkill[1].Link.lEffect ?? [{
                            leID: ref(1).value,
                            leValue: ref().value,
                            leTurn: [ref().value, ref().value],
                            leTime: ref().value,
                            leNote: ref().value
                        }],
                    },
                    LinkTrigger: data.fesIdol[i].LiveSkill[0].LinkTrigger ?? [ref().value]
                }
            ],
            PassiveIndex: data.fesIdol[i].PassiveIndex ?? [],
            MemoryAppeal: data.fesIdol[i].MemoryAppeal ?? {
                mAppeal: [{
                    maID: ref(1).value,
                    maValue: ref().value,
                    maAttribute: ref().value
                }],
                mEffect: [{
                    meID: ref().value,
                    meValue: ref().value,
                    meTurn: [ref().value, ref().value],
                    meTime: ref().value,
                    meNote: ref().value
                }],
                mLink: {
                    mlAppeal: [{
                        mlaID: ref(1).value,
                        mlaValue: ref().value,
                        mlaAttribute: ref().value
                    }]
                }
            }
        }
        for (let j = 0; j < newFesIdol.LiveSkill[0].Appeal.length; j++) {
            if (typeof newFesIdol.LiveSkill[0].Appeal[j].aID !== "number") {
                newFesIdol.LiveSkill[0].Appeal[j].aID = ref(1).value
            }
            if (typeof newFesIdol.LiveSkill[0].Appeal[j].aValue !== "number") {
                newFesIdol.LiveSkill[0].Appeal[j].aValue = ref().value
            }
            if (typeof newFesIdol.LiveSkill[0].Appeal[j].aAttribute !== "string") {
                newFesIdol.LiveSkill[0].Appeal[j].aAttribute = ref().value
            }
        }
        for (let j = 0; j < newFesIdol.LiveSkill[0].Effect.length; j++) {
            if (typeof newFesIdol.LiveSkill[0].Effect[j].eID !== "number") {
                newFesIdol.LiveSkill[0].Effect[j].eID = ref(1).value
            }
            try {
                if (typeof newFesIdol.LiveSkill[0].Effect[j].eTurn[0] !== "number" && typeof newFesIdol.LiveSkill[0].Effect[j].eTurn[1] !== "number") {
                    newFesIdol.LiveSkill[0].Effect[j].eTurn = [ref().value, ref().value]
                }
            }catch (error) {
                newFesIdol.LiveSkill[0].Effect[j].eTurn = [ref().value, ref().value]
            }
            if (typeof newFesIdol.LiveSkill[0].Effect[j].eTime !== "number") {
                newFesIdol.LiveSkill[0].Effect[j].eTime = ref().value
            }
            if (typeof newFesIdol.LiveSkill[0].Effect[j].eValue !== "number") {
                newFesIdol.LiveSkill[0].Effect[j].eValue = ref().value
            }
            if (typeof newFesIdol.LiveSkill[0].Effect[j].eNote !== "string") {
                newFesIdol.LiveSkill[0].Effect[j].eNote = ref().value
            }
        }
        for (let j = 0; j < newFesIdol.LiveSkill[0].Link.lAppeal.length; j++) {
            if (typeof newFesIdol.LiveSkill[0].Link.lAppeal[j].laID !== "number") {
                newFesIdol.LiveSkill[0].Link.lAppeal[j].laID = ref(1).value
            }
            if (typeof newFesIdol.LiveSkill[0].Link.lAppeal[j].laValue !== "number") {
                newFesIdol.LiveSkill[0].Link.lAppeal[j].laValue = ref().value
            }
            if (typeof newFesIdol.LiveSkill[0].Link.lAppeal[j].laAttribute !== "string") {
                newFesIdol.LiveSkill[0].Link.lAppeal[j].laAttribute = ref().value
            }
        }
        for (let j = 0; j < newFesIdol.LiveSkill[0].Link.lEffect.length; j++) {
            if (typeof newFesIdol.LiveSkill[0].Link.lEffect[j].leID !== "number") {
                newFesIdol.LiveSkill[0].Link.lEffect[j].leID = ref(1).value
            }
            try {
                if (typeof newFesIdol.LiveSkill[0].Link.lEffect[j].leTurn[0] !== "number" && typeof newFesIdol.LiveSkill[0].Link.lEffect[j].leTurn[1] !== "number") {
                    newFesIdol.LiveSkill[0].Link.lEffect[j].leTurn = [ref().value, ref().value]
                }
            } catch (error) {
                newFesIdol.LiveSkill[0].Link.lEffect[j].leTurn = [ref().value, ref().value]
            }
            if (typeof newFesIdol.LiveSkill[0].Link.lEffect[j].leTime !== "number") {
                newFesIdol.LiveSkill[0].Link.lEffect[j].leTime = ref().value
            }
            if (typeof newFesIdol.LiveSkill[0].Link.lEffect[j].leValue !== "number") {
                newFesIdol.LiveSkill[0].Link.lEffect[j].leValue = ref().value
            }
            if (typeof newFesIdol.LiveSkill[0].Link.lEffect[j].leNote !== "string") {
                newFesIdol.LiveSkill[0].Link.lEffect[j].leNote = ref().value
            }
        }
        for (let j = 0; j < newFesIdol.LiveSkill[0].LinkTrigger.length; j++) {
            if (typeof newFesIdol.LiveSkill[0].LinkTrigger[j] !== "number") {
                newFesIdol.LiveSkill[0].LinkTrigger[j] = ref().value
            }
        }
        for (let j = 0; j < newFesIdol.LiveSkill[1].Appeal.length; j++) {
            if (typeof newFesIdol.LiveSkill[1].Appeal[j].aID !== "number") {
                newFesIdol.LiveSkill[1].Appeal[j].aID = ref(1).value
            }
            if (typeof newFesIdol.LiveSkill[1].Appeal[j].aValue !== "number") {
                newFesIdol.LiveSkill[1].Appeal[j].aValue = ref().value
            }
            if (typeof newFesIdol.LiveSkill[1].Appeal[j].aAttribute !== "string") {
                newFesIdol.LiveSkill[1].Appeal[j].aAttribute = ref().value
            }
        }
        for (let j = 0; j < newFesIdol.LiveSkill[1].Effect.length; j++) {
            if (typeof newFesIdol.LiveSkill[1].Effect[j].eID !== "number") {
                newFesIdol.LiveSkill[1].Effect[j].eID = ref(1).value
            }
            try {
                if (typeof newFesIdol.LiveSkill[1].Effect[j].eTurn[0] !== "number" && typeof newFesIdol.LiveSkill[1].Effect[j].eTurn[1] !== "number") {
                    newFesIdol.LiveSkill[1].Effect[j].eTurn = [ref().value, ref().value]
                }
            } catch (error) {
                    newFesIdol.LiveSkill[1].Effect[j].eTurn = [ref().value, ref().value]
            }
            if (typeof newFesIdol.LiveSkill[1].Effect[j].eTime !== "number") {
                newFesIdol.LiveSkill[1].Effect[j].eTime = ref().value
            }
            if (typeof newFesIdol.LiveSkill[1].Effect[j].eValue !== "number") {
                newFesIdol.LiveSkill[1].Effect[j].eValue = ref().value
            }
            if (typeof newFesIdol.LiveSkill[1].Effect[j].eNote !== "string") {
                newFesIdol.LiveSkill[1].Effect[j].eNote = ref().value
            }
        }
        for (let j = 0; j < newFesIdol.LiveSkill[1].Link.lAppeal.length; j++) {
            if (typeof newFesIdol.LiveSkill[1].Link.lAppeal[j].laID !== "number") {
                newFesIdol.LiveSkill[1].Link.lAppeal[j].laID = ref(1).value
            }
            if (typeof newFesIdol.LiveSkill[1].Link.lAppeal[j].laValue !== "number") {
                newFesIdol.LiveSkill[1].Link.lAppeal[j].laValue = ref().value
            }
            if (typeof newFesIdol.LiveSkill[1].Link.lAppeal[j].laAttribute !== "string") {
                newFesIdol.LiveSkill[1].Link.lAppeal[j].laAttribute = ref().value
            }
        }
        for (let j = 0; j < newFesIdol.LiveSkill[1].Link.lEffect.length; j++) {
            if (typeof newFesIdol.LiveSkill[1].Link.lEffect[j].leID !== "number") {
                newFesIdol.LiveSkill[1].Link.lEffect[j].leID = ref(1).value
            }
            try {
                if (typeof newFesIdol.LiveSkill[1].Link.lEffect[j].leTurn[0] !== "number" && typeof newFesIdol.LiveSkill[1].Link.lEffect[j].leTurn[1] !== "number") {
                    newFesIdol.LiveSkill[1].Link.lEffect[j].leTurn = [ref().value, ref().value]
                }
            } catch (error) {
                newFesIdol.LiveSkill[1].Link.lEffect[j].leTurn = [ref().value, ref().value]
            }
            if (typeof newFesIdol.LiveSkill[1].Link.lEffect[j].leTime !== "number") {
                newFesIdol.LiveSkill[1].Link.lEffect[j].leTime = ref().value
            }
            if (typeof newFesIdol.LiveSkill[1].Link.lEffect[j].leValue !== "number") {
                newFesIdol.LiveSkill[1].Link.lEffect[j].leValue = ref().value
            }
            if (typeof newFesIdol.LiveSkill[1].Link.lEffect[j].leNote !== "string") {
                newFesIdol.LiveSkill[1].Link.lEffect[j].leNote = ref().value
            }
        }
        for (let j = 0; j < newFesIdol.LiveSkill[1].LinkTrigger.length; j++) {
            if (typeof newFesIdol.LiveSkill[1].LinkTrigger[j] !== "number") {
                newFesIdol.LiveSkill[1].LinkTrigger[j] = ref().value
            }
        }
        for(let j = 0; j < newFesIdol.PassiveIndex.length; j++) {
            if (typeof newFesIdol.PassiveIndex[j].index !== "number") {
                newFesIdol.PassiveIndex[j] = {
                    index: ref(0).value,
                    times: ref().value
                }
            }
        }
        for(let j = 0; j < newFesIdol.MemoryAppeal.mAppeal.length; j++) {
            if (typeof newFesIdol.MemoryAppeal.mAppeal[j].maID !== "number") {
                newFesIdol.MemoryAppeal.mAppeal[j].maID = ref(1).value
            }
            if (typeof newFesIdol.MemoryAppeal.mAppeal[j].maValue !== "number") {
                newFesIdol.MemoryAppeal.mAppeal[j].maValue = ref().value
            }
            if (typeof newFesIdol.MemoryAppeal.mAppeal[j].maAttribute !== "string") {
                newFesIdol.MemoryAppeal.mAppeal[j].maAttribute = ref().value
            }
        }
        for(let j = 0; j < newFesIdol.MemoryAppeal.mEffect.length; j++) {
            if (typeof newFesIdol.MemoryAppeal.mEffect[j].meID !== "number") {
                newFesIdol.MemoryAppeal.mEffect[j].meID = ref(1).value
            }
            try {
                if (typeof newFesIdol.MemoryAppeal.mEffect[j].meTurn[0] !== "number" && typeof newFesIdol.MemoryAppeal.mEffect[j].meTurn[1] !== "number") {
                    newFesIdol.MemoryAppeal.mEffect[j].meTurn = [ref().value, ref().value]
                }
            }catch (error) {
                newFesIdol.MemoryAppeal.mEffect[j].meTurn = [ref().value, ref().value]
            }
            if (typeof newFesIdol.MemoryAppeal.mEffect[j].meTime !== "number") {
                newFesIdol.MemoryAppeal.mEffect[j].meTime = ref().value
            }
            if (typeof newFesIdol.MemoryAppeal.mEffect[j].meValue !== "number") {
                newFesIdol.MemoryAppeal.mEffect[j].meValue = ref().value
            }
            if (typeof newFesIdol.MemoryAppeal.mEffect[j].meNote !== "string") {
                newFesIdol.MemoryAppeal.mEffect[j].meNote = ref().value
            }
        }
        for(let j = 0; j < newFesIdol.MemoryAppeal.mLink.mlAppeal.length; j++) {
            if (typeof newFesIdol.MemoryAppeal.mLink.mlAppeal[j].mlaID !== "number") {
                newFesIdol.MemoryAppeal.mLink.mlAppeal[j].mlaID = ref(1).value
            }
            if (typeof newFesIdol.MemoryAppeal.mLink.mlAppeal[j].mlaValue !== "number") {
                newFesIdol.MemoryAppeal.mLink.mlAppeal[j].mlaValue = ref().value
            }
            if (typeof newFesIdol.MemoryAppeal.mLink.mlAppeal[j].mlaAttribute !== "string") {
                newFesIdol.MemoryAppeal.mLink.mlAppeal[j].mlaAttribute = ref().value
            }
        }
        fesIdols.push(newFesIdol)
    }
    // 詳細設定
    detailSetting = {
        damage: data.detail.damage ?? ref(231).value,
        damageStrong: data.detail.damageStrong ?? ref(0).value,
        damageWeak: data.detail.damageWeak ?? ref(0).value,
        count: data.detail.count ?? ref(1).value,
        omonouDPlus: data.detail.omonouDPlus ?? ref(0).value,
        omonouPlus: data.detail.omonouPlus ?? ref(0).value,
        omonoukakin: data.detail.omonoukakin ?? ref(0).value,
        centerOfAttention: data.detail.centerOfAttention ?? ref(0).value,
        noAttention: data.detail.noAttention ?? ref(0).value,
        liveSkillRandom: data.detail.liveSkillRandom ?? ref(false).value
    }
}

// localStorage へ保存
const setLocalStorage = () => {
    const setData = makeJson();
    localStorage.setItem('GradeFes', setData)
    window.alert("保存しました。")
}

// JSONへ変換
const makeJson = () => {
    // パッシブ不要部の削除
    for(let i = 0; i < passiveSkills.length; i ++) {
        for(let j = 0; j < passiveSkills[i].Effect.length; j++) {
            if(passiveSkills[i].Effect[j].eID == 1) {
                passiveSkills[i].Effect.splice(j,1)
            }
        }
    }
    // 編成不要部の削除
    for(let i = 0; i < 5; i ++) {
        for(let j = 0; j < fesIdols[i].LiveSkill.length; j++) {
            for(let n = 0; n < fesIdols[i].LiveSkill[j].Appeal.length; n++) {
                if(fesIdols[i].LiveSkill[j].Appeal[n].aID == 1) {
                    fesIdols[i].LiveSkill[j].Appeal.splice(n,1)
                }
            }
            for(let n = 0; n < fesIdols[i].LiveSkill[j].Effect.length; n++) {
                if(fesIdols[i].LiveSkill[j].Effect[n].eID == 1) {
                    fesIdols[i].LiveSkill[j].Effect.splice(n,1)
                }
            }
            for(let n = 0; n < fesIdols[i].LiveSkill[j].Link.lAppeal.length; n++) {
                if(fesIdols[i].LiveSkill[j].Link.lAppeal[n].laID == 1) {
                    fesIdols[i].LiveSkill[j].Link.lAppeal.splice(n,1)
                }
            }
            for(let n = 0; n < fesIdols[i].LiveSkill[j].Link.lEffect.length; n++) {
                if(fesIdols[i].LiveSkill[j].Link.lEffect[n].leID == 1) {
                    fesIdols[i].LiveSkill[j].Link.lEffect.splice(n,1)
                }
            }
            // memory
            for(let n = 0; n < fesIdols[i].MemoryAppeal.mAppeal.length; n++) {
                if(fesIdols[i].MemoryAppeal.mAppeal[n].maID == 1) {
                    fesIdols[i].MemoryAppeal.mAppeal.splice(n,1)
                }
            }
            for(let n = 0; n < fesIdols[i].MemoryAppeal.mEffect.length; n++) {
                if(fesIdols[i].MemoryAppeal.mEffect[n].meID == 1) {
                    fesIdols[i].MemoryAppeal.mEffect.splice(n,1)
                }
            }
            for(let n = 0; n < fesIdols[i].MemoryAppeal.mLink.mlAppeal.length; n++) {
                if(fesIdols[i].MemoryAppeal.mLink.mlAppeal[n].mlaID == 1) {
                    fesIdols[i].MemoryAppeal.mLink.mlAppeal.splice(n,1)
                }
            }

        }
    }
    const data = {
        passive: passiveSkills,
        fesIdol: fesIdols,
        detail: detailSetting
    }
    return JSON.stringify(data);
}

// パッシブスキルの入力画面
const passiveSettingClass = ref("accBtn close")
const displayPassiveSetting = ref(true)

// 編成の入力画面
const formationSettingClass = ref("accBtn close")
const displayFormationSetting = ref(true)

// その他の設定画面
const detailSettingClass = ref("accBtn close")
const displayDetailSetting = ref(true)

// アコーディオンエリアのトグルスイッチ
const toggleAccBtn = (eleClass: string, isBoxDisplay: boolean) => {
    if (eleClass == "passiveSetting") {
        if (isBoxDisplay) {
            passiveSettingClass.value = "accBtn";
            displayPassiveSetting.value = false;
        } else {
            passiveSettingClass.value = "accBtn close";
            displayPassiveSetting.value = true;
        }
    } else if (eleClass == "formationSetting") {
        if (isBoxDisplay) {
            formationSettingClass.value = "accBtn";
            displayFormationSetting.value = false;
        } else {
            formationSettingClass.value = "accBtn close";
            displayFormationSetting.value = true;
        }
    } else if (eleClass == "detailSetting") {
        if (isBoxDisplay) {
            detailSettingClass.value = "accBtn";
            displayDetailSetting.value = false;
        } else {
            detailSettingClass.value = "accBtn close";
            displayDetailSetting.value = true;
        }
    }

}

// 追加要素の反映
const displayUpdateData = ref(false);
const displayUpdate = () => {
    displayUpdateData.value = false;
    displayUpdateData.value = true;
}

/**
 * パッシブスキル入力エリア
 * @param Name パッシブ名
 * @param Attribute パッシブの属性
 * @param Value パッシブ倍率
 * @param Color パッシブの色 白|金|虹
 * @param Gold 金パッシブ化
 * @param Trigger.tID 発動条件ID
 * @param Trigger.tX 発動条件の変数
 * @param ActiveTurn.after 発動ターン：以前
 * @param ActiveTurn.before 発動ターン：以降
 * @param Probability 発動確率
 * @param Effect.eID パッシブ効果ID
 * @param Effect.eValue パッシブ効果量
 */
let passiveSkills: types.passive[] = [];

const passiveColorCheck = (index: number, gold: boolean) => {
    if (passiveSkills[index].Value >= 75 || gold) {
        if (passiveSkills[index].Value >= 180 && !gold) {
            passiveSkills[index].Color = "rainbow";
        } else {
            passiveSkills[index].Color = "gold";
        }
    } else {
        passiveSkills[index].Color = "white";
    }
    displayUpdate();
}

// パッシブ追加ボタン
const plusPassive = () => {
    const newPassive: types.passive = {
        Name: ref("").value,
        Attribute: ref("").value,
        Value: ref().value,
        Color: "white",
        Gold: ref(false).value,
        Trigger: {
            tID: ref(1).value,
            tX: ref().value,
            tHis: [ref().value]
        },
        ActiveTurn: {
            after: ref(1).value,
            before: ref(vault.maxTurn).value
        },
        Probability: ref().value,
        Times: ref().value,
        Effect: [
            {
                eID: ref(1).value,
                eValue: ref().value
            }
        ]
    }
    passiveSkills.push(newPassive);
    displayUpdate();
}
plusPassive();

// パッシブ削除ボタン
const deletePassive = (index: number) => {
    passiveSkills.splice(index, 1);
    for (let i = 0; i < fesIdols.length; i++) {
        for (let j = 0; j < fesIdols[i].PassiveIndex.length; j++) {
            if (fesIdols[i].PassiveIndex[j].index == index) {
                fesIdols[i].PassiveIndex.splice(j, 1);
                j--
            } else if (fesIdols[i].PassiveIndex[j].index > index) {
                fesIdols[i].PassiveIndex[j].index--;
            }
        }
    }
    displayUpdate();
}

// 金パッシブラベルID発行
const goldID = (index: number) => {
    return "gold" + index;
}

// 履歴追加ボタン
const plusHistory = (index: number) => {
    passiveSkills[index].Trigger.tHis.push(
        ref().value
    );
    displayUpdate();
}

// 履歴クリア
const clearHistry = (index: number) => {
    passiveSkills[index].Trigger.tHis = [
        ref().value
    ];
    displayUpdate();
}

// スキル効果の追加ボタン
const plusEffect = (index: number) => {
    passiveSkills[index].Effect.push({
        eID: ref(1).value,
        eValue: ref(0).value
    });
    displayUpdate();
}

// 編成
let fesIdols: types.fesIdol[] = [];

const positionList = ["Leader", "Vocal", "Dance", "Visual", "Center"]
const setIdolList = () => {
    for (let i = 0; i < 5; i++) {
        fesIdols.push({
            Idol: ref().value,
            Position: positionList[i],
            MemorieLevel: ref().value,
            Status: {
                VoValue: ref().value,
                DaValue: ref().value,
                ViValue: ref().value,
                MeValue: ref().value
            },
            LiveSkill: [
                {
                    Priority: ref().value,
                    Appeal: [{
                        aID: ref(1).value,
                        aValue: ref().value,
                        aAttribute: ref().value
                    }],
                    Effect: [{
                        eID: ref(1).value,
                        eValue: ref().value,
                        eTurn: [ref().value, ref().value],
                        eTime: ref().value,
                        eNote: ref().value
                    }],
                    Link: {
                        lAppeal: [{
                            laID: ref(1).value,
                            laValue: ref().value,
                            laAttribute: ref().value
                        }],
                        lEffect: [{
                            leID: ref(1).value,
                            leValue: ref().value,
                            leTurn: [ref().value, ref().value],
                            leTime: ref().value,
                            leNote: ref().value
                        }]
                    },
                    LinkTrigger: [ref().value]
                },
                {
                    Priority: ref().value,
                    Appeal: [{
                        aID: ref(1).value,
                        aValue: ref().value,
                        aAttribute: ref().value
                    }],
                    Effect: [{
                        eID: ref(1).value,
                        eValue: ref().value,
                        eTurn: [ref().value, ref().value],
                        eTime: ref().value,
                        eNote: ref().value
                    }],
                    Link: {
                        lAppeal: [{
                            laID: ref(1).value,
                            laValue: ref().value,
                            laAttribute: ref().value
                        }],
                        lEffect: [{
                            leID: ref(1).value,
                            leValue: ref().value,
                            leTurn: [ref().value, ref().value],
                            leTime: ref().value,
                            leNote: ref().value
                        }]
                    },
                    LinkTrigger: [ref().value]
                }
            ],
            PassiveIndex: [{
                index: ref(0).value,
                times: ref().value
            }],
            MemoryAppeal: {
                mAppeal: [{
                    maID: ref(1).value,
                    maValue: ref().value,
                    maAttribute: ref().value
                }],
                mEffect: [{
                    meID: ref(1).value,
                    meValue: ref().value,
                    meTurn: [ref().value, ref().value],
                    meTime: ref().value,
                    meNote: ref().value
                }],
                mLink: {
                    mlAppeal: [{
                        mlaID: ref(1).value,
                        mlaValue: ref().value,
                        mlaAttribute: ref().value
                    }]
                }
            }
        })
    }
}
setIdolList();

// ライブスキル優先度
const priorityList: [{
    priority: number,
    selectedClass: "" | "selected" // @ts-ignore
}] = [{}]
const setPriorityList = () => {
    for (let i = 1; i < 11; i++) {
        priorityList.push({
            priority: i,
            selectedClass: ""
        })
    }
}
setPriorityList()

const prioritySelected = () => {
    for (let select = 0; select < priorityList.length; select++) {
        priorityList[select].selectedClass = ""
    }
    for (let i = 0; i < fesIdols.length; i++) {
        for (let j = 0; j < 2; j++) {
            if (fesIdols[i].LiveSkill[j].Priority) {
                priorityList[fesIdols[i].LiveSkill[j].Priority].selectedClass = "selected"
            }
        }
    }
    displayUpdate()
}

const priorityDisable = (index: number) => {
    return priorityList[index].selectedClass == "selected"
}

// アピール追加ボタン
const plusLiveSkillAppeal = (index: number, appealIndex: number) => {
    fesIdols[index].LiveSkill[appealIndex].Appeal.push({
        aID: ref(1).value,
        aValue: ref().value,
        aAttribute: ref().value
    })
    displayUpdate()
}

// ライブスキル効果追加ボタン
const plusLiveSkillEffect = (index: number, effectIndex: number) => {
    fesIdols[index].LiveSkill[effectIndex].Effect.push({
        eID: ref(1).value,
        eValue: ref().value,
        eTurn: [ref().value, ref().value],
        eTime: ref().value,
        eNote: ref().value
    })
    displayUpdate()
}

// Link条件
const setLinkTrigger = (index:number) => {
    fesIdols[index].LiveSkill[0].LinkTrigger.length = 0;
    fesIdols[index].LiveSkill[1].LinkTrigger.length = 0;
    fesIdols[index].LiveSkill[0].LinkTrigger.push(ref(fesIdols[index].Idol).value);
    fesIdols[index].LiveSkill[0].LinkTrigger.push(ref().value);
    fesIdols[index].LiveSkill[1].LinkTrigger.push(ref(fesIdols[index].Idol).value);
    fesIdols[index].LiveSkill[1].LinkTrigger.push(ref().value);
    displayUpdate();
}

// Link条件追加ボタン
const plusLinkTrigger = (index:number, linkIndex:number) => {
    fesIdols[index].LiveSkill[linkIndex].LinkTrigger.push(ref().value);
    displayUpdate();
}

// Linkアピール追加ボタン
const plusLinkAppeal = (index: number, linkIndex: number) => {
    fesIdols[index].LiveSkill[linkIndex].Link.lAppeal.push({
        laID: ref(1).value,
        laValue: ref().value,
        laAttribute: ref().value
    })
    displayUpdate()
}
// Link効果追加ボタン
const plusLinkEffect = (index: number, linkIndex: number) => {
    fesIdols[index].LiveSkill[linkIndex].Link.lEffect.push({
        leID: ref(1).value,
        leValue: ref().value,
        leTurn: [ref().value, ref().value],
        leTime: ref().value,
        leNote: ref().value
    })
    displayUpdate()
}

const plusMemory = (plusType:'appeal' | 'effect' | 'link') => {
    if(plusType == 'appeal') {
        fesIdols[4].MemoryAppeal.mAppeal.push({
            maID: ref(1).value,
            maValue: ref(0).value,
            maAttribute: ref().value
        })
    }else if(plusType == 'effect') {
        fesIdols[4].MemoryAppeal.mEffect.push({
            meID: ref(1).value,
            meValue: ref(0).value,
            meTime: ref().value,
            meTurn: [ref().value, ref().value],
            meNote: ref().value
        })
    }else if(plusType == 'link') {
        fesIdols[4].MemoryAppeal.mLink.mlAppeal.push({
            mlaID: ref(1).value,
            mlaValue: ref(0).value,
            mlaAttribute: ref().value
        })
    }
    displayUpdate();
}

// パッシブスキルの追加ボタン
const setPassive = (index: number) => {
    fesIdols[index].PassiveIndex.push({
        index: ref(0).value,
        times: ref().value
    })
    displayUpdate();
}

// パッシブスキル削除ボタン
const unsetPassive = (index: number, deleteIndex: number) => {
    fesIdols[index].PassiveIndex.splice(deleteIndex, 1)
    displayUpdate();
}

// パッシブのクラス
const passiveClass = (index: number, pasIndex: number) => {
    if (passiveSkills[fesIdols[index].PassiveIndex[pasIndex].index]) {
        return passiveSkills[fesIdols[index].PassiveIndex[pasIndex].index].Color
    } else {
        console.log(passiveSkills[fesIdols[index].PassiveIndex[pasIndex].index])
        return "white"
    }
}

// その他の設定
let detailSetting: types.detail = {
    // 審査員ダメージ
    damage: ref(231).value,
    // 打たれ強い
    damageStrong: ref(0).value,
    // 打たれ弱い
    damageWeak: ref(0).value,
    // 試行回数
    count: ref(1).value,
    // 思い出++
    omonouDPlus: ref(0).value,
    // 思い出+
    omonouPlus: ref(0).value,
    // 思い出増加+2%
    omonoukakin: ref(0).value,
    // 注目の的
    centerOfAttention: ref(0).value,
    // ひかえめ
    noAttention: ref(0).value,
    // ライブスキルのランダム
    liveSkillRandom: ref(false).value
}

// 設定の出力
const outputSetting = () => {
    let blob = new Blob([makeJson()], { type: "text/plan" });
    let link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'FS-Data.txt';
    link.click();
}

const openFile = () => {
    var obj = document.getElementById('inputFile');
    obj?.click();
}

// 設定の入力
const inputSetting = (event: Event) => {
    try {
        // @ts-ignore
        let inputFile = event.target!.files[0]
        let reader = new FileReader();
        reader.readAsText(inputFile);
        reader.onload = () => {
            // @ts-ignore
            let data = JSON.parse(reader.result)
            setData(data)
            displayUpdate()
        }
    } catch {
        console.log("input errer")
    }

}

// モバイル切り替え
const mobileView = ref(false);
const watchWindowSize = () => {
    if (window.innerWidth < 1000) {
        mobileView.value = true;
    } else {
        mobileView.value = false;
    }
}
watchWindowSize()
window.addEventListener('resize', watchWindowSize)

// ハンバーガーメニュー
const smallnavbtn = ref("smallnav-btn")
const smallnavDisplay = ref(false)
const snavBtnActive = () => {
    if (smallnavbtn.value == "smallnav-btn") {
        smallnavbtn.value = "smallnav-btn active";
        smallnavDisplay.value = true;
        displayUpdate()
    } else {
        smallnavbtn.value = "smallnav-btn";
        smallnavDisplay.value = false;
        displayUpdate()
    }
}
const displayUserHelp = ref()
const userHelp = () => {
    location.href = "https://note.com/tunakan_yt212/n/na0cd640b09b5";
    // displayUserHelp.value.open()
}

// シミュレーション準備画面表示
const simulationReady = ref()
const simulationOpen = () => {
    for(let i = 0; i < 5; i++) {
        for(let j = 0; j < fesIdols[i].PassiveIndex.length; j++) {
            fesIdols[i].PassiveIndex[j].times = passiveSkills[fesIdols[i].PassiveIndex[j].index].Times
        }
    }
    simulationReady.value.setData({
        passive: passiveSkills,
        fesIdol: fesIdols,
        detail: detailSetting
    })
    simulationReady.value.ready();
}

loadLocalStorage()
</script>

<style scoped>
/* input style delete  */
input[type="number"]::-webkit-outer-spin-button,
input[type="number"]::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
}

input[type="number"] {
    appearance: textfield;
}

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


/* コンテンツ
---------------------------------------------------------------------------- */
#contents {
    margin: 0 5%;
}

.bigBtn {
    width: 100px;
    padding: 10px;
    text-align: center;
    font-size: 17px;
    font-weight: bold;
    border-radius: 10px;
    user-select: none;
}

#saveBtn {
    color: aliceblue;
    margin-left: 85%;
    background-color: rgba(3, 182, 57, 0.658);
}

#saveBtn:hover {
    cursor: pointer;
    background-color: rgba(3, 182, 57, 0.9);
}

#outputBtn {
    color: aliceblue;
    background-color: rgba(3, 182, 57, 0.658);
}

#outputBtn:hover {
    cursor: pointer;
    background-color: rgba(3, 182, 57, 0.9);
}

#inputBtn {
    margin-left: 10px;
    color: aliceblue;
    background-color: rgba(3, 155, 182, 0.658);
}

#inputBtn:hover {
    cursor: pointer;
    background-color: rgba(3, 155, 182, 0.9);
}

#nextBtn {
    color: aliceblue;
    background-color: rgba(3, 36, 182, 0.658);
}

#nextBtn:hover {
    cursor: pointer;
    background-color: rgba(3, 36, 182, 0.9);
}

/* accordinon area style */
.accArea {
    list-style: none;
}

.accArea li {
    margin: 10px 0;
}

.accArea section {
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
    margin: 0 3% 3% 3%;
}

.accBox ul {
    list-style: none;
    padding-right: 40px;
}

.accBox ul>li {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px;
    border: 2px solid rgba(0, 0, 0, .3);
    border-radius: 10px;
}

.accBox ul li>div {
    border-radius: 10px;
}

.accBox ul li>button {
    opacity: .7;
    height: 50px;
    border: none;
    border-radius: 10px;
}

.accBox ul li>button:hover {
    opacity: 1;
}

.passiveDelBtn {
    cursor:pointer;
    -webkit-tap-highlight-color:rgba(0,0,0,0);
}

.passiveDelBtn>img {
    height: 40px;
}

.gold {
    background-color: rgba(255, 215, 0, 0.3);
}

.rainbow {
    background-color: rgba(87, 216, 255, 0.3);
}

#damage,
#interestAbility,
#damageStrong,
#damageWeak,
#count,
#omonouDPlus,
#omonouPlus,
#omonoukakin,
#centerOfAttention,
#noAttention {
    width: 100px;
    padding: 1px 5px;
    margin-left: 10px;
}

.passiveSettingArea {
    padding: 5px;
    user-select: none;
}

.btn {
    width: -moz-fit-content;
    /* Firefox */
    width: fit-content;
    /* other browsers */
    padding: 3px 10px;
    border: 1px solid rgba(0, 0, 0, .3);
    border-radius: 10px;
    cursor: pointer;
}

.btn:hover {
    background-color: rgba(226, 226, 226, 0.3);
}


/* 編成入力エリア
----------------------------------------------------------------------------------- */
.positionName {
    margin: 5px;
    font-weight: lighter;
}

.selected {
    background-color: rgba(0, 0, 0, 0.2);
}

#Leader {
    border: 10px solid rgba(204, 68, 255, .3);
}
#Vocal {
    border: 10px solid rgba(255, 68, 68, .3);
}
#Dance {
    border: 10px solid rgba(51, 187, 255, .3);
}
#Visual {
    border: 10px solid rgba(255, 187, 51, .3);
}
#Center {
    border: 10px solid rgba(121, 248, 206, 0.3);
}

/* モバイル　1000px
--------------------------------------------------------------------------------- */
@media screen and (max-width: 1030px) {
    #contents {
        margin: 0 1%;
    }

    ul {
        padding-inline-start: 2px;
    }

    select {
        max-width: 60vw;
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

    .btn {
        margin: 0 0 0 auto;
    }

    .passiveDelBtn {
        padding: 2px;
        margin-left: 5px;
    }
    .passiveDelBtn>img {
        width: 30px;
        height: auto;
    }
}</style>
