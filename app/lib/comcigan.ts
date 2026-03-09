import Comcigan from '@imnyang/comcigan.ts'

export async function getTimetable({ schoolId, grade, classNum, weekday }: { schoolId: number, grade: number, classNum: number, weekday: number }) {
    const comcigan = new Comcigan()

    return await comcigan.getTimetable(schoolId, grade, classNum, weekday, false)
}

export const room = {
    "프밍": "332호실",
    "컴구": "333호실",
    "체육": "운동장",
    "정통": "411호실",
    "음악": "음악실"
}