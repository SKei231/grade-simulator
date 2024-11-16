<template>
    <div :class="contents">
        <ul class="accArea">
            <li>
                <section>
                    <h2 v-bind:class="accAreaDisplay.passive.class" @click="toggleAccBtn('passiveSetting', 0)">パッシブスキル</h2>
                    <div class="accBox" v-if="accAreaDisplay.passive.boolean">
                        <ul>
                            <li v-for="(ps, index) in passiveSkills">
                                <div v-bind:class="passiveSkills[index].Class[0]" style="position: relative;">
                                    <div class="passiveSettingArea">
                                        パッシブ名:
                                        <input type="text" v-model="passiveSkills[index].Name" style="margin-right: 20px;" placeholder="パッシブの名前を入力" @change="displayUpdate()"><br v-if="mobileView">
                                        <input type="checkbox" v-bind:id="GRID(index, 'gold')" style="margin-left: 10px; margin-top: 10px;" v-model="passiveSkills[index].Gold" @change="passiveColorCheck(index, passiveSkills[index].Gold,  passiveSkills[index].Rainbow)"><label v-bind:for="GRID(index, 'gold')">金パッシブ</label>
                                        <input type="checkbox" v-bind:id="GRID(index, 'rainbow')" style="margin-left: 10px; margin-top: 10px;" v-model="passiveSkills[index].Rainbow" @change="passiveColorCheck(index, passiveSkills[index].Gold, passiveSkills[index].Rainbow)"><label v-bind:for="GRID(index, 'rainbow')">虹パッシブ</label>
                                    </div>
                                    <div class="passiveSettingArea">
                                        <select v-model="passiveSkills[index].Attribute">
                                            <option value="Vo">Vocal</option>
                                            <option value="Da">Dance</option>
                                            <option value="Vi">Visual</option>
                                            <option value="VoDa">Vo & Da</option>
                                            <option value="DaVi">Da & Vi</option>
                                            <option value="ViVo">Vi & Vo</option>
                                            <option value="All">Vo & Da & Vi</option>
                                        </select>
                                        <input type="number" v-model="passiveSkills[index].Value" v-on:change="passiveColorCheck(index, passiveSkills[index].Gold,  passiveSkills[index].Rainbow)" style="width: 50px; margin-left: 10px;">%up<br v-if="mobileView">
                                    </div>
                                    <div class="passiveSettingArea" v-for="(ef, Eindex) in passiveSkills[index].Effect">
                                        効果:
                                        <select v-model="passiveSkills[index].Effect[Eindex].eID" @change="displayUpdate()">
                                            <option v-for="passiveEffects in skill_effect.passiveEffect" v-bind:value="passiveEffects.ID">{{ passiveEffects.label }}</option>
                                        </select>
                                        <span v-if="skill_effect.passiveEffect[skill_effect.findByPassiveID(passiveSkills[index].Effect[Eindex].eID)].existN" style="padding-left: 10px;">
                                            <p style="margin: 10px 0px;">
                                                {{ skill_effect.passiveEffect[skill_effect.findByPassiveID(passiveSkills[index].Effect[Eindex].eID)].parsedLabel[0] }}
                                                <input type="number" style="width: 30px;" v-model="passiveSkills[index].Effect[Eindex].eValue">
                                                {{ skill_effect.passiveEffect[skill_effect.findByPassiveID(passiveSkills[index].Effect[Eindex].eID)].parsedLabel[1] }}
                                            </p>
                                        </span>
                                    </div>
                                    <div @click="plusEffect(index)" class="btn" style="font-size: 13px;">スキル効果を追加</div>
                                    <div style="background-color: rgba(0, 0, 0, 0.2); height: 3px; margin-top: 10px;"></div>
                                    <div class="passiveSettingArea">
                                        条件:
                                        <select v-model="passiveSkills[index].Trigger.tID" @change="clearHistry(index)">
                                            <option v-for="passiveTrigers in passive_trigger.triggerList" v-bind:value="passiveTrigers.ID">{{ passiveTrigers.label }}</option>
                                        </select>
                                        <span v-if="passiveSkills[index].Trigger.tID != 3">
                                            <br>
                                            ターン:
                                            <select v-model="passiveSkills[index].ActiveTurn.turnModel" @change="turnRefresh(index)">
                                                <option value="0">指定なし</option>
                                                <option value="1">〇ターン以前</option>
                                                <option value="2">〇ターン以後</option>
                                                <option value="3">〇ターン以前〇ターン以後</option>
                                            </select>
                                        </span>
                                        <p style="margin-bottom: 5px;">
                                            <span v-if="passiveSkills[index].Trigger.tID != 3">
                                                <select v-if="passiveSkills[index].ActiveTurn.turnModel == 1 || passiveSkills[index].ActiveTurn.turnModel == 3" v-model="passiveSkills[index].ActiveTurn.before">
                                                    <option v-for="turns in vault.turns" :value="turns">{{ turns }}ターン以前</option>
                                                </select>
                                                <span v-if="passiveSkills[index].ActiveTurn.turnModel == 3" style="padding: 0 5px"></span>
                                                <select v-if="passiveSkills[index].ActiveTurn.turnModel >= 2" v-model="passiveSkills[index].ActiveTurn.after">
                                                    <option v-for="turns in vault.turns" :value="turns">{{ turns }}ターン以降</option>
                                                </select>
                                                <span v-if="passiveSkills[index].ActiveTurn.turnModel != 0" style="padding: 0 5px"></span>
                                                <br v-if="passiveSkills[index].ActiveTurn.turnModel != 0 && mobileView">
                                            </span>
                                            <span v-if="passiveSkills[index].Trigger.tID != 2 && passiveSkills[index].Trigger.tID != 3 && passiveSkills[index].Trigger.tID != 18">
                                                <!-- X の入力 -->
                                                <span v-if="passive_trigger.triggerList[passive_trigger.findByTriggerID(passiveSkills[index].Trigger.tID)].existX" style="padding-left: 10px;">
                                                    {{  passive_trigger.triggerList[passive_trigger.findByTriggerID(passiveSkills[index].Trigger.tID)].parsedLabel[0] }}
                                                    <input type="number" style="width: 30px;" v-model="passiveSkills[index].Trigger.tX[0]">
                                                    {{  passive_trigger.triggerList[passive_trigger.findByTriggerID(passiveSkills[index].Trigger.tID)].parsedLabel[1] }}
                                                </span>
                                                <!-- Y の入力 -->
                                                <span v-if="passive_trigger.triggerList[passive_trigger.findByTriggerID(passiveSkills[index].Trigger.tID)].existY" style="padding-left: 10px;">
                                                    <input type="number" style="width: 30px;" v-model="passiveSkills[index].Trigger.tX[1]">
                                                    {{  passive_trigger.triggerList[passive_trigger.findByTriggerID(passiveSkills[index].Trigger.tID)].parsedLabel[2] }}
                                                </span>
                                            </span>
                                            <!-- 履歴 -->
                                            <span v-if="passiveSkills[index].Trigger.tID == 2 || passiveSkills[index].Trigger.tID == 3 || passiveSkills[index].Trigger.tID == 18">
                                                {{  passive_trigger.triggerList[passive_trigger.findByTriggerID(passiveSkills[index].Trigger.tID)].parsedLabel[0] }}
                                                <span v-for="(his, Hindex) in passiveSkills[index].Trigger.tHis">
                                                    <select v-model="passiveSkills[index].Trigger.tHis[Hindex]" v-if="passiveSkills[index].Trigger.tID != 18">
                                                        <option v-for="idols in idol_list.idolList" v-bind:value="idols.ID">{{ idols.Name }}</option>
                                                    </select>
                                                    <select v-model="passiveSkills[index].Trigger.tHis[0]" v-if="passiveSkills[index].Trigger.tID == 18">
                                                        <option value="1">指定なし</option>
                                                        <option value="2">イルミネ</option>
                                                        <option value="3">アンティーカ</option>
                                                        <option value="4">方クラ</option>
                                                        <option value="5">アルスト</option>
                                                        <option value="6">ストレイ</option>
                                                        <option value="7">ノクチル</option>
                                                        <option value="8">シーズ</option>
                                                        <option value="9">コメティック</option>
                                                    </select>
                                                </span>
                                                {{  passive_trigger.triggerList[passive_trigger.findByTriggerID(passiveSkills[index].Trigger.tID)].parsedLabel[1] }}
                                                <span v-if="passive_trigger.triggerList[passive_trigger.findByTriggerID(passiveSkills[index].Trigger.tID)].existX" style="padding-left: 10px;">
                                                    <input type="number" style="width: 30px;" v-model="passiveSkills[index].Trigger.tX[0]">
                                                    {{  passive_trigger.triggerList[passive_trigger.findByTriggerID(passiveSkills[index].Trigger.tID)].parsedLabel[2] }}
                                                </span>
                                            </span>
                                        </p>
                                        <div @click="plusHistory(index)" class="btn" style="font-size: 13px;" v-if="passiveSkills[index].Trigger.tID == 2 || passiveSkills[index].Trigger.tID == 3">履歴を追加</div>
                                    </div>
                                    <div class="passiveSettingArea">
                                        <span>
                                            ［確率:
                                            <select v-model="passiveSkills[index].Probability">
                                                <option v-for="probability in [5,10,15,20,25,30,35,40,45,50]" :value="probability">{{ probability }}</option>
                                            </select>
                                            %］
                                        </span><br v-if="mobileView">
                                        <span>
                                            ［最大
                                            <select v-model="passiveSkills[index].Times">
                                                <option v-for="times in [1,2,3,4,5]" :value="times">{{ times }}</option>
                                            </select>
                                            回］
                                        </span>
                                    </div>
                                    <div v-if="(passiveSkills[index].Class[1]=='passiveDelete')" class="background-blur" style="position: absolute; top: 0; right: 0; width: 100%; height: 100%; display: flex; justify-content: center; align-items: center; border-radius: 10px;">
                                        <div>
                                            <button class="passiveDelBtn">
                                                <img src="../assets/trashCan.png" alt="消去" @click="deletePassive(index)">
                                            </button>
                                        </div>
                                    </div>
                                    <div style="position: absolute; display: block; top: 0; right: 0px; width: 30px; padding: 10px; text-align: center;" @click="passiveDeleteToggle(index)">
                                        <span class="meet-points"></span>
                                    </div>
                                </div>
                            </li>
                            <div class="btn" @click="plusPassive()">パッシブを追加</div>
                        </ul>
                    </div>
                </section>
            </li>
            <li>
                <section>
                    <h2 v-bind:class="accAreaDisplay.formationSetting.class" @click="toggleAccBtn('formationSetting', 0)">編成</h2>
                    <div class="accBox" v-if="accAreaDisplay.formationSetting.boolean">
                        <ul>
                            <li v-for="(fesIdolStatus, fesIdolIndex) in fesIdols" v-bind:id="fesIdolStatus.Position">
                                <div class="accBox" style="padding: 0px 10px; margin: 0;">
                                    <div @click.self="toggleAccBtn('fesIdolSetting', fesIdolIndex)" style="user-select: none; cursor: pointer; display: block;">
                                        <span :class="accAreaDisplay.fesIdolSetting[fesIdolIndex].class" @click.self="toggleAccBtn('fesIdolSetting', fesIdolIndex)">{{ fesIdolStatus.Position }} : </span>
                                        <select v-model="fesIdols[fesIdolIndex].Idol" style="margin: 5px;" @change="setLinkTrigger(fesIdolIndex)">
                                            <option v-for="idols in idol_list.idolList" v-bind:value="idols.ID">{{ idols.Name }}</option>
                                        </select>
                                    </div>
                                    <div v-if="accAreaDisplay.fesIdolSetting[fesIdolIndex].boolean">
                                        <div style="margin: 5px;">
                                            Vo: <input type="number" v-model="fesIdols[fesIdolIndex].Status.VoValue" style="width: 60px;">
                                            Da: <input type="number" v-model="fesIdols[fesIdolIndex].Status.DaValue" style="width: 60px;"><br v-if="mobileView">
                                            Vi: <input type="number" v-model="fesIdols[fesIdolIndex].Status.ViValue" style="width: 60px;">
                                            Me: <input type="number" v-model="fesIdols[fesIdolIndex].Status.MeValue" style="width: 60px;">
                                        </div>
                                        <div style="margin: 5px;">
                                            思い出レベル: 
                                            <select v-model="fesIdols[fesIdolIndex].MemorieLevel" style="margin: 5px;">
                                                <option value='1'>1</option>
                                                <option value='2'>2</option>
                                                <option value='3'>3</option>
                                                <option value='4'>4</option>
                                                <option value='5'>Max</option>
                                            </select>
                                        </div>
                                        <p style="margin: 5px; padding-left: 20px;">ライブスキル</p>
                                        <ul>
                                            <li v-for="(liveSkills, lindex) in fesIdols[fesIdolIndex].LiveSkill" style="display: block;">
                                                <div style="padding: 3px;">
                                                    <div v-for="(LSeffect, aIndex) in fesIdols[fesIdolIndex].LiveSkill[lindex].Appeal" style="padding: 2px;">
                                                        アピール: 
                                                        <select v-model="fesIdols[fesIdolIndex].LiveSkill[lindex].Appeal[aIndex].aID" @change="displayUpdate()">
                                                            <option v-for="liveSkillAppeals in skill_effect.liveSkillAppeal" v-bind:value="liveSkillAppeals.ID">{{ liveSkillAppeals.label }}
                                                            </option>
                                                        </select>
                                                        <p v-if="fesIdols[fesIdolIndex].LiveSkill[lindex].Appeal[aIndex].aID != 1" style="margin: 10px 0px;">
                                                            <select style="margin-left: 10px;" v-model="fesIdols[fesIdolIndex].LiveSkill[lindex].Appeal[aIndex].aAttribute">
                                                                <option value="Vo">Vocal</option>
                                                                <option value="Da">Dance</option>
                                                                <option value="Vi">Visual</option>
                                                                <option value="Excellent">Excellent</option>
                                                            </select>
                                                            <br v-if="mobileView">
                                                            <input type="number" style="width: 30px; margin-left: 10px;" v-model="fesIdols[fesIdolIndex].LiveSkill[lindex].Appeal[aIndex].aValue">
                                                            {{ skill_effect.liveSkillAppeal[skill_effect.findByAppealID(fesIdols[fesIdolIndex].LiveSkill[lindex].Appeal[aIndex].aID)].parsedLabel[0]  }}
                                                            <br v-if="mobileView">
                                                            <span v-if="skill_effect.liveSkillAppeal[skill_effect.findByAppealID(fesIdols[fesIdolIndex].LiveSkill[lindex].Appeal[aIndex].aID)].variable">
                                                                {{ skill_effect.liveSkillAppeal[skill_effect.findByAppealID(fesIdols[fesIdolIndex].LiveSkill[lindex].Appeal[aIndex].aID)].parsedLabel[1]  }}
                                                            </span>
                                                        </p>
                                                    </div>
                                                </div>
                                                <div @click="plusLiveSkillAppeal(fesIdolIndex, lindex)" class="btn" style="font-size: 11px;">アピールを追加</div>
                                                <div style="padding: 3px;">
                                                    <div v-for="(LSeffect, lsIndex) in fesIdols[fesIdolIndex].LiveSkill[lindex].Effect">
                                                        効果: 
                                                        <select v-model="fesIdols[fesIdolIndex].LiveSkill[lindex].Effect[lsIndex].eID" @change="displayUpdate()">
                                                            <option v-for="liveSkillEffects in skill_effect.liveSkillEffect" v-bind:value="liveSkillEffects.ID">{{ liveSkillEffects.label }}
                                                            </option>
                                                        </select><br v-if="mobileView">
                                                        <p v-if="fesIdols[fesIdolIndex].LiveSkill[lindex].Effect[lsIndex].eID != 1" style="margin: 10px 0px;">
                                                            <span v-if="fesIdols[fesIdolIndex].LiveSkill[lindex].Effect[lsIndex].eID > 2 && !skill_effect.liveSkillEffect[skill_effect.findByLiveEffectID(fesIdols[fesIdolIndex].LiveSkill[lindex].Effect[lsIndex].eID)].existM">
                                                                {{ skill_effect.liveSkillEffect[skill_effect.findByLiveEffectID(fesIdols[fesIdolIndex].LiveSkill[lindex].Effect[lsIndex].eID)].parsedLabel[0] }}
                                                                <span v-if="skill_effect.liveSkillEffect[skill_effect.findByLiveEffectID(fesIdols[fesIdolIndex].LiveSkill[lindex].Effect[lsIndex].eID)].existAttribute" style="padding-left: 10px;">
                                                                    <select v-model="fesIdols[fesIdolIndex].LiveSkill[lindex].Effect[lsIndex].eNote">
                                                                        <option value="Vo">Vocal</option>
                                                                        <option value="Da">Dance</option>
                                                                        <option value="Vi">Visual</option>
                                                                    </select>
                                                                </span>
                                                                <span v-if="skill_effect.liveSkillEffect[skill_effect.findByLiveEffectID(fesIdols[fesIdolIndex].LiveSkill[lindex].Effect[lsIndex].eID)].existN" style="padding-left: 10px;">
                                                                    <input type="number" style="width: 30px;" v-model="fesIdols[fesIdolIndex].LiveSkill[lindex].Effect[lsIndex].eValue">
                                                                </span>
                                                                {{ skill_effect.liveSkillEffect[skill_effect.findByLiveEffectID(fesIdols[fesIdolIndex].LiveSkill[lindex].Effect[lsIndex].eID)].parsedLabel[1] }}
                                                            </span>
                                                            <span v-if="skill_effect.liveSkillEffect[skill_effect.findByLiveEffectID(fesIdols[fesIdolIndex].LiveSkill[lindex].Effect[lsIndex].eID)].existM" style="padding-left: 10px;">
                                                                <!-- existM -->
                                                                {{ skill_effect.liveSkillEffect[skill_effect.findByLiveEffectID(fesIdols[fesIdolIndex].LiveSkill[lindex].Effect[lsIndex].eID)].parsedLabel[0] }}
                                                                <input type="number" style="width: 30px;" v-model="fesIdols[fesIdolIndex].LiveSkill[lindex].Effect[lsIndex].eTurn[1]">
                                                                {{ skill_effect.liveSkillEffect[skill_effect.findByLiveEffectID(fesIdols[fesIdolIndex].LiveSkill[lindex].Effect[lsIndex].eID)].parsedLabel[1] }}
                                                                <br v-if="mobileView">
                                                                <select v-model="fesIdols[fesIdolIndex].LiveSkill[lindex].Effect[lsIndex].eNote">
                                                                    <option value="Vo">Vocal</option>
                                                                    <option value="Da">Dance</option>
                                                                    <option value="Vi">Visual</option>
                                                                </select>
                                                                <input type="number" style="width: 30px; margin-left: 10px;" v-model="fesIdols[fesIdolIndex].LiveSkill[lindex].Effect[lsIndex].eValue">
                                                                {{ skill_effect.liveSkillEffect[skill_effect.findByLiveEffectID(fesIdols[fesIdolIndex].LiveSkill[lindex].Effect[lsIndex].eID)].parsedLabel[2] }}
                                                                <br>
                                                            </span>
                                                            <span v-if="fesIdols[fesIdolIndex].LiveSkill[lindex].Effect[lsIndex].eID == 2">
                                                                <!-- デュエット選択時 -->
                                                                {{ skill_effect.liveSkillEffect[skill_effect.findByLiveEffectID(fesIdols[fesIdolIndex].LiveSkill[lindex].Effect[lsIndex].eID)].parsedLabel[0] }}
                                                                <select v-model="fesIdols[fesIdolIndex].LiveSkill[lindex].Effect[lsIndex].eValue">
                                                                    <option v-for="idols in idol_list.duetList" v-bind:value="idols.ID">{{ idols.Name }}</option>
                                                                </select>
                                                            </span>
                                                            <span v-if="skill_effect.liveSkillEffect[skill_effect.findByLiveEffectID(fesIdols[fesIdolIndex].LiveSkill[lindex].Effect[lsIndex].eID)].existTurn" style="padding-left: 10px;">
                                                                [<input type="number" style="width: 30px;" v-model="fesIdols[fesIdolIndex].LiveSkill[lindex].Effect[lsIndex].eTurn[0]">
                                                                ターン]<br v-if="mobileView">
                                                            </span>
                                                            <span v-if="skill_effect.liveSkillEffect[skill_effect.findByLiveEffectID(fesIdols[fesIdolIndex].LiveSkill[lindex].Effect[lsIndex].eID)].existTime" style="padding-left: 10px;">
                                                                [<input type="number" style="width: 30px;" v-model="fesIdols[fesIdolIndex].LiveSkill[lindex].Effect[lsIndex].eTime"> 回]
                                                            </span>
                                                        </p>
                                                    </div>
                                                </div>
                                                <div @click="plusLiveSkillEffect(fesIdolIndex, lindex)" class="btn" style="font-size: 11px;">スキル効果を追加</div>
                                                <div style="background-color: rgba(0, 0, 0, 0.2); height: 3px; margin-top: 10px;"></div>
                                                <div style="padding: 3px;">
                                                    追加効果:
                                                    <select v-model="fesIdols[fesIdolIndex].LiveSkill[lindex].Link.lType" @change="displayUpdate()">
                                                        <option value='Link'>Link</option>
                                                        <option value='Plus'>Plus</option>
                                                        <!-- <option value='Change'>Change</option> -->
                                                    </select>
                                                </div>
                                                <div v-if="fesIdols[fesIdolIndex].LiveSkill[lindex].Link.lType == 'Plus'" style="padding: 3px;">
                                                    ターン:
                                                    <select v-model="fesIdols[fesIdolIndex].LiveSkill[lindex].Link.lTrigger.ltModel" @change="plusTurnRefresh(fesIdolIndex, lindex)">
                                                        <option value="0">指定なし</option>
                                                        <option value="1">〇ターン以前</option>
                                                        <option value="2">〇ターン以後</option>
                                                        <option value="3">〇ターン以前〇ターン以後</option>
                                                    </select>
                                                    <p style="margin-left: 10px">
                                                        <select v-if="fesIdols[fesIdolIndex].LiveSkill[lindex].Link.lTrigger.ltModel == 1 || fesIdols[fesIdolIndex].LiveSkill[lindex].Link.lTrigger.ltModel == 3" v-model="fesIdols[fesIdolIndex].LiveSkill[lindex].Link.lTrigger.ltBefore">
                                                            <option v-for="turns in vault.turns" :value="turns">{{ turns }}ターン以前</option>
                                                        </select>
                                                        <span v-if="fesIdols[fesIdolIndex].LiveSkill[lindex].Link.lTrigger.ltModel == 3" style="padding: 0 5px"></span>
                                                        <select v-if="fesIdols[fesIdolIndex].LiveSkill[lindex].Link.lTrigger.ltModel >= 2" v-model="fesIdols[fesIdolIndex].LiveSkill[lindex].Link.lTrigger.ltAfter">
                                                            <option v-for="turns in vault.turns" :value="turns">{{ turns }}ターン以降</option>
                                                        </select>
                                                        <span v-if="fesIdols[fesIdolIndex].LiveSkill[lindex].Link.lTrigger.ltModel != 0" style="padding: 0 5px"></span>
                                                        <br v-if="fesIdols[fesIdolIndex].LiveSkill[lindex].Link.lTrigger.ltModel != 0 && mobileView">
                                                    </p>
                                                    <div v-for="(plusTriggers, pIndex) in fesIdols[fesIdolIndex].LiveSkill[lindex].Link.lTrigger.ltList" style="padding-top: 3px;">
                                                        発動条件:
                                                        <select v-model="fesIdols[fesIdolIndex].LiveSkill[lindex].Link.lTrigger.ltList[pIndex].ltID" @change="clearPAppealHistry(fesIdolIndex, lindex, pIndex)">
                                                            <option v-for="passiveTrigers in passive_trigger.triggerList" v-bind:value="passiveTrigers.ID">{{ passiveTrigers.label }}</option>
                                                        </select>
                                                        <p style="margin-left: 10px">
                                                            <span v-if="fesIdols[fesIdolIndex].LiveSkill[lindex].Link.lTrigger.ltList[pIndex].ltID != 2 && fesIdols[fesIdolIndex].LiveSkill[lindex].Link.lTrigger.ltList[pIndex].ltID != 3 && fesIdols[fesIdolIndex].LiveSkill[lindex].Link.lTrigger.ltList[pIndex].ltID != 18">
                                                                <!-- X の入力 -->
                                                                <span v-if="passive_trigger.triggerList[passive_trigger.findByTriggerID(fesIdols[fesIdolIndex].LiveSkill[lindex].Link.lTrigger.ltList[pIndex].ltID)].existX" style="padding-left: 10px;">
                                                                    {{  passive_trigger.triggerList[passive_trigger.findByTriggerID(fesIdols[fesIdolIndex].LiveSkill[lindex].Link.lTrigger.ltList[pIndex].ltID)].parsedLabel[0] }}
                                                                    <input type="number" style="width: 30px;" v-model="fesIdols[fesIdolIndex].LiveSkill[lindex].Link.lTrigger.ltList[pIndex].ltX[0]">
                                                                    {{  passive_trigger.triggerList[passive_trigger.findByTriggerID(fesIdols[fesIdolIndex].LiveSkill[lindex].Link.lTrigger.ltList[pIndex].ltID)].parsedLabel[1] }}
                                                                </span>
                                                                <!-- Y の入力 -->
                                                                <span v-if="passive_trigger.triggerList[passive_trigger.findByTriggerID(fesIdols[fesIdolIndex].LiveSkill[lindex].Link.lTrigger.ltList[pIndex].ltID)].existY" style="padding-left: 10px;">
                                                                    <input type="number" style="width: 30px;" v-model="fesIdols[fesIdolIndex].LiveSkill[lindex].Link.lTrigger.ltList[pIndex].ltX[1]">
                                                                    {{  passive_trigger.triggerList[passive_trigger.findByTriggerID(fesIdols[fesIdolIndex].LiveSkill[lindex].Link.lTrigger.ltList[pIndex].ltID)].parsedLabel[2] }}
                                                                </span>
                                                            </span>
                                                            <!-- 履歴 -->
                                                            <span v-if="fesIdols[fesIdolIndex].LiveSkill[lindex].Link.lTrigger.ltList[pIndex].ltID == 2 || fesIdols[fesIdolIndex].LiveSkill[lindex].Link.lTrigger.ltList[pIndex].ltID == 3 || fesIdols[fesIdolIndex].LiveSkill[lindex].Link.lTrigger.ltList[pIndex].ltID == 18">
                                                                {{  passive_trigger.triggerList[passive_trigger.findByTriggerID(fesIdols[fesIdolIndex].LiveSkill[lindex].Link.lTrigger.ltList[pIndex].ltID)].parsedLabel[0] }}
                                                                <span v-for="(his, Hindex) in fesIdols[fesIdolIndex].LiveSkill[lindex].Link.lTrigger.ltList[pIndex].ltHis">
                                                                    <select v-model="fesIdols[fesIdolIndex].LiveSkill[lindex].Link.lTrigger.ltList[pIndex].ltHis[Hindex]" v-if="fesIdols[fesIdolIndex].LiveSkill[lindex].Link.lTrigger.ltList[pIndex].ltID != 18">
                                                                        <option v-for="idols in idol_list.idolList" v-bind:value="idols.ID">{{ idols.Name }}</option>
                                                                    </select>
                                                                    <select v-model="fesIdols[fesIdolIndex].LiveSkill[lindex].Link.lTrigger.ltList[pIndex].ltHis[0]" v-if="fesIdols[fesIdolIndex].LiveSkill[lindex].Link.lTrigger.ltList[pIndex].ltID == 18">
                                                                        <option value="1">指定なし</option>
                                                                        <option value="2">イルミネ</option>
                                                                        <option value="3">アンティーカ</option>
                                                                        <option value="4">方クラ</option>
                                                                        <option value="5">アルスト</option>
                                                                        <option value="6">ストレイ</option>
                                                                        <option value="7">ノクチル</option>
                                                                        <option value="8">シーズ</option>
                                                                        <option value="9">コメティック</option>
                                                                    </select>
                                                                </span>
                                                                {{  passive_trigger.triggerList[passive_trigger.findByTriggerID(fesIdols[fesIdolIndex].LiveSkill[lindex].Link.lTrigger.ltList[pIndex].ltID)].parsedLabel[1] }}
                                                                <span v-if="passive_trigger.triggerList[passive_trigger.findByTriggerID(fesIdols[fesIdolIndex].LiveSkill[lindex].Link.lTrigger.ltList[pIndex].ltID)].existX" style="padding-left: 10px;">
                                                                    <input type="number" style="width: 30px;" v-model="fesIdols[fesIdolIndex].LiveSkill[lindex].Link.lTrigger.ltList[pIndex].ltX[0]">
                                                                    {{  passive_trigger.triggerList[passive_trigger.findByTriggerID(fesIdols[fesIdolIndex].LiveSkill[lindex].Link.lTrigger.ltList[pIndex].ltID)].parsedLabel[2] }}
                                                                </span>
                                                            </span>
                                                        </p>
                                                    </div>
                                                    <div @click="plusPAppealTrigger(fesIdolIndex, lindex)" class="btn" style="font-size: 11px; margin-top: 3px;">発動条件を追加</div>
                                                </div>
                                                <div style="padding: 3px;" v-if="fesIdols[fesIdolIndex].Idol >= 20 && fesIdols[fesIdolIndex].Idol <= 23">
                                                    Link条件: {{ idol_list.idolList[idol_list.findByIdolID(fesIdols[fesIdolIndex].LiveSkill[lindex].LinkTrigger[0])].Name ?? "" }}
                                                    <span v-for="(LT, ltindex) in fesIdols[fesIdolIndex].LiveSkill[lindex].LinkTrigger">
                                                        <select v-if="ltindex != 0" v-model="fesIdols[fesIdolIndex].LiveSkill[lindex].LinkTrigger[ltindex]" style="margin: 5px;" @change="displayUpdate()">
                                                            <option v-for="idols in idol_list.idolList" v-bind:value="idols.ID">{{ idols.Name }}</option>
                                                        </select>
                                                    </span>
                                                    <div @click="plusLinkTrigger(fesIdolIndex, lindex)" class="btn" style="font-size: 11px;">Link条件を追加</div>
                                                </div>
                                                <div style="padding: 3px;">
                                                    <div v-for="(LSeffect, laIndex) in fesIdols[fesIdolIndex].LiveSkill[lindex].Link.lAppeal" style="padding: 2px;">
                                                        {{ fesIdols[fesIdolIndex].LiveSkill[lindex].Link.lType }}アピール: 
                                                        <select v-model="fesIdols[fesIdolIndex].LiveSkill[lindex].Link.lAppeal[laIndex].laID" @change="displayUpdate()">
                                                            <option v-for="liveSkillAppeals in skill_effect.liveSkillAppeal" v-bind:value="liveSkillAppeals.ID">{{ liveSkillAppeals.label }}
                                                            </option>
                                                        </select>
                                                        <p v-if="fesIdols[fesIdolIndex].LiveSkill[lindex].Link.lAppeal[laIndex].laID != 1" style="margin: 10px 0px;">
                                                            <select style="margin-left: 10px;" v-model="fesIdols[fesIdolIndex].LiveSkill[lindex].Link.lAppeal[laIndex].laAttribute">
                                                                <option value="Vo">Vocal</option>
                                                                <option value="Da">Dance</option>
                                                                <option value="Vi">Visual</option>
                                                                <option value="Excellent">Excellent</option>
                                                            </select>
                                                            <br v-if="mobileView">
                                                            <input type="number" style="width: 30px; margin-left: 10px;" v-model="fesIdols[fesIdolIndex].LiveSkill[lindex].Link.lAppeal[laIndex].laValue">
                                                            {{ skill_effect.liveSkillAppeal[skill_effect.findByAppealID(fesIdols[fesIdolIndex].LiveSkill[lindex].Link.lAppeal[laIndex].laID)].parsedLabel[0]  }}
                                                            <br v-if="mobileView">
                                                            <span v-if="skill_effect.liveSkillAppeal[skill_effect.findByAppealID(fesIdols[fesIdolIndex].LiveSkill[lindex].Link.lAppeal[laIndex].laID)].variable">
                                                                {{ skill_effect.liveSkillAppeal[skill_effect.findByAppealID(fesIdols[fesIdolIndex].LiveSkill[lindex].Link.lAppeal[laIndex].laID)].parsedLabel[1]  }}
                                                            </span>
                                                        </p>
                                                    </div>
                                                </div>
                                                <div @click="plusLinkAppeal(fesIdolIndex, lindex)" class="btn" style="font-size: 11px;">
                                                    {{ fesIdols[fesIdolIndex].LiveSkill[lindex].Link.lType }}アピールを追加</div>
                                                <div style="padding: 3px;">
                                                    <div v-for="(LSeffect, leIndex) in fesIdols[fesIdolIndex].LiveSkill[lindex].Link.lEffect" style="padding: 2px;">
                                                        {{ fesIdols[fesIdolIndex].LiveSkill[lindex].Link.lType }}効果:
                                                        <select v-model="fesIdols[fesIdolIndex].LiveSkill[lindex].Link.lEffect[leIndex].leID" @change="displayUpdate()">
                                                            <option v-for="liveSkillEffects in skill_effect.liveSkillEffect" v-bind:value="liveSkillEffects.ID">{{ liveSkillEffects.label }}
                                                            </option>
                                                        </select><br v-if="mobileView">
                                                        <p v-if="fesIdols[fesIdolIndex].LiveSkill[lindex].Link.lEffect[leIndex].leID != 1" style="margin: 10px 0px;">
                                                            <span v-if="fesIdols[fesIdolIndex].LiveSkill[lindex].Link.lEffect[leIndex].leID > 2 && !skill_effect.liveSkillEffect[skill_effect.findByLiveEffectID(fesIdols[fesIdolIndex].LiveSkill[lindex].Link.lEffect[leIndex].leID)].existM">
                                                                {{ skill_effect.liveSkillEffect[skill_effect.findByLiveEffectID(fesIdols[fesIdolIndex].LiveSkill[lindex].Link.lEffect[leIndex].leID)].parsedLabel[0] }}
                                                                <span v-if="skill_effect.liveSkillEffect[skill_effect.findByLiveEffectID(fesIdols[fesIdolIndex].LiveSkill[lindex].Link.lEffect[leIndex].leID)].existAttribute" style="padding-left: 10px;">
                                                                    <select v-model="fesIdols[fesIdolIndex].LiveSkill[lindex].Link.lEffect[leIndex].leNote">
                                                                        <option value="Vo">Vocal</option>
                                                                        <option value="Da">Dance</option>
                                                                        <option value="Vi">Visual</option>
                                                                    </select>
                                                                </span>
                                                                <span v-if="skill_effect.liveSkillEffect[skill_effect.findByLiveEffectID(fesIdols[fesIdolIndex].LiveSkill[lindex].Link.lEffect[leIndex].leID)].existN" style="padding-left: 10px;">
                                                                    <input type="number" style="width: 30px;" v-model="fesIdols[fesIdolIndex].LiveSkill[lindex].Link.lEffect[leIndex].leValue">
                                                                </span>
                                                                {{ skill_effect.liveSkillEffect[skill_effect.findByLiveEffectID(fesIdols[fesIdolIndex].LiveSkill[lindex].Link.lEffect[leIndex].leID)].parsedLabel[1] }}
                                                            </span>
                                                            <span v-if="skill_effect.liveSkillEffect[skill_effect.findByLiveEffectID(fesIdols[fesIdolIndex].LiveSkill[lindex].Link.lEffect[leIndex].leID)].existM" style="padding-left: 10px;">
                                                                <!-- existM -->
                                                                {{ skill_effect.liveSkillEffect[skill_effect.findByLiveEffectID(fesIdols[fesIdolIndex].LiveSkill[lindex].Link.lEffect[leIndex].leID)].parsedLabel[0] }}
                                                                <input type="number" style="width: 30px;" v-model="fesIdols[fesIdolIndex].LiveSkill[lindex].Link.lEffect[leIndex].leTurn[1]">
                                                                {{ skill_effect.liveSkillEffect[skill_effect.findByLiveEffectID(fesIdols[fesIdolIndex].LiveSkill[lindex].Link.lEffect[leIndex].leID)].parsedLabel[1] }}
                                                                <br v-if="mobileView">
                                                                <select v-model="fesIdols[fesIdolIndex].LiveSkill[lindex].Link.lEffect[leIndex].leNote">
                                                                    <option value="Vo">Vocal</option>
                                                                    <option value="Da">Dance</option>
                                                                    <option value="Vi">Visual</option>
                                                                </select>
                                                                <input type="number" style="width: 30px; margin-left: 10px;" v-model="fesIdols[fesIdolIndex].LiveSkill[lindex].Link.lEffect[leIndex].leValue">
                                                                {{ skill_effect.liveSkillEffect[skill_effect.findByLiveEffectID(fesIdols[fesIdolIndex].LiveSkill[lindex].Link.lEffect[leIndex].leID)].parsedLabel[2] }}
                                                                <br v-if="mobileView">
                                                            </span>
                                                            <span v-if="fesIdols[fesIdolIndex].LiveSkill[lindex].Link.lEffect[leIndex].leID == 2">
                                                                <!-- デュエット選択時 -->
                                                                {{ skill_effect.liveSkillEffect[skill_effect.findByLiveEffectID(fesIdols[fesIdolIndex].LiveSkill[lindex].Link.lEffect[leIndex].leID)].parsedLabel[0] }}
                                                                <select v-model="fesIdols[fesIdolIndex].LiveSkill[lindex].Link.lEffect[leIndex].leValue">
                                                                    <option v-for="idols in idol_list.duetList" v-bind:value="idols.ID">{{ idols.Name }}</option>
                                                                </select>
                                                            </span>
                                                            <span v-if="skill_effect.liveSkillEffect[skill_effect.findByLiveEffectID(fesIdols[fesIdolIndex].LiveSkill[lindex].Link.lEffect[leIndex].leID)].existTurn" style="padding-left: 10px;">
                                                                [<input type="number" style="width: 30px;" v-model="fesIdols[fesIdolIndex].LiveSkill[lindex].Link.lEffect[leIndex].leTurn[0]">
                                                                ターン]<br v-if="mobileView">
                                                            </span>
                                                            <span v-if="skill_effect.liveSkillEffect[skill_effect.findByLiveEffectID(fesIdols[fesIdolIndex].LiveSkill[lindex].Link.lEffect[leIndex].leID)].existTime" style="padding-left: 10px;">
                                                                [<input type="number" style="width: 30px;" v-model="fesIdols[fesIdolIndex].LiveSkill[lindex].Link.lEffect[leIndex].leTime"> 回]
                                                            </span>
                                                        </p>
                                                    </div>
                                                </div>
                                                <div @click="plusLinkEffect(fesIdolIndex, lindex)" class="btn" style="font-size: 11px;">
                                                    {{ fesIdols[fesIdolIndex].LiveSkill[lindex].Link.lType }}効果を追加
                                                </div>
                                            </li>
                                        </ul>
                                        <div v-if="fesIdolIndex == 4">
                                            <p>思い出アピール</p>
                                            <ul style="padding-left: 0;">
                                                <li style="display: block;">
                                                    <div style="padding: 3px;">
                                                        <div v-for="(Meffect, maIndex) in fesIdols[fesIdolIndex].MemoryAppeal.mAppeal" style="padding: 2px;">
                                                            アピール: 
                                                            <select v-model="fesIdols[fesIdolIndex].MemoryAppeal.mAppeal[maIndex].maID" @change="displayUpdate()">
                                                                <option v-for="liveSkillAppeals in skill_effect.liveSkillAppeal" v-bind:value="liveSkillAppeals.ID">{{ liveSkillAppeals.label }}
                                                                </option>
                                                            </select>
                                                            <span v-if="fesIdols[fesIdolIndex].MemoryAppeal.mAppeal[maIndex].maID != 1">
                                                                <br v-if="mobileView">属性:
                                                                <select v-model="fesIdols[fesIdolIndex].MemoryAppeal.mAppeal[maIndex].maAttribute">
                                                                    <option value="Vo">Vo</option>
                                                                    <option value="Da">Da</option>
                                                                    <option value="Vi">Vi</option>
                                                                    <option value="Excellent">Excellent</option>
                                                                </select>
                                                            </span>
                                                            <span v-if="fesIdols[fesIdolIndex].MemoryAppeal.mAppeal[maIndex].maID != 1" style="padding-left: 10px;"> N:
                                                                <input type="number" style="width: 30px;" v-model="fesIdols[fesIdolIndex].MemoryAppeal.mAppeal[maIndex].maValue">
                                                            </span>
                                                        </div>
                                                    </div>
                                                    <div @click="plusMemory('appeal')" class="btn" style="font-size: 11px;">思い出アピールを追加</div>
                                                    <div style="padding: 3px;">
                                                        <div v-for="(Meffect, meIndex) in fesIdols[fesIdolIndex].MemoryAppeal.mEffect">
                                                            効果: 
                                                            <select v-model="fesIdols[fesIdolIndex].MemoryAppeal.mEffect[meIndex].meID" @change="displayUpdate()">
                                                                <option v-for="liveSkillEffects in skill_effect.liveSkillEffect" v-bind:value="liveSkillEffects.ID">{{ liveSkillEffects.label }}
                                                                </option>
                                                            </select><br v-if="mobileView">
                                                            <span v-if="skill_effect.liveSkillEffect[skill_effect.findByLiveEffectID(fesIdols[fesIdolIndex].MemoryAppeal.mEffect[meIndex].meID)].existM" style="padding-left: 10px;">
                                                                M: 
                                                                <input type="number" style="width: 30px;" v-model="fesIdols[fesIdolIndex].MemoryAppeal.mEffect[meIndex].meTurn[1]">
                                                                <br>
                                                            </span>
                                                            <span v-if="skill_effect.liveSkillEffect[skill_effect.findByLiveEffectID(fesIdols[fesIdolIndex].MemoryAppeal.mEffect[meIndex].meID)].existAttribute" style="padding-left: 10px;">
                                                                属性:
                                                                <select v-model="fesIdols[fesIdolIndex].MemoryAppeal.mEffect[meIndex].meNote">
                                                                    <option value="Vo">Vo</option>
                                                                    <option value="Da">Da</option>
                                                                    <option value="Vi">Vi</option>
                                                                </select><br v-if="mobileView">
                                                            </span>
                                                            <span v-if="fesIdols[fesIdolIndex].MemoryAppeal.mEffect[meIndex].meID == 2">
                                                                :
                                                                <select v-model="fesIdols[fesIdolIndex].MemoryAppeal.mEffect[meIndex].meValue">
                                                                    <option v-for="idols in idol_list.duetList" v-bind:value="idols.ID">{{ idols.Name }}</option>
                                                                </select>
                                                            </span>
                                                            <span v-if="skill_effect.liveSkillEffect[skill_effect.findByLiveEffectID(fesIdols[fesIdolIndex].MemoryAppeal.mEffect[meIndex].meID)].existN" style="padding-left: 10px;"> N:
                                                                <input type="number" style="width: 30px;" v-model="fesIdols[fesIdolIndex].MemoryAppeal.mEffect[meIndex].meValue"><br v-if="mobileView">
                                                            </span>
                                                            <span v-if="skill_effect.liveSkillEffect[skill_effect.findByLiveEffectID(fesIdols[fesIdolIndex].MemoryAppeal.mEffect[meIndex].meID)].existTurn" style="padding-left: 10px;">
                                                                <input type="number" style="width: 30px;" v-model="fesIdols[fesIdolIndex].MemoryAppeal.mEffect[meIndex].meTurn[0]">
                                                                ターン<br v-if="mobileView">
                                                            </span>
                                                            <span v-if="skill_effect.liveSkillEffect[skill_effect.findByLiveEffectID(fesIdols[fesIdolIndex].MemoryAppeal.mEffect[meIndex].meID)].existTime" style="padding-left: 10px;">
                                                                <input type="number" style="width: 30px;" v-model="fesIdols[fesIdolIndex].MemoryAppeal.mEffect[meIndex].meTime"> 回
                                                            </span>
                                                        </div>
                                                    </div>
                                                    <div @click="plusMemory('effect')" class="btn" style="font-size: 11px;">思い出効果を追加</div>
                                                    <div style="padding: 3px;">
                                                        <div v-for="(LSeffect, mlaIndex) in fesIdols[fesIdolIndex].MemoryAppeal.mLink.mlAppeal" style="padding: 2px;">
                                                            Linkアピール: 
                                                            <select v-model="fesIdols[fesIdolIndex].MemoryAppeal.mLink.mlAppeal[mlaIndex].mlaID" @change="displayUpdate()">
                                                                <option v-for="liveSkillAppeals in skill_effect.liveSkillAppeal" v-bind:value="liveSkillAppeals.ID">{{ liveSkillAppeals.label }}
                                                                </option>
                                                            </select>
                                                            <span v-if="fesIdols[fesIdolIndex].MemoryAppeal.mLink.mlAppeal[mlaIndex].mlaID != 1">
                                                                <br v-if="mobileView">属性:
                                                                <select v-model="fesIdols[fesIdolIndex].MemoryAppeal.mLink.mlAppeal[mlaIndex].mlaAttribute">
                                                                    <option value="Vo">Vo</option>
                                                                    <option value="Da">Da</option>
                                                                    <option value="Vi">Vi</option>
                                                                    <option value="Excellent">Excellent</option>
                                                                </select>
                                                            </span>
                                                            <span v-if="fesIdols[fesIdolIndex].MemoryAppeal.mLink.mlAppeal[mlaIndex].mlaID != 1" style="padding-left: 10px;"> N:
                                                                <input type="number" style="width: 30px;" v-model="fesIdols[fesIdolIndex].MemoryAppeal.mLink.mlAppeal[mlaIndex].mlaValue">
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
                                            <draggable v-model="fesIdols[fesIdolIndex].PassiveIndex" item-key="no" handle=".dragHandle" @end="displayUpdate()" animation="100">
                                                <template #item="{ element, index }">
                                                    <ul style="padding-left: 0;">
                                                        <li v-if="!mobileView" style="display: flex; border-radius: 5px; margin: 2px; padding: 2px;" v-bind:class="passiveClass(element.fesIdolIndex, index)">
                                                            <select v-model="element.index" @change="displayUpdate()">
                                                                <option v-for="(passive, aIndex) in passiveSkills" v-bind:class="passive.Class[0]" v-bind:value="aIndex">【{{ passive.Name }}】{{ passive.Attribute }} {{ passive.Value }}%up</option>
                                                            </select>
                                                            <div style="display: flex;">
                                                                <div class="btn" style="font-size: 12px; padding: 1px 10px; margin-right: 20px; user-select: none;" @click="unsetPassive(element.fesIdolIndex, index)">削除</div>
                                                                <div class="dragHandle">
                                                                    <span></span>
                                                                </div>
                                                            </div>
                                                        </li>
                                                        <li v-if="mobileView" style="display: flex; border-radius: 5px; margin: 2px; padding: 2px; justify-content: space-between;" v-bind:class="passiveClass(element.fesIdolIndex, index)">
                                                            <div v-if="mobileView" class="btn" style="font-size: 12px; padding: 1px 5px; margin: 0 5px; user-select: none;" @click="unsetPassive(element.fesIdolIndex, index)">削除</div>
                                                            <select v-model="element.index" @change="displayUpdate()" style="width: 45vw;">
                                                                <option v-for="(passive, aIndex) in passiveSkills" v-bind:class="passive.Class[0]" v-bind:value="aIndex">【{{ passive.Name }}】{{ passive.Attribute }} {{ passive.Value }}%up</option>
                                                            </select>
                                                            <div style="display: flex;">
                                                            </div>
                                                            <div class="dragHandle">
                                                                <span></span>
                                                            </div>
                                                        </li>
                                                    </ul>
                                                </template>
                                            </draggable>
                                            <div @click="setPassive(fesIdolIndex)" class="btn" style="font-size: 11px; margin-top: 5px;">パッシブスキルを追加</div>
                                        </div>
                                    </div>
                                </div>
                            </li>
                        </ul>
                    </div>
                </section>
            </li>
            <li>
                <section>
                    <h2 v-bind:class="accAreaDisplay.detailSetting.class" @click="toggleAccBtn('detailSetting', 0)">その他の設定</h2>
                    <div class="accBox" v-if="accAreaDisplay.detailSetting.boolean">
                        <ul>
                            <li>
                                <div @click.self="toggleAccBtn('advancedSetting', 0)" style="user-select: none; cursor: pointer;">
                                    <span :class="accAreaDisplay.advancedSetting[0].class" @click.self="toggleAccBtn('advancedSetting', 0)">メンタルダメージ系</span>
                                </div>
                                <ul v-if="accAreaDisplay.advancedSetting[0].boolean">
                                    <li>
                                        <label for="damage">審査員ダメージ（影響力）</label>
                                        <input type="number" id="damage" v-model="detailSetting.damage">
                                    </li>
                                    <li>
                                        <label for="damageStrong">打たれ強いを取得した人数</label>
                                        <input type="number" id="damageStrong" v-model="detailSetting.damageStrong" max="5">
                                    </li>
                                    <li>
                                        <label for="damageWeak">打たれ弱いを取得した人数</label>
                                        <input type="number" id="damageWeak" v-model="detailSetting.damageWeak" max="5">
                                    </li>
                                </ul>
                            </li>
                            <li>
                                <div @click.self="toggleAccBtn('advancedSetting', 1)" style="user-select: none; cursor: pointer;">
                                    <span :class="accAreaDisplay.advancedSetting[1].class" @click.self="toggleAccBtn('advancedSetting', 1)">思い出アピール系</span>
                                </div>
                                <ul v-if="accAreaDisplay.advancedSetting[1].boolean">
                                    <li>
                                        <label for="maxMemory">パラコレの数</label>
                                        <select v-model="detailSetting.maxMemory" id="maxMemory" style="margin: 5px; width: 100px;" @change="displayUpdate()">
                                            <option value="1000">0</option>
                                            <option value="2000">1</option>
                                            <option value="1900">2</option>
                                            <option value="1800">3</option>
                                            <option value="1700">4</option>
                                            <option value="1600">5</option>
                                        </select>
                                        <br v-if="mobileView">
                                        <span>思い出ゲージ最大値：{{ detailSetting.maxMemory/10 }}</span>
                                    </li>
                                    <li>
                                        <label for="romanticist">ロマンチスト を取得した人数</label>
                                        <select v-model="detailSetting.romanticist" id="romanticist" style="margin: 5px; width: 100px;" @change="displayUpdate()">
                                            <option value="0">0</option>
                                            <option value="1">1</option>
                                            <option value="2">2</option>
                                            <option value="3">3</option>
                                            <option value="4">4</option>
                                            <option value="5">5</option>
                                        </select>
                                    </li>
                                    <li>
                                        <label for="omonouDPlus">思い出(ノウハウ)++ を取得した人数</label>
                                        <select v-model="detailSetting.omonouDPlus" id="omonouDPlus" style="margin: 5px; width: 100px;" @change="displayUpdate()">
                                            <option value="0">0</option>
                                            <option value="1">1</option>
                                            <option value="2">2</option>
                                            <option value="3">3</option>
                                            <option value="4">4</option>
                                            <option value="5">5</option>
                                        </select>
                                    </li>
                                    <li>
                                        <label for="omonouPlus">思い出(ノウハウ)+ を取得した人数</label>
                                        <select v-model="detailSetting.omonouPlus" id="omonouPlus" style="margin: 5px; width: 100px;" @change="displayUpdate()">
                                            <option value="0">0</option>
                                            <option value="1">1</option>
                                            <option value="2">2</option>
                                            <option value="3">3</option>
                                            <option value="4">4</option>
                                            <option value="5">5</option>
                                        </select>
                                    </li>
                                    <li>
                                        <label for="omonoukakin">思い出増加量 +2% を取得した人数</label>
                                        <select v-model="detailSetting.omonoukakin" id="omonoukakin" style="margin: 5px; width: 100px;" @change="displayUpdate()">
                                            <option value="0">0</option>
                                            <option value="1">1</option>
                                            <option value="2">2</option>
                                            <option value="3">3</option>
                                            <option value="4">4</option>
                                            <option value="5">5</option>
                                        </select>
                                    </li>
                                    <li>
                                        <label for="omonouElse">その他の思い出加速（合計%）</label>
                                        <br v-if="mobileView">
                                        <input type="number" id="omonouElse" v-model="detailSetting.omonouElse">
                                    </li>
                                </ul>
                            </li>
                            <li>
                                <div @click.self="toggleAccBtn('advancedSetting', 2)" style="user-select: none; cursor: pointer;">
                                    <span :class="accAreaDisplay.advancedSetting[2].class" @click.self="toggleAccBtn('advancedSetting', 2)">注目度系</span>
                                </div>
                                <ul v-if="accAreaDisplay.advancedSetting[2].boolean">
                                    <li>
                                        <label for="">注目の的 を取得した人数</label>
                                        <input type="number" id="centerOfAttention" v-model="detailSetting.centerOfAttention" max="5">
                                    </li>
                                    <li>
                                        <label for="">ひかえめ を取得した人数</label>
                                        <input type="number" id="noAttention" v-model="detailSetting.noAttention" max="5">
                                    </li>
                                </ul>
                            </li>
                        </ul>
                    </div>
                </section>
            </li>
        </ul>
        <input type="file" id="inputFile" style="display: none;" @change="inputSetting">
        <Simulation ref="simulationReady"></Simulation>
        <span :key="renderKey"><!-- displayUpdate() の為の空要素 --></span>
    </div>
    <Navigate 
        @naviActive="naviActive"
        @simulationOpen="simulationOpen"
        @setLocalStorage="setLocalStorage"
        @openFile="openFile"
        @outputSetting="outputSetting"
        @deleteData="deleteData">
    </Navigate>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import * as passive_trigger from '../logic/data/skillTrigger'
