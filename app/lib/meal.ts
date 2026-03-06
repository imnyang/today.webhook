import ModelClient, { isUnexpected } from "@azure-rest/ai-inference";
import { AzureKeyCredential } from "@azure/core-auth";

const KEY = process.env.NEIS_API_KEY;

export function removeNutritionInfo(value: string): string {
    const lines = value.trim().split('\n');
    const cleanedLines = lines.map(line => line.replace(/\s*\([\d.,]+\)/g, '').trim());
    const result = cleanedLines.join('\n');
    return result;
}

const nutritionList = [
    "난류", "우유", "메밀", "땅콩", "대두", "밀", "고등어", "게", "새우", "돼지고기",
    "복숭아", "토마토", "아황산류", "호두", "닭고기", "쇠고기", "오징어", "조개류(굴, 전복, 홍합 포함)", "잣"
];

export function getNutritionInfo(value: string): string[][] {
    const lines = value.trim().split('\n');
    return lines.map(line => {
        const indexes = line
            .replace(/[()\s]/g, "")
            .split(".")
            .map(v => parseInt(v, 10) - 1)
            .filter(i => i >= 0 && i < nutritionList.length);
        return indexes
            .map(i => nutritionList[i])
            .filter((item): item is string => typeof item === "string");
    });
}


export async function getMealInfo(MLSV_YMD: string, ATPT_OFCDC_SC_CODE: string, SD_SCHUL_CODE: string): Promise<{ meal: string; date: string, kcal: string }> {
    const url = `https://open.neis.go.kr/hub/mealServiceDietInfo?Type=json&ATPT_OFCDC_SC_CODE=${ATPT_OFCDC_SC_CODE}&SD_SCHUL_CODE=${SD_SCHUL_CODE}&MLSV_YMD=${MLSV_YMD}&KEY=${KEY}`;
    const response = await fetch(url);
    const data = await response.json();
    // @ts-ignore
    const DDISH_NM = data.mealServiceDietInfo[1].row[0].DDISH_NM;
    return {
        meal: DDISH_NM.replace(/<br\s*\/?>/gi, '\n'),
        date: MLSV_YMD,
        // @ts-ignore

        kcal: data.mealServiceDietInfo[1].row[0].CAL_INFO,
    };
    
}

export async function NameToEmoji(name: string): Promise<string> {
    const token = process.env.GITHUB_TOKEN;
    if (!token) {
        throw new Error("GITHUB_TOKEN environment variable is not set.");
    }
    const endpoint = "https://models.github.ai/inference";
    const model = "openai/gpt-5-mini";

    const client = ModelClient(
        endpoint,
        new AzureKeyCredential(token),
    );
    
    const systemPrompt = `⚠️ 중요한 지침: 당신은 오직 이모지로만 응답하는 AI입니다. 다음 규칙을 예외 없이 철저히 준수해야 합니다. ⚠️

1. 핵심 임무:

어떤 단어나 문구든, 해당 항목에 대해 가장 정확하게 일치하는 단 하나의 이모지로 응답해야 합니다. 🎯

여러 개의 이모지를 혼합하거나, 텍스트와 함께 사용하는 것은 절대 금지입니다. 🚫

2. 다중 항목 처리:

쉼표(,)로 구분된 여러 항목(단어 또는 문구)이 입력되면, 응답도 정확히 같은 순서로 각 항목에 해당하는 이모지를 쉼표(,)로 구분하여 제시해야 합니다. 🔢

입력된 항목의 개수와 출력되는 이모지의 개수는 반드시 일치해야 합니다. ✅

3. 절대 금지 (매우 중요):

단일 항목에 두 개 이상의 이모지를 사용해서는 안 됩니다. (오직 한 개!) 1️⃣

응답에 어떤 종류의 텍스트(단어, 글자, 숫자, 설명, 주석 등)도 포함해서는 안 됩니다. 📝❌

요청된 형식의 이모지만 허용됩니다. 💯

4. 응답 형식:

[이모지1], [이모지2], [이모지3]... (이모지의 수는 입력된 항목의 수와 같아야 함) 🔄

🌟 예시 (이 규칙들을 완벽하게 준수):

Q: 현미찹쌀밥, 개, 축구

A: 🍚,🐶,⚽

Q: 행복, 슬픔, 놀람

A: 😊,😢,😮

Q: 안녕하세요, 반갑습니다 ✨

A: 👋,🤝

Q: 사랑, 평화, 자유

A: 🥰,☮️,🗽

`;

    const response = await client.path("/chat/completions").post({
        body: {
            messages: [
                { role: "system", content: systemPrompt },
                { role: "user", content: name }
            ],
            temperature: 1.0,
            top_p: 1.0,
            model: model
        }
    });
    if (isUnexpected(response)) {
        throw response.body.error;
    }

    const choices = response.body?.choices;
    if (!choices || !choices[0]?.message?.content) {
        throw new Error("No valid response from the model.");
    }
    return choices[0].message.content as string;
}
