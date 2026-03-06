import Comcigan, { School, Weekday } from '@imnyang/comcigan.ts'

const comcigan = new Comcigan()

export default async function getTimetable({ schoolId, grade, classNum, weekday }: { schoolId: number, grade: number, classNum: number, weekday: number }) {
    return await comcigan.getTimetable(schoolId, grade, classNum, weekday, false)
}
