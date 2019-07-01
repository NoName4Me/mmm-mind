export function hierarchy (
  root,
  {
    nodeHeight = 30,
    nodeGap = 100,
    fontWidth = { normal: 8, capital: 10, chinese: 12 },
    paddingLeft = 20,
    paddingRight = 10
  } = {}
) {
  root.x = 0

  function generateX (node) {
    node.w = paddingRight + _getNameWidth(node.name, fontWidth) + paddingLeft
    if (_hasChildren(node)) {
      for (let child of node.children) {
        // o--parent width---o
        //                    \---gap---o----children width----
        // node.x + node.w     + nodeGap
        child.x = node.x + node.w + nodeGap
        generateX(child) // generate children width
      }
    } else {
      node.children = []
    }
  }

  let leafCnt = 0
  function generateY (node) {
    if (_hasChildren(node)) {
      for (let child of node.children) {
        generateY(child)
      }
      const len = node.children.length
      node.y = (node.children[0].y + node.children[len - 1].y) / 2
    } else {
      node.y = leafCnt * nodeHeight
      leafCnt++
    }
  }

  generateX(root)
  generateY(root)
  return root
}

function _hasChildren (node) {
  return node && node.children && node.children.length
}

function _getNameWidth (name, fontWidth) {
  let width = 0
  for (let i = 0; i < name.length; i++) {
    if (/[a-z\d`~!@#$%^&*()-_=+\|\\}\][{'":;/?.>,< ]/.test(name[i])) {
      width += fontWidth.normal
    } else if (/[A-Z]/.test(name[i])) {
      width += fontWidth.capital
    } else {
      width += fontWidth.chinese
    }
  }
  return width || 100
}
