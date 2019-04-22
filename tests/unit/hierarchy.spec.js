import {
  hierarchy
} from '../../src/components/hierarchy'
import demo from '../../src/components/demo.json'

describe('hierarchy.js test', () => {
  it.only('should generate right height', () => {
    hierarchy(demo)
    console.log(demo)
  })
})
