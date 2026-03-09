import { Weekday } from "@imnyang/comcigan.ts";
import { Meal, Timetable } from "./lib/discord";

async function main() {
  // Tomorrow is 1st of the month
  const today = new Date();
  const YYMMDD = today.toISOString().slice(0, 10).replace(/-/g, "").toString();
  // const YYMMDD = "20250306";
  const weekday = today.getDay() === 0 ? 6 : today.getDay() - 1;
  // const weekday = 2;

  console.log("📅 | date:", YYMMDD);
  console.log("📅 | weekday:", weekday);
  console.timeLog("⏱️ | sunrint");
  await Timetable({
    schoolId: 41896,
    grade: 1,
    classNum: 1,
    weekday: weekday,
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
    ATPT_OFCDC_SC_CODE: "B10",
    SD_SCHUL_CODE: "7010536",
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
