// プレイアブルアイドルリスト

import { idol } from "./type";

// ユニット
const illuminationStars = 1;
const lAntica = 2;
const afterSchool = 3;
const alstroemeria = 4;
const straylight = 5;
const noctchill = 6;
const shiis = 7;

export const idolList: idol[] = [
    {
        Name: "櫻木真乃",
        Number: 1,
        Unit: illuminationStars
    },
    {
        Name: "風野灯織",
        Number: 2,
        Unit: illuminationStars
    },
    {
        Name: "八宮めぐる",
        Number: 3,
        Unit: illuminationStars
    },
    {
        Name: "月岡恋鐘",
        Number: 4,
        Unit: lAntica
    },
    {
        Name: "田中摩美々",
        Number: 5,
        Unit: lAntica
    },
    {
        Name: "白瀬咲耶",
        Number: 6,
        Unit: lAntica
    },
    {
        Name: "三峰結華",
        Number: 7,
        Unit: lAntica
    },
    {
        Name: "幽谷霧子",
        Number: 8,
        Unit: lAntica
    },
    {
        Name: "小宮果穂",
        Number: 9,
        Unit: afterSchool
    },
    {
        Name: "園田智代子",
        Number: 10,
        Unit: afterSchool
    },
    {
        Name: "西城樹里",
        Number: 11,
        Unit: afterSchool
    },
    {
        Name: "杜野凛世",
        Number: 12,
        Unit: afterSchool
    },
    {
        Name: "有栖川夏葉",
        Number: 13,
        Unit: afterSchool
    },
    {
        Name: "大崎甘奈",
        Number: 14,
        Unit: alstroemeria
    },
    {
        Name: "大崎甜花",
        Number: 15,
        Unit: alstroemeria
    },
    {
        Name: "桑山千雪",
        Number: 16,
        Unit: alstroemeria
    },
    {
        Name: "芹沢あさひ",
        Number: 17,
        Unit: straylight
    },
    {
        Name: "黛冬優子",
        Number: 18,
        Unit: straylight
    },
    {
        Name: "和泉愛依",
        Number: 19,
        Unit: straylight
    },
    {
        Name: "浅倉透",
        Number: 20,
        Unit: noctchill
    },
    {
        Name: "樋口円香",
        Number: 21,
        Unit: noctchill
    },
    {
        Name: "福丸小糸",
        Number: 22,
        Unit: noctchill
    },
    {
        Name: "市川雛菜",
        Number: 23,
        Unit: noctchill
    },
    {
        Name: "七草にちか",
        Number: 24,
        Unit: shiis
    },
    {
        Name: "緋田美琴",
        Number: 25,
        Unit: shiis
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
            Number: idolList.length + 1,
            Unit: illuminationStars
        },
        {
            Name: "アンティーカ",
            Number: idolList.length + 2,
            Unit: lAntica
        },
        {
            Name: "放クラ",
            Number: idolList.length + 3,
            Unit: afterSchool
        },
        {
            Name: "アルスト",
            Number: idolList.length + 4,
            Unit: alstroemeria
        },
        {
            Name: "ストレイ",
            Number: idolList.length + 5,
            Unit: straylight
        },
        {
            Name: "ノクチル",
            Number: idolList.length + 6,
            Unit: noctchill
        },
        {
            Name: "シーズ",
            Number: idolList.length + 7,
            Unit: shiis
        },
    )
}
makeDuetList();