import * as skill_effect from '../logic/data/skillEffect'
import * as idol_list from '../logic/data/idolList'
import * as vault from '../logic/event/vault'
import * as types from '../logic/data/type'
import Simulation from './simulation.vue'
import draggable from 'vuedraggable'
import Navigate from './inputNavi.vue'


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
    try {
        for (let i = 0; i < data.passive.length; i++) {
            let newPassive: types.passive = {
                Name: data.passive[i].Name ?? ref("").value,
                Attribute: data.passive[i].Attribute ?? ref("").value,
                Value: data.passive[i].Value ?? ref().value,
                Class: data.passive[i].Class ?? ["white", ref("passiveDeleteCansel").value],
                Gold: data.passive[i].Gold ?? ref(false).value,
                Rainbow: data.passive[i].Rainbow ?? ref(false).value,
                Trigger: {
                    tID: data.passive[i].Trigger.tID ?? ref(1).value,
                    tX: data.passive[i].Trigger.tX ?? [ref().value, ref().value],
                    tHis: data.passive[i].Trigger.tHis ?? [ref().value]
                },
                ActiveTurn: {
                    turnModel: data.passive[i].ActiveTurn.turnModel ?? ref(0).value,
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
            if(typeof data.passive[i].Trigger.tX === "number") {
                newPassive.Trigger.tX = [ref(data.passive[i].Trigger.tX).value, ref().value];
            }
            passiveSkills.push(newPassive);
        }
        for(let i = 0; i < passiveSkills.length; i++) {
            passiveColorCheck(i, passiveSkills[i].Gold, passiveSkills[i].Rainbow);
        }
    } catch (error) {
        window.alert("パッシブの読み込みに失敗しました");
        console.log(error);
        passiveSkills = [];
    }
    if(inputFileType == 0) {
        // 編成
        fesIdols = []
        try {
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
                                lType: data.fesIdol[i].LiveSkill[0].Link.lType ?? ref('Link').value,
                                lTrigger: data.fesIdol[i].LiveSkill[0].Link.lTrigger ?? {
                                    ltBefore: ref(vault.maxTurn).value,
                                    ltAfter: ref(1).value,
                                    ltList: [{
                                        ltID: ref(1).value,
                                        ltX: [ref().value, ref().value],
                                        ltHis: [ref().value]
                                    }]
                                },
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
                                lType: data.fesIdol[i].LiveSkill[1].Link.lType ?? ref('Link').value,
                                lTrigger: data.fesIdol[i].LiveSkill[1].Link.lTrigger ?? {
                                    ltBefore: ref(vault.maxTurn).value,
                                    ltAfter: ref(1).value,
                                    ltList: [{
                                        ltID: ref(1).value,
                                        ltX: [ref().value, ref().value],
                                        ltHis: [ref().value]
                                    }]
                                },
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
                            LinkTrigger: data.fesIdol[i].LiveSkill[1].LinkTrigger ?? [ref().value]
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
                for (let j = 0; j < newFesIdol.LiveSkill[0].Link.lTrigger.ltList.length; j++) {
                    if (typeof newFesIdol.LiveSkill[0].Link.lTrigger.ltList[j].ltID !== "number") {
                        newFesIdol.LiveSkill[0].Link.lTrigger.ltList[j].ltID = ref(1).value
                    }
                    try {
                        if (typeof newFesIdol.LiveSkill[0].Link.lTrigger.ltList[j].ltX[0] !== "number") {
                            newFesIdol.LiveSkill[0].Link.lTrigger.ltList[j].ltX[0] = ref().value
                        }
                    } catch (error) {
                        newFesIdol.LiveSkill[0].Link.lTrigger.ltList[j].ltX = [ref().value, ref().value]
                    }
                    try {
                        if (typeof newFesIdol.LiveSkill[0].Link.lTrigger.ltList[j].ltX[1] !== "number") {
                            newFesIdol.LiveSkill[0].Link.lTrigger.ltList[j].ltX[1] = ref().value
                        }
                    } catch (error) {
                        newFesIdol.LiveSkill[0].Link.lTrigger.ltList[j].ltX = [newFesIdol.LiveSkill[0].Link.lTrigger.ltList[j].ltX[0], ref().value]
                    }
                    for(let p = 0; p < newFesIdol.LiveSkill[0].Link.lTrigger.ltList[j].ltHis.length; p++) {
                        if (typeof newFesIdol.LiveSkill[0].Link.lTrigger.ltList[j].ltHis[p] !== "number") {
                            newFesIdol.LiveSkill[0].Link.lTrigger.ltList[j].ltHis[p] = ref().value
                        }
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
                for (let j = 0; j < newFesIdol.LiveSkill[1].Link.lTrigger.ltList.length; j++) {
                    if (typeof newFesIdol.LiveSkill[1].Link.lTrigger.ltList[j].ltID !== "number") {
                        newFesIdol.LiveSkill[1].Link.lTrigger.ltList[j].ltID = ref(1).value
                    }
                    try {
                        if (typeof newFesIdol.LiveSkill[1].Link.lTrigger.ltList[j].ltX[0] !== "number") {
                            newFesIdol.LiveSkill[1].Link.lTrigger.ltList[j].ltX[0] = ref().value
                        }
                    } catch (error) {
                        newFesIdol.LiveSkill[1].Link.lTrigger.ltList[j].ltX = [ref().value, ref().value]
                    }
                    try {
                        if (typeof newFesIdol.LiveSkill[1].Link.lTrigger.ltList[j].ltX[1] !== "number") {
                            newFesIdol.LiveSkill[1].Link.lTrigger.ltList[j].ltX[1] = ref().value
                        }
                    } catch (error) {
                        newFesIdol.LiveSkill[1].Link.lTrigger.ltList[j].ltX = [ref(newFesIdol.LiveSkill[1].Link.lTrigger.ltList[j].ltX[0]).value, ref().value]
                    }
                    for(let k = 0; k < newFesIdol.LiveSkill[1].Link.lTrigger.ltList[j].ltHis.length; k++) {
                        if (typeof newFesIdol.LiveSkill[1].Link.lTrigger.ltList[j].ltHis[k] !== "number") {
                            newFesIdol.LiveSkill[1].Link.lTrigger.ltList[j].ltHis[k] = ref().value
                        }
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
                            times: ref().value,
                            fesIdolIndex: i
                        }
                    }
                    try {
                        if(typeof newFesIdol.PassiveIndex[j].fesIdolIndex !== "number") {
                            newFesIdol.PassiveIndex[j].fesIdolIndex = i;
                        }
                    } catch (error) {
                        newFesIdol.PassiveIndex[j] = {
                            index: ref(newFesIdol.PassiveIndex[j].index).value,
                            times: ref().value,
                            fesIdolIndex: i
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
        } catch (error) {
            window.alert("編成の読み込みに失敗しました");
            console.log(error);
            fesIdols = [];
            setIdolList();
        }
        // 詳細設定
        try {
            detailSetting = {
                damage: data.detail.damage ?? ref(231).value,
                damageStrong: data.detail.damageStrong ?? ref(0).value,
                damageWeak: data.detail.damageWeak ?? ref(0).value,
                count: data.detail.count ?? ref(1).value,
                romanticist: data.detail.romanticist ?? ref(0).value,
                omonouDPlus: data.detail.omonouDPlus ?? ref(0).value,
                omonouPlus: data.detail.omonouPlus ?? ref(0).value,
                omonoukakin: data.detail.omonoukakin ?? ref(0).value,
                omonouElse: data.detail.omonouElse ?? ref(0).value,
                centerOfAttention: data.detail.centerOfAttention ?? ref(0).value,
                noAttention: data.detail.noAttention ?? ref(0).value,
                liveSkillRandom: data.detail.liveSkillRandom ?? ref(false).value,
                maxMemory: data.detail.maxMemory ?? ref(1000).value
            }
            if(detailSetting.count < 0 || detailSetting.count > 10) {
                detailSetting.count = 1
            }
        } catch (error) {
            window.alert("詳細設定の読み込みに失敗しました");
            console.log(error);
            detailSetting = {
                // 審査員ダメージ
                damage: ref(231).value,
                // 打たれ強い
                damageStrong: ref(0).value,
                // 打たれ弱い
                damageWeak: ref(0).value,
                // 試行回数
                count: ref(1).value,
                // ロマンチスト
                romanticist: ref(0).value,
                // 思い出++
                omonouDPlus: ref(0).value,
                // 思い出+
                omonouPlus: ref(0).value,
                // 思い出増加+2%
                omonoukakin: ref(0).value,
                // その他思い出加速
                omonouElse: ref(0).value,
                // 注目の的
                centerOfAttention: ref(0).value,
                // ひかえめ
                noAttention: ref(0).value,
                // ライブスキルのランダム
                liveSkillRandom: ref(false).value,
                // パラコレの数（思い出ゲージ最大値） 1000 ~ 2000
                maxMemory: ref(1000).value
            }
        }
    }
}

// localStorage へ保存
const setLocalStorage = () => {
    try{        
        const setData = makeJson();
        localStorage.setItem('GradeFes', setData);
    } catch {
        window.alert("データの保存に失敗しました");
        throw new Error('test')
    }
}

// JSONへ変換
const makeJson = () => {
    // パッシブ不要部の削除
    for(let i = 0; i < passiveSkills.length; i ++) {
        for(let j = 1; j < passiveSkills[i].Effect.length; j++) {
            if(passiveSkills[i].Effect[j].eID == 1) {
                passiveSkills[i].Effect.splice(j,1)
            }
        }
    }
    // 編成不要部の削除
    for(let i = 0; i < 5; i ++) {
        for(let j = 0; j < fesIdols[i].LiveSkill.length; j++) {
            for(let n = 1; n < fesIdols[i].LiveSkill[j].Appeal.length; n++) {
                if(fesIdols[i].LiveSkill[j].Appeal[n].aID == 1) {
                    fesIdols[i].LiveSkill[j].Appeal.splice(n,1)
                }
            }
            for(let n = 1; n < fesIdols[i].LiveSkill[j].Effect.length; n++) {
                if(fesIdols[i].LiveSkill[j].Effect[n].eID == 1) {
                    fesIdols[i].LiveSkill[j].Effect.splice(n,1)
                }
            }
            for(let n = 1; n < fesIdols[i].LiveSkill[j].Link.lTrigger.ltList.length; n++) {
                if(fesIdols[i].LiveSkill[j].Link.lTrigger.ltList[n].ltID == 1 && n > 0) {
                    fesIdols[i].LiveSkill[j].Link.lTrigger.ltList.splice(n,1)
                }
            }
            for(let n = 1; n < fesIdols[i].LiveSkill[j].Link.lAppeal.length; n++) {
                if(fesIdols[i].LiveSkill[j].Link.lAppeal[n].laID == 1) {
                    fesIdols[i].LiveSkill[j].Link.lAppeal.splice(n,1)
                }
            }
            for(let n = 1; n < fesIdols[i].LiveSkill[j].Link.lEffect.length; n++) {
                if(fesIdols[i].LiveSkill[j].Link.lEffect[n].leID == 1) {
                    fesIdols[i].LiveSkill[j].Link.lEffect.splice(n,1)
                }
            }
            // memory
            for(let n = 1; n < fesIdols[i].MemoryAppeal.mAppeal.length; n++) {
                if(fesIdols[i].MemoryAppeal.mAppeal[n].maID == 1) {
                    fesIdols[i].MemoryAppeal.mAppeal.splice(n,1)
                }
            }
            for(let n = 1; n < fesIdols[i].MemoryAppeal.mEffect.length; n++) {
                if(fesIdols[i].MemoryAppeal.mEffect[n].meID == 1) {
                    fesIdols[i].MemoryAppeal.mEffect.splice(n,1)
                }
            }
            for(let n = 1; n < fesIdols[i].MemoryAppeal.mLink.mlAppeal.length; n++) {
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

// const deleteConfirm = ref(false);
// データの削除
const deleteData = () => {
    // パッシブ
    passiveSkills.length = 0;
    plusPassive();
    // 編成
    fesIdols.length = 0;
    setIdolList();
    // 詳細
    detailSetting = {
        // 審査員ダメージ
        damage: ref(231).value,
        // 打たれ強い
        damageStrong: ref(0).value,
        // 打たれ弱い
        damageWeak: ref(0).value,
        // 試行回数
        count: ref(1).value,
        // ロマンチスト
        romanticist: ref(0).value,
        // 思い出++
        omonouDPlus: ref(0).value,
        // 思い出+
        omonouPlus: ref(0).value,
        // 思い出増加+2%
        omonoukakin: ref(0).value,
        // その他思い出加速
        omonouElse: ref(0).value,
        // 注目の的
        centerOfAttention: ref(0).value,
        // ひかえめ
        noAttention: ref(0).value,
        // ライブスキルのランダム
        liveSkillRandom: ref(false).value,
        // パラコレの数（思い出ゲージ最大値）
        maxMemory: ref(1000).value
    }
}

let accAreaDisplay = {
    passive: {
        class: "accBtn",
        boolean: ref(false).value
    },
    formationSetting: {
        class: "accBtn",
        boolean: ref(false).value
    },
    fesIdolSetting: [
        {
            class: "accIdolBtn positionName",
            boolean: ref(false).value
        },
        {
            class: "accIdolBtn positionName",
            boolean: ref(false).value
        },
        {
            class: "accIdolBtn positionName",
            boolean: ref(false).value
        },
        {
            class: "accIdolBtn positionName",
            boolean: ref(false).value
        },
        {
            class: "accIdolBtn positionName",
            boolean: ref(false).value
        },
    ],
    detailSetting: {
        class: "accBtn",
        boolean: ref(false).value
    },
    advancedSetting: [
        {
            class: "accIdolBtn positionName",
            boolean: ref(false).value
        },
        {
            class: "accIdolBtn positionName",
            boolean: ref(false).value
        },
        {
            class: "accIdolBtn positionName",
            boolean: ref(false).value
        }
    ]
}

// アコーディオンエリアのトグルスイッチ
const toggleAccBtn = (eleClass: string, index: number) => {
    if (eleClass == "passiveSetting") {
        if (accAreaDisplay.passive.boolean) {
            accAreaDisplay.passive.class = "accBtn";
            accAreaDisplay.passive.boolean = false;
        } else {
            accAreaDisplay.passive.class = "accBtn close";
            accAreaDisplay.passive.boolean = true;
        }
    } else if (eleClass == "formationSetting") {
        if (accAreaDisplay.formationSetting.boolean) {
            accAreaDisplay.formationSetting.class = "accBtn";
            accAreaDisplay.formationSetting.boolean = false;
        } else {
            accAreaDisplay.formationSetting.class = "accBtn close";
            accAreaDisplay.formationSetting.boolean = true;
        }
    } else if (eleClass == "fesIdolSetting") {
        if (accAreaDisplay.fesIdolSetting[index].boolean) {
            accAreaDisplay.fesIdolSetting[index].class = "accIdolBtn positionName";
            accAreaDisplay.fesIdolSetting[index].boolean = false;
        } else {
            accAreaDisplay.fesIdolSetting[index].class = "accIdolBtn positionName close";
            accAreaDisplay.fesIdolSetting[index].boolean = true;
        }
    } else if (eleClass == "detailSetting") {
        if (accAreaDisplay.detailSetting.boolean) {
            accAreaDisplay.detailSetting.class = "accBtn";
            accAreaDisplay.detailSetting.boolean = false;
        } else {
            accAreaDisplay.detailSetting.class = "accBtn close";
            accAreaDisplay.detailSetting.boolean = true;
        }
    }else if (eleClass == "advancedSetting") {
        if (accAreaDisplay.advancedSetting[index].boolean) {
            accAreaDisplay.advancedSetting[index].class = "accIdolBtn positionName";
            accAreaDisplay.advancedSetting[index].boolean = false;
        } else {
            accAreaDisplay.advancedSetting[index].class = "accIdolBtn positionName close";
            accAreaDisplay.advancedSetting[index].boolean = true;
        }
    }
    displayUpdate();
}

// 再レンダリング
const renderKey = ref(0);
const displayUpdate = () => {
    renderKey.value++;
}

// ナビ開閉
const contents = ref("contents");
const naviActive = (active:boolean) => {
    if(active) {
        contents.value = "contents active";
        displayUpdate();
    }else {
        contents.value = "contents";
        displayUpdate();
    }
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

const passiveColorCheck = (index: number, gold: boolean, rainbow:boolean) => {
    if(gold || rainbow) {
        if(gold) {
            passiveSkills[index].Class[0] = "gold";
        } else {
            passiveSkills[index].Class[0] = "rainbow";
        }
    } else {
        if (passiveSkills[index].Value >= 75) {
            if (passiveSkills[index].Value >= 180) {
                passiveSkills[index].Class[0] = "rainbow";
            } else {
                passiveSkills[index].Class[0] = "gold";
            }
        } else {
            passiveSkills[index].Class[0] = "white";
        }
    }
    displayUpdate();
}

// パッシブ追加ボタン
const plusPassive = () => {
    const newPassive: types.passive = {
        Name: ref("").value,
        Attribute: ref("Vo").value,
        Value: ref().value,
        Class: ["white", ref("").value],
        Gold: ref(false).value,
        Rainbow: ref(false).value,
        Trigger: {
            tID: ref(1).value,
            tX: [ref().value, ref().value],
            tHis: [ref().value]
        },
        ActiveTurn: {
            turnModel: ref(0).value,
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
const passiveDeleteToggle = (index:number) => {
    if(passiveSkills[index].Class[1]== "") {
        passiveSkills[index].Class[1] = "passiveDelete"
    }else {
        passiveSkills[index].Class[1] = "";
    }
    displayUpdate();
}

// 金 / 虹パッシブラベルID発行
const GRID = (index: number, color: 'gold' | 'rainbow') => {
    return color + index;
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
    turnRefresh(index);
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

// ターン初期化
const turnRefresh = (index: number) => {
    passiveSkills[index].ActiveTurn.after = 1;
    passiveSkills[index].ActiveTurn.before = vault.maxTurn;
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
            MemorieLevel: ref(1).value,
            Status: {
                VoValue: ref(0).value,
                DaValue: ref(0).value,
                ViValue: ref(0).value,
                MeValue: ref(0).value
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
                        lType: 'Link',
                        lTrigger: {
                            ltModel: ref(0).value,
                            ltBefore: ref(10).value,
                            ltAfter: ref(1).value,
                            ltList: [{
                                ltID: ref(1).value,
                                ltX: [ref().value, ref().value],
                                ltHis: [ref(1).value]
                            }]
                        },
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
                    LinkTrigger: [ref(20).value]
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
                        lType: 'Link',
                        lTrigger: {
                            ltModel: ref(0).value,
                            ltBefore: ref(10).value,
                            ltAfter: ref(1).value,
                            ltList: [{
                                ltID: ref(1).value,
                                ltX: [ref().value, ref().value],
                                ltHis: [ref(1).value]
                            }]
                        },
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
                    LinkTrigger: [ref(20).value]
                }
            ],
            PassiveIndex: [{
                index: ref(0).value,
                times: ref().value,
                fesIdolIndex: i
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

// const prioritySelected = () => {
//     for (let select = 0; select < priorityList.length; select++) {
//         priorityList[select].selectedClass = ""
//     }
//     for (let i = 0; i < fesIdols.length; i++) {
//         for (let j = 0; j < 2; j++) {
//             if (fesIdols[i].LiveSkill[j].Priority) {
//                 priorityList[fesIdols[i].LiveSkill[j].Priority].selectedClass = "selected"
//             }
//         }
//     }
//     displayUpdate()
// }

// const priorityDisable = (index: number) => {
//     return priorityList[index].selectedClass == "selected"
// }

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
    fesIdols[index].LiveSkill[0].LinkTrigger.push(ref(20).value);
    fesIdols[index].LiveSkill[1].LinkTrigger.push(ref(fesIdols[index].Idol).value);
    fesIdols[index].LiveSkill[1].LinkTrigger.push(ref(20).value);
    displayUpdate();
}

// Link条件追加ボタン
const plusLinkTrigger = (index:number, linkIndex:number) => {
    fesIdols[index].LiveSkill[linkIndex].LinkTrigger.push(ref(20).value);
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

// Plus条件追加ボタン
const plusPAppealTrigger = (idolIndex: number, LSkillIndex: number) => {
    fesIdols[idolIndex].LiveSkill[LSkillIndex].Link.lTrigger.ltList.push({
        ltID: ref(1).value,
        ltX: [ref().value, ref().value],
        ltHis: [ref(1).value]
    });
    displayUpdate();
}

// Plus条件ターン初期化
const plusTurnRefresh = (idolIndex: number, plusSkillIndex: number) => {
    fesIdols[idolIndex].LiveSkill[plusSkillIndex].Link.lTrigger.ltAfter = 1;
    fesIdols[idolIndex].LiveSkill[plusSkillIndex].Link.lTrigger.ltBefore = vault.maxTurn;
    displayUpdate();
}

// Plus履歴クリアボタン
const clearPAppealHistry = (idolIndex: number, LSkillIndex: number, PlusIndex: number) => {
    fesIdols[idolIndex].LiveSkill[LSkillIndex].Link.lTrigger.ltList[PlusIndex].ltHis = [
        ref(1).value
    ];
    displayUpdate();
}

// Plus履歴追加ボタン
const plusPAppealHistory = (idolIndex: number, LSkillIndex: number, PlusIndex: number) => {
    fesIdols[idolIndex].LiveSkill[LSkillIndex].Link.lTrigger.ltList[PlusIndex].ltHis.push(
        ref(1).value
    );
    displayUpdate();
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
        times: ref().value,
        fesIdolIndex: index
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
    let returnColor;
    if (passiveSkills[fesIdols[index].PassiveIndex[pasIndex].index]) {
        returnColor = passiveSkills[fesIdols[index].PassiveIndex[pasIndex].index].Class[0];
    } else {
        returnColor = "white"
    }
    return returnColor;
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
    // ロマンチスト
    romanticist: ref(0).value,
    // 思い出++
    omonouDPlus: ref(0).value,
    // 思い出+
    omonouPlus: ref(0).value,
    // 思い出増加+2%
    omonoukakin: ref(0).value,
    // その他思い出加速
    omonouElse: ref(0).value,
    // 注目の的
    centerOfAttention: ref(0).value,
    // ひかえめ
    noAttention: ref(0).value,
    // ライブスキルのランダム
    liveSkillRandom: ref(false).value,
    // パラコレの数（思い出ゲージ最大値） 1000 ~ 2000
    maxMemory: ref(1000).value
}

// 設定の出力
const outputSetting = () => {
    let blob = new Blob([makeJson()], { type: "text/plan" });
    let link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'FS-Data.txt';
    link.click();
}

let inputFileType = 0;
const openFile = (type:'passive' | 'all') => {
    if(type == 'passive') {
        inputFileType = 1;
    }else {
        inputFileType = 0;
    }
    var obj = document.getElementById('inputFile');
    obj?.click();
}

// 設定の入力
const inputSetting = (event: Event) => {
    try {
        deleteData();
        // @ts-ignore
        let inputFile = event.target!.files[0]
        let reader = new FileReader();
        reader.readAsText(inputFile);
        reader.onload = () => {
            // @ts-ignore
            let data = JSON.parse(reader.result)
            setData(data)
            displayUpdate()
            // @ts-ignore
            document.getElementById('inputFile')!.value = '';
        }
    } catch {
        console.log("input errer")
    }
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

/* general purpose */
.background-blur {
    -webkit-backdrop-filter: blur(10px);
    backdrop-filter: blur(10px);
    background: rgba(255, 255, 255, 0.3);
}

.meet-points {
    display: inline-block;
    vertical-align: middle;
    color: #333;
    line-height: 1;
    width: 0.25em;
    height: 0.25em;
    background: currentColor;
    border-radius: 50%;
    box-shadow: -0.375em 0 0 0 currentColor, 0.375em 0 0 0 currentColor;
}

/* コンテンツ
---------------------------------------------------------------------------- */
.contents {
    margin: 0 5%;
    transition: all .7s ease-in-out;
}
.contents.active {
    margin-right: 25vw;
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
/* accordinon area style */
.accArea {
    list-style: none;

    li {
        margin: 10px 0;
    }

    section {
        border: 1px solid #ccc;
        border-radius: 10px;

        h2 {
            z-index: 10;
            user-select: none;
        }
    }
}

.accBtn {
    position: relative;
    cursor: pointer;
    font-size: 1rem;
    font-weight: normal;
	padding: 0 0 0 16px;
    padding: 1% 0 1% 5%;
    -webkit-tap-highlight-color:rgba(0,0,0,0);
    
}
/*アイコンの＋と×*/
.accBtn::after, .accBtn::before {
    position: absolute;
    content: '';
    width: 15px;
    height: 2px;
    background-color: #333;
    transition: .5s ease-out;
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

/* アイコン < */
.accIdolBtn {
	position: relative;
	display: inline-block;
	padding: 0 0 0 16px;
	vertical-align: middle;
	text-decoration: none;
    -webkit-tap-highlight-color:rgba(0,0,0,0);
}
.accIdolBtn::before, .accIdolBtn::after {
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    margin: auto;
    content: "";
    vertical-align: middle;
}

.accIdolBtn::before {
    left: 3px;
    width: 5px;
    height: 5px;
    border-top: 2px solid rgb(43, 43, 43);
    border-right: 2px solid rgb(43, 43, 43);
    -webkit-transform: rotate(45deg);
    transform: rotate(45deg);
    transition: 0.5s ease-out;
}

/*　closeというクラスがついたら形状変化　*/
.accIdolBtn.close::before {
    transform: rotate(135deg);
}

/* accordion box style */
.accBox {
    margin: 0 3% 3% 3%;

    ul {
        position: relative;
        z-index: 10;
        list-style: none;
        padding: 0 40px;

        >li, div>li {
            justify-content: space-between;
            align-items: center;
            padding: 10px;
            border: 2px solid rgba(0, 0, 0, .3);
            border-radius: 10px;
        }

        div>li {
            border-radius: 10px;
        }
    }
}

.passiveDelBtn {
    opacity: .7;
    padding: 20px;
    border: none;
    border-radius: 10px;
    cursor:pointer;
    -webkit-tap-highlight-color:rgba(0,0,0,0);
    transition: all 0.2s;

    >img {
        height: 90px;
    }
}
.passiveDelBtn:hover {
    opacity: 1;
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
#omonouElse,
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
    margin-left: 70px;
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
    .contents {
        margin: 0 1%;
    }
    .contents.active {
        margin: 0 1%;
    }

    ul {
        padding-inline-start: 2px;
    }

    select {
        max-width: 60vw;
    }
    .accBtn {
        text-align: center;
    }

    .accBox {
        margin: 0 1% 1% 1%;

        ul {
            padding: 0 5px;

            >li, div>li {
                padding: 6px;
            }
        }
    }

    .btn {
        margin: 0 0 0 auto;
    }
    .passiveDelBtn{
        >img {
            width: 60px;
            height: auto;
        }
    }
    
    .dragHandle {
        width: 40px;
        height: 20px;
        position: relative;

        >span {
            display: block;
            position: absolute;
            top: 50%;
            left: 50%;
            margin: -4px 0 0 -7px;
            width: 14px;
            height: 4px;
            border-top: 2px rgba(0, 0, 0, .4) solid;
            border-bottom: 2px rgba(0, 0, 0, .4) solid;
        }
    }
}</style>
