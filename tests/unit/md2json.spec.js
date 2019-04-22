const { md2json } = require('../../src/utils/md2json')
const fs = require('fs')
const { resolve } = require('path')

describe('md2json.js test', () => {
  it.only('should generate tree JSON data', () => {
    const text = fs.readFileSync(
      resolve(__dirname, './data/demo.md'),
      'utf-8'
    )
    // console.log(text);
    const tree = md2json(text)
  })
})
