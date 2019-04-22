let _id = 0

export class Node {
  constructor () {
    this.name = ''
    this.id = _id++
    this.x = this.y = 0
    this.children = []
    this.note = ''
    this.isCollapse = false
  }
  print () {
    console.log(this.id)
  }
}

export class RawDataNode {
  constructor (name = '', note = '') {
    this.name = name
    this.note = note
  }
}
