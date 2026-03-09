import { Weekday } from "@imnyang/comcigan.ts";
import { Meal, Timetable } from "./lib/discord";

async function main() {
  // Tomorrow is 1st of the month
  // 한국 시간 기준으로 날짜 객체 생성
  const now = new Date(new Date().toLocaleString("en-US", { timeZone: "Asia/Seoul" }));
  
  const YYYY = now.getFullYear();
  const MM = String(now.getMonth() + 1).padStart(2, '0');
  const DD = String(now.getDate()).padStart(2, '0');
  const YYMMDD = `${YYYY}${MM}${DD}`;
  
  // getDay(): 일(0) ~ 토(6)
  // comcigan.ts 라이브러리 기준에 맞춰 weekday 설정 필요
  const weekday = now.getDay();

  console.log("📅 | date:", YYMMDD);
  console.log("📅 | weekday:", weekday);
  console.timeLog("⏱️ | sunrint");
  await Timetable({
    schoolId: 41896,
    grade: 1,
    classNum: 0,
    weekday: weekday + 1,
    WEBHOOK_URL: process.env.DISCORD_WEBHOOK_SUNRIN_URL as string
  })
  await Meal({
    MLSV_YMD: YYMMDD,
    ATPT_OFCDC_SC_CODE: "B10",
    SD_SCHUL_CODE: "7010536",
    username: "@today.sunrin",
    schoolName: "선린인터넷고등학교",
    WEBHOOK_URL: process.env.DISCORD_WEBHOOK_SUNRIN_URL as string
  }); // 선린인고
  console.timeEnd("⏱️ | sunrint");

  console.timeLog("⏱️ | sangjeong");
  await Meal({
    MLSV_YMD: YYMMDD,
    ATPT_OFCDC_SC_CODE: "E10",
    SD_SCHUL_CODE: "7310342",
    username: "@today.isangjeong",
    schoolName: "상정고등학교",
    WEBHOOK_URL: process.env.DISCORD_WEBHOOK_SANGJEONG_URL as string
  }); // 상정고
  console.timeEnd("⏱️ | sangjeong");
};

main().catch((error) => {
  console.error("Error in main function:", error);
  process.exit(1);
});
