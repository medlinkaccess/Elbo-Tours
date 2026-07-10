import { readFileSync } from 'fs'
const tours = JSON.parse(readFileSync('./data/tours.json', 'utf8'))
console.log(JSON.stringify(tours[0], null, 2))