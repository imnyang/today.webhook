import Comcigan, { School, Weekday } from '@imnyang/comcigan.ts'

const comcigan = new Comcigan()

console.log(await School.fromName('선린인터넷고'))

console.log(await comcigan.getTimetable(41896, 1,1, Weekday.Friday))
