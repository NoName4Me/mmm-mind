import {
  hierarchy
} from '../../src/utils/hierarchy'
import demo from './data/demo.json'

describe('hierarchy.js test', () => {
  it.only('should generate right height', () => {
    hierarchy(demo)
    console.log(demo)
  })
})
