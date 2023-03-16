// 入力データの確認

import { findByTriggerID, triggerList } from "../data/passiveTrigger"
import { findByLiveEffectID, findByPassiveID, liveSkillEffect, passiveEffect } from "../data/skillEffect"
import { detail, fesIdol, passive } from "../data/type"

export const dataVerification = (passive:passive[], fesIdol:fesIdol[], detail:detail):string[] => {
    let errerMessage:string[] = []
    errerMessage.length = 0

    // Passive check
    for(let i = 0; i < passive.length; i++) {
        // Value 
        if(passive[i].Attribute != undefined) {
            if(!passive[i].Value) {
                errerMessage.push('パッシブスキル "' + passive[i].Name + '" のバフ効果量を入力してください');
            }
        }
        // trigger tHis
        if(passive[i].Trigger.tID == 2 || passive[i].Trigger.tID == 3) {
            for(let tHisIndex = 0; tHisIndex < passive[i].Trigger.tHis.length; tHisIndex++) {
                if(!passive[i].Trigger.tHis[tHisIndex]) {
                    errerMessage.push('パッシブスキル "' + passive[i].Name + '" の発動条件の履歴を入力してください');
                }
            }
        }
        // trigger tN
        if(triggerList[findByTriggerID(passive[i].Trigger.tID)].existX) {
            if(!passive[i].Trigger.tX) {
                errerMessage.push('パッシブスキル "' + passive[i].Name + '" の発動条件の【X】を入力してください');
            }
        }
        // activeturn
        if(!passive[i].ActiveTurn.after || !passive[i].ActiveTurn.before ) {
            errerMessage.push('パッシブスキル "' + passive[i].Name + '" の発動ターンを入力してください')
        }
        // probability
        if(!passive[i].Probability) {
            errerMessage.push('パッシブスキル "' + passive[i].Name + '" の確率を入力してください')
        }
        // times
        if(!passive[i].Times) {
            errerMessage.push('パッシブスキル "' + passive[i].Name + '" の発動回数を入力してください')
        }
        // passive effect
        for(let eIndex = 0; eIndex < passive[i].Effect.length; eIndex++) {
            if(passiveEffect[findByPassiveID(passive[i].Effect[eIndex].eID)].existN) {
                if(!passive[i].Effect[eIndex].eValue) {
                    errerMessage.push('パッシブスキル "' + passive[i].Name + ' " 「' + passiveEffect[findByPassiveID(passive[i].Effect[eIndex].eID)].label + '」の【N】の値を入力してください')
                }
            }
        }
    }

    // fesIdol check
    for(let i = 0; i < fesIdol.length; i++) {
        // idol
        if(!fesIdol[i].Idol) {
            errerMessage.push(fesIdol[i].Position + ' のアイドルを選択してください');
        }
        // memorielevel
        if(!fesIdol[i].MemorieLevel) {
            errerMessage.push(fesIdol[i].Position + ' の思い出レベルを選択してください');
        }
        // status vo
        if(!fesIdol[i].Status.VoValue) {
            errerMessage.push(fesIdol[i].Position + ' の Vo ステータスを入力してください');
        }
        // status da
        if(!fesIdol[i].Status.DaValue) {
            errerMessage.push(fesIdol[i].Position + ' の Da ステータスを入力してください');
        }
        // status vi
        if(!fesIdol[i].Status.ViValue) {
            errerMessage.push(fesIdol[i].Position + ' の Vi ステータスを入力してください');
        }
        // status me
        if(!fesIdol[i].Status.MeValue) {
            errerMessage.push(fesIdol[i].Position + ' の Me ステータスを入力してください');
        }
        // liveskill
        for(let j = 0; j < fesIdol[i].LiveSkill.length; j++) {
            // priority
            if(!fesIdol[i].LiveSkill[j].Priority) {
                errerMessage.push(fesIdol[i].Position + ' のライブスキルの優先順位を入力してください');
            }
            // appeal
            for(let aIndex = 0; aIndex < fesIdol[i].LiveSkill[j].Appeal.length; aIndex++) {
                if(fesIdol[i].LiveSkill[j].Appeal[aIndex].aID != 1) {
                    // avalue
                    if(!fesIdol[i].LiveSkill[j].Appeal[aIndex].aValue) {
                        errerMessage.push(fesIdol[i].Position + ' のライブスキルの【N】を入力してください');
                    }
                    // aattribute
                    if(!fesIdol[i].LiveSkill[j].Appeal[aIndex].aAttribute) {
                        errerMessage.push(fesIdol[i].Position + ' のライブスキルの属性を入力してください');
                    }
                }
            }
            // effect
            for(let eIndex = 0; eIndex < fesIdol[i].LiveSkill[j].Effect.length; eIndex++) {
                // eturn 1
                if(liveSkillEffect[findByLiveEffectID(fesIdol[i].LiveSkill[j].Effect[eIndex].eID)].existM) {
                    if(!fesIdol[i].LiveSkill[j].Effect[eIndex].eTurn[1]) {
                        errerMessage.push(fesIdol[i].Position + ' のライブスキル効果の【M】を入力してください');
                    }
                }
                // evalue
                if(liveSkillEffect[findByLiveEffectID(fesIdol[i].LiveSkill[j].Effect[eIndex].eID)].existN) {
                    if(!fesIdol[i].LiveSkill[j].Effect[eIndex].eValue) {
                        errerMessage.push(fesIdol[i].Position + ' のライブスキル効果の【N】を入力してください');
                    }
                }
                if(fesIdol[i].LiveSkill[j].Effect[eIndex].eID == 2) {
                    if(!fesIdol[i].LiveSkill[j].Effect[eIndex].eValue) {
                        errerMessage.push(fesIdol[i].Position + ' のライブスキル効果のデュエットを選択してください');
                    }
                }
                // eturn 0
                if(liveSkillEffect[findByLiveEffectID(fesIdol[i].LiveSkill[j].Effect[eIndex].eID)].existTurn) {
                    if(!fesIdol[i].LiveSkill[j].Effect[eIndex].eTurn[0]) {
                        errerMessage.push(fesIdol[i].Position + ' のライブスキル効果ターンを入力してください');
                    }
                }
                // etime
                if(liveSkillEffect[findByLiveEffectID(fesIdol[i].LiveSkill[j].Effect[eIndex].eID)].existTime) {
                    if(!fesIdol[i].LiveSkill[j].Effect[eIndex].eTime) {
                        errerMessage.push(fesIdol[i].Position + ' のライブスキル効果の回数を入力してください');
                    }
                }
                // enote
                if(liveSkillEffect[findByLiveEffectID(fesIdol[i].LiveSkill[j].Effect[eIndex].eID)].existAttribute) {
                    if(!fesIdol[i].LiveSkill[j].Effect[eIndex].eNote) {
                        errerMessage.push(fesIdol[i].Position + ' のライブスキル効果の属性を入力してください');
                    }
                }
            }
            // link appeal
            for(let laIndex = 0; laIndex < fesIdol[i].LiveSkill[j].Link.lAppeal.length; laIndex++) {
                if(fesIdol[i].LiveSkill[j].Link.lAppeal[laIndex].laID != 1) {
                    // avalue
                    if(!fesIdol[i].LiveSkill[j].Link.lAppeal[laIndex].laValue) {
                        errerMessage.push(fesIdol[i].Position + ' のライブスキルの【N】を入力してください');
                    }
                    // aattribute
                    if(!fesIdol[i].LiveSkill[j].Link.lAppeal[laIndex].laAttribute) {
                        errerMessage.push(fesIdol[i].Position + ' のライブスキルの属性を入力してください');
                    }
                }
            }
            // link effect
            for(let leIndex = 0; leIndex < fesIdol[i].LiveSkill[j].Link.lEffect.length; leIndex++) {
                // lturn 1
                if(liveSkillEffect[findByLiveEffectID(fesIdol[i].LiveSkill[j].Link.lEffect[leIndex].leID)].existM) {
                    if(!fesIdol[i].LiveSkill[j].Link.lEffect[leIndex].leTurn[1]) {
                        errerMessage.push(fesIdol[i].Position + ' のLink効果の【M】を入力してください');
                    }
                }
                // lvalue
                if(liveSkillEffect[findByLiveEffectID(fesIdol[i].LiveSkill[j].Link.lEffect[leIndex].leID)].existN) {
                    if(!fesIdol[i].LiveSkill[j].Link.lEffect[leIndex].leValue) {
                        errerMessage.push(fesIdol[i].Position + ' のLink効果の【N】を入力してください');
                    }
                }
                if(fesIdol[i].LiveSkill[j].Link.lEffect[leIndex].leID == 2) {
                    if(!fesIdol[i].LiveSkill[j].Link.lEffect[leIndex].leValue) {
                        errerMessage.push(fesIdol[i].Position + ' のLink効果のデュエットを選択してください');
                    }
                }
                // lturn 0
                if(liveSkillEffect[findByLiveEffectID(fesIdol[i].LiveSkill[j].Link.lEffect[leIndex].leID)].existTurn) {
                    if(!fesIdol[i].LiveSkill[j].Link.lEffect[leIndex].leTurn[0]) {
                        errerMessage.push(fesIdol[i].Position + ' のLink効果ターンを入力してください');
                    }
                }
                // ltime
                if(liveSkillEffect[findByLiveEffectID(fesIdol[i].LiveSkill[j].Link.lEffect[leIndex].leID)].existTime) {
                    if(!fesIdol[i].LiveSkill[j].Link.lEffect[leIndex].leTime) {
                        errerMessage.push(fesIdol[i].Position + ' のLink効果の回数を入力してください');
                    }
                }
                // lnote
                if(liveSkillEffect[findByLiveEffectID(fesIdol[i].LiveSkill[j].Link.lEffect[leIndex].leID)].existAttribute) {
                    if(!fesIdol[i].LiveSkill[j].Link.lEffect[leIndex].leNote) {
                        errerMessage.push(fesIdol[i].Position + ' のLink効果の属性を入力してください');
                    }
                }
            }
        }
    }
    // memory appeal
    for(let aIndex = 0; aIndex < fesIdol[4].MemoryAppeal.mAppeal.length; aIndex++) {
        if(fesIdol[4].MemoryAppeal.mAppeal[aIndex].maID != 1) {
            // avalue
            if(!fesIdol[4].MemoryAppeal.mAppeal[aIndex].maValue) {
                errerMessage.push(fesIdol[4].Position + ' の思い出アピールの【N】を入力してください');
            }
            // aattribute
            if(!fesIdol[4].MemoryAppeal.mAppeal[aIndex].maAttribute) {
                errerMessage.push(fesIdol[4].Position + ' の思い出アピールの属性を入力してください');
            }
        }
    }
    // memory effect
    for(let eIndex = 0; eIndex < fesIdol[4].MemoryAppeal.mEffect.length; eIndex++) {
        // eturn 1
        if(liveSkillEffect[findByLiveEffectID(fesIdol[4].MemoryAppeal.mEffect[eIndex].meID)].existM) {
            if(!fesIdol[4].MemoryAppeal.mEffect[eIndex].meTurn[1]) {
                errerMessage.push(fesIdol[4].Position + ' の思い出効果の【M】を入力してください');
            }
        }
        // evalue
        if(liveSkillEffect[findByLiveEffectID(fesIdol[4].MemoryAppeal.mEffect[eIndex].meID)].existN) {
            if(!fesIdol[4].MemoryAppeal.mEffect[eIndex].meValue) {
                errerMessage.push(fesIdol[4].Position + ' の思い出効果の【N】を入力してください');
            }
        }
        if(fesIdol[4].MemoryAppeal.mEffect[eIndex].meID == 2) {
            if(!fesIdol[4].MemoryAppeal.mEffect[eIndex].meValue) {
                errerMessage.push(fesIdol[4].Position + ' の思い出効果のデュエットを選択してください');
            }
        }
        // eturn 0
        if(liveSkillEffect[findByLiveEffectID(fesIdol[4].MemoryAppeal.mEffect[eIndex].meID)].existTurn) {
            if(!fesIdol[4].MemoryAppeal.mEffect[eIndex].meTurn[0]) {
                errerMessage.push(fesIdol[4].Position + ' の思い出効果ターンを入力してください');
            }
        }
        // etime
        if(liveSkillEffect[findByLiveEffectID(fesIdol[4].MemoryAppeal.mEffect[eIndex].meID)].existTime) {
            if(!fesIdol[4].MemoryAppeal.mEffect[eIndex].meTime) {
                errerMessage.push(fesIdol[4].Position + ' の思い出効果の回数を入力してください');
            }
        }
        // enote
        if(liveSkillEffect[findByLiveEffectID(fesIdol[4].MemoryAppeal.mEffect[eIndex].meID)].existAttribute) {
            if(!fesIdol[4].MemoryAppeal.mEffect[eIndex].meNote) {
                errerMessage.push(fesIdol[4].Position + ' の思い出効果の属性を入力してください');
            }
        }
    }
    // memory link appeal
    for(let laIndex = 0; laIndex < fesIdol[4].MemoryAppeal.mLink.mlAppeal.length; laIndex++) {
        if(fesIdol[4].MemoryAppeal.mLink.mlAppeal[laIndex].mlaID != 1) {
            // avalue
            if(!fesIdol[4].MemoryAppeal.mLink.mlAppeal[laIndex].mlaValue) {
                errerMessage.push(fesIdol[4].Position + ' の思い出Linkの【N】を入力してください');
            }
            // aattribute
            if(!fesIdol[4].MemoryAppeal.mLink.mlAppeal[laIndex].mlaAttribute) {
                errerMessage.push(fesIdol[4].Position + ' の思い出Linkの属性を入力してください');
            }
        }
    }

    // detail check
    if(!detail.damage && detail.damage !== 0) {
        errerMessage.push('審査員ダメージ(影響力)を入力してください');
    }
    if(!detail.damageStrong && detail.damageStrong !== 0) {
        errerMessage.push('打たれ強いを取得した人数を入力してください（0 ~ 5）');
    }
    if(!detail.damageWeak && detail.damageWeak !== 0) {
        errerMessage.push('打たれ弱いを取得した人数を入力してください（0 ~ 5）');
    }
    if(!detail.omonouDPlus && detail.omonouDPlus !== 0) {
        errerMessage.push('思い出(ノウハウ)++ を取得した人数を入力してください（0 ~ 5）');
    }
    if(!detail.omonouPlus && detail.omonouPlus !== 0) {
        errerMessage.push('思い出(ノウハウ)+ を取得した人数を入力してください（0 ~ 5）');
    }
    if(!detail.omonoukakin && detail.omonoukakin !== 0) {
        errerMessage.push('思い出増加量 +2% を取得した人数を入力してください（0 ~ 5）');
    }
    if(!detail.centerOfAttention && detail.centerOfAttention !== 0) {
        errerMessage.push('注目の的を取得した人数を入力してください（0 ~ 5）');
    }
    if(!detail.noAttention && detail.noAttention !== 0) {
        errerMessage.push('ひかえめを取得した人数を入力してください（0 ~ 5）');
    }
    if(!detail.count) {
        errerMessage.push('試行回数を入力してください');
    }

    return errerMessage
}