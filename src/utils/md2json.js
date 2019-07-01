import { RawDataNode } from '../model/Node'

/**
 * markdown format
 *
 * NODE: node must be divided by empty line, space is forbidden, differentiating from note content
 * NOTE: every line of note content should have the same start indent, see [demo.md](./demo.md)
 *
 * @param {*} text
 */
export function md2json (text, indentSize = 2) {
  const lines = text.split(/\r?\n/)
  const data = new RawDataNode()
  let isInNote = false
  let currentNode = data
  let preInDentLen = 0

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]

    if (/^()$/.test(line)) {
      // a new node will be create by next (n) lines
      isInNote = false
      continue
    }

    if (isInNote) {
      // append line to note
      currentNode.note += line.slice(preInDentLen * indentSize + 1) + '\n'
      continue
    }

    const regRes = /([ ]{0,})([#-]{1,}) +(.*)/.exec(line)
    if (!regRes) {
      // invalid format linet, ignore
      console.warn('get an invalid format line: ', line)
      continue
    }

    isInNote = true

    const [, indent, prefix, name] = regRes

    // `#`, `##`, `###` no need dealing with indent, they are Level 1, Level 2, Level 3
    // `-` should handle indent for Level N > 3
    switch (prefix) {
      case '#':
        currentNode.name = name
        currentNode.depth = 0
        preInDentLen = 0
        break
      case '##':
        currentNode = _handleCreateNode(name, 1, currentNode)
        preInDentLen = 0
        break
      case '###':
        currentNode = _handleCreateNode(name, 2, currentNode)
        preInDentLen = 0
        break
      case '-':
        preInDentLen = (indent.length / indentSize) | 0
        currentNode = _handleCreateNode(name, preInDentLen + 3, currentNode)
    }
  }
  return data
}

function _backwardForward (current, moves) {
  return moves.reduce((node, move) => {
    return node[move]
  }, current)
}

function _handleCreateNode (name, depth, currentNode) {
  const node = new RawDataNode(name)
  node.depth = depth
  const depthDiff = depth - currentNode.depth
  let anchorNode = currentNode // default: new node is currentNode's child
  if (depthDiff !== 1) {
    // new node is current node's sibling node, === 0
    // new node is current ndoe's parent(*n)'s child, < 0
    const moves = new Array(Math.abs(depthDiff) + 1).fill('parent')
    anchorNode = _backwardForward(currentNode, moves)
  }

  node.parent = anchorNode
  if (!anchorNode.children) {
    anchorNode.children = []
  }
  anchorNode.children.push(node)
  return node
}
