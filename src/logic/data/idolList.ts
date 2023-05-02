// プレイアブルアイドルリスト

import { idol } from "./type";

// ユニット
const illuminationStars = [1, 2, 3];
const lAntica = [4, 5, 6, 7, 8];
const afterSchool = [9, 10, 11, 12, 13];
const alstroemeria = [14, 15, 16];
const straylight = [17, 18, 19];
const noctchill = [20, 21, 22, 23];
const shiis = [24, 25];
const ruka = [33];

export const getUnitMember = (index:number):number[] => {
    if(index == 2) {
        return illuminationStars;
    }else if(index == 3) {
        return lAntica;
    }else if(index == 4) {
        return afterSchool;
    }else if(index == 5) {
        return alstroemeria;
    }else if(index == 6) {
        return straylight;
    }else if(index == 7) {
        return noctchill;
    }else if(index == 8) {
        return shiis;
    }else {
        console.log("getUnitMember index errer");
        return [0];
    }
}

export const findByIdolID = (id: number): number => {
    let seaechIndex = 0;
    while (true) {
        if (idolList[seaechIndex].ID == id) {
            return seaechIndex;
        } else if (seaechIndex == idolList.length) {
            console.log("No such idol ID:" + id)
            return 99
        }
        seaechIndex++;
    }
}

export const findByDuetID = (id: number): number => {
    let seaechIndex = 0;
    while (true) {
        if (duetList[seaechIndex].ID == id) {
            return seaechIndex;
        } else if (seaechIndex == duetList.length) {
            console.log("No such idol ID:" + id)
            return 99
        }
        seaechIndex++;
    }
}

export const idolList: idol[] = [
    {
        Name: "櫻木真乃",
        ID: 1,
        Unit: illuminationStars
    },
    {
        Name: "風野灯織",
        ID: 2,
        Unit: illuminationStars
    },
    {
        Name: "八宮めぐる",
        ID: 3,
        Unit: illuminationStars
    },
    {
        Name: "月岡恋鐘",
        ID: 4,
        Unit: lAntica
    },
    {
        Name: "田中摩美々",
        ID: 5,
        Unit: lAntica
    },
    {
        Name: "白瀬咲耶",
        ID: 6,
        Unit: lAntica
    },
    {
        Name: "三峰結華",
        ID: 7,
        Unit: lAntica
    },
    {
        Name: "幽谷霧子",
        ID: 8,
        Unit: lAntica
    },
    {
        Name: "小宮果穂",
        ID: 9,
        Unit: afterSchool
    },
    {
        Name: "園田智代子",
        ID: 10,
        Unit: afterSchool
    },
    {
        Name: "西城樹里",
        ID: 11,
        Unit: afterSchool
    },
    {
        Name: "杜野凛世",
        ID: 12,
        Unit: afterSchool
    },
    {
        Name: "有栖川夏葉",
        ID: 13,
        Unit: afterSchool
    },
    {
        Name: "大崎甘奈",
        ID: 14,
        Unit: alstroemeria
    },
    {
        Name: "大崎甜花",
        ID: 15,
        Unit: alstroemeria
    },
    {
        Name: "桑山千雪",
        ID: 16,
        Unit: alstroemeria
    },
    {
        Name: "芹沢あさひ",
        ID: 17,
        Unit: straylight
    },
    {
        Name: "黛冬優子",
        ID: 18,
        Unit: straylight
    },
    {
        Name: "和泉愛依",
        ID: 19,
        Unit: straylight
    },
    {
        Name: "浅倉透",
        ID: 20,
        Unit: noctchill
    },
    {
        Name: "樋口円香",
        ID: 21,
        Unit: noctchill
    },
    {
        Name: "福丸小糸",
        ID: 22,
        Unit: noctchill
    },
    {
        Name: "市川雛菜",
        ID: 23,
        Unit: noctchill
    },
    {
        Name: "七草にちか",
        ID: 24,
        Unit: shiis
    },
    {
        Name: "緋田美琴",
        ID: 25,
        Unit: shiis
    },
    {
        Name: "斑鳩ルカ",
        ID: 33,
        Unit: ruka
    },
]

// デュエット選択
export const duetList: idol[] = []
const makeDuetList = () => {
    for (let i = 0; i < idolList.length; i++) {
        duetList.push(idolList[i])
    }
    duetList.push(
        {
            Name: "イルミネ",
            ID: 26,
            Unit: illuminationStars
        },
        {
            Name: "アンティーカ",
            ID: 27,
            Unit: lAntica
        },
        {
            Name: "放クラ",
            ID: 28,
            Unit: afterSchool
        },
        {
            Name: "アルスト",
            ID: 29,
            Unit: alstroemeria
        },
        {
            Name: "ストレイ",
            ID: 30,
            Unit: straylight
        },
        {
            Name: "ノクチル",
            ID: 31,
            Unit: noctchill
        },
        {
            Name: "シーズ",
            ID: 32,
            Unit: shiis
        },
    )
}
makeDuetList();