import getTimetable from "./comcigan";
import { getMealInfo, NameToEmoji, removeNutritionInfo } from "./meal";

export async function Meal({ MLSV_YMD, ATPT_OFCDC_SC_CODE, SD_SCHUL_CODE, username, schoolName, WEBHOOK_URL }: { MLSV_YMD: string, ATPT_OFCDC_SC_CODE: string, SD_SCHUL_CODE: string, username: string, schoolName: string, WEBHOOK_URL: string }) {
  const mealInfo = await getMealInfo(MLSV_YMD, ATPT_OFCDC_SC_CODE, SD_SCHUL_CODE);
  //const isVTS = vts.VTS임(MLSV_YMD);

  const lines = removeNutritionInfo(mealInfo.meal).split("\n");
  let emojis = (await NameToEmoji(lines.toString())).split(",");

  const data = {
    content: `${MLSV_YMD.slice(0, 4)}년 ${MLSV_YMD.slice(4, 6)}월 ${MLSV_YMD.slice(6, 8)}일 급식 정보`,
    username: username,
    embeds: [
      {
        title: `🏫 | ${schoolName}`,
        description: lines.map((line, index) => `${emojis[index] || "❓"} ${line}`).join("\n"),
        footer: {
          text: `🔥 ${mealInfo.kcal}`
        }
      },
    ],
  };

  console.log("🏓 | Sending Payload");
  const response = await fetch(WEBHOOK_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    console.error("Error sending Discord webhook:", response.statusText);
  } else {
    console.log(`✨ | Payload successfully sent, code ${response.status}`);
  }
}


export async function Timetable({ schoolId, grade, classNum, weekday, WEBHOOK_URL }: { schoolId: number, grade: number, classNum: number, weekday: number, WEBHOOK_URL: string }) {
  const timetableInfo = await getTimetable({ schoolId, grade, classNum, weekday });

  console.log("🏓 | Timetable Info Retrieved", timetableInfo);
  const data = {
    content: `📅 | ${grade}학년 ${classNum}반 시간표 정보`,
    embeds: [
      {
        title: `🏫 | 학교 : 선린인터넷고등학교`,
        fields: (timetableInfo ?? []).map((item) => ({
          name: `${item.subject}${item.changed ? (" *") : ""}`,
          value: item.teacher,
          inline: false,
        })),
        footer: {
          text: `${["월", "화", "수", "목", "금"][weekday - 1]}요일 시간표 정보`
        }
      },
    ],
  };

  console.log("🏓 | Sending Payload");
  const response = await fetch(WEBHOOK_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    console.error("Error sending Discord webhook:", response.statusText);
  } else {
    console.log(`✨ | Payload successfully sent, code ${response.status}`);
  }
}