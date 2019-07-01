<template>
  <div>
    <svg width="100%"
         ref="svg"
         @click.stop="handleSvgClick"
         @dblclick="handleScaleTree"
         @mousedown="handleSvgMouseDown"
         height="100%">
      <defs>
        <g id="collapse">
          <rect x="0"
                y="0"
                rx="4"
                ry="4"
                width="20"
                height="8"
                stroke-width="1"
                style="stroke:var(--baseColor)" />
          <path stroke-dasharray="0,6"
                d="M4 4 h13"
                stroke-width="4"
                fill="none"
                style=""
                stroke-linecap="round" />
        </g>
        <g id="add">
          <rect x="0"
                y="0"
                rx="2"
                ry="2"
                width="16"
                height="16" />
          <path d="M 3,8 h 10 M 8,3 v 10"
                stroke-width="2" />
        </g>
        <linearGradient id="nodeActiveTextBg">
          <stop offset="80%"
                style="stop-color:var(--activeTextBg)" />
          <stop offset="20%"
                stop-color="rgba(0,0,0,0)" />
        </linearGradient>
        <rect id="note"
              x="0"
              y="0"
              width="8"
              rx="4"
              ry="4"
              height="8"
              stroke-width="1"
              style="fill:var(--pannelBg);stroke:var(--warnColor)" />
      </defs>
      <MindNode ref="tree"
                v-if="tree"
                class="tree-wraper"
                x="0"
                y="0"
                :class="{'no-transition':treeNoTransition}"
                :style="`transform:translate(${shiftX}px, ${shiftY}px) scale(${scale})`"
                :node="tree"></MindNode>
    </svg>
    <NotePanel v-if="selectedNode"
               :node="selectedNode" />
    <Menu @zoomBy="handleZoomBy"
          @createTree="handleCreateTree" />
  </div>
</template>
<script>
import MindNode from './MindNode.vue'
import NotePanel from './NotePanel.vue'
import Menu from './Menu.vue'
import { hierarchy } from '../utils/hierarchy'

import { disActiveNode } from '../utils'
import { EVENT } from '../utils/constant'
let svgRect = {}
const scaleMin = 0.1

export default {
  components: {
    MindNode,
    NotePanel,
    Menu
  },
  props: {
    fontWidth: {
      type: Object
    }
  },
  data () {
    return {
      tree: {},
      selectedNode: null,
      scale: 1,
      shiftX: 0,
      shiftY: 0,
      treeEl: null,
      svgEl: null,
      preMousePos: { x: 0, y: 0 },
      treeNoTransition: false
    }
  },
  methods: {
    handleSelectNode (node) {
      this.selectedNode = node
    },
    handleSvgClick () {
      disActiveNode()
      this.selectedNode = null
    },
    handleEmptyTree () {
      this.tree = null
      this.selectedNode = null
    },
    handleScaleTree () {
      this.scale *= 1.5
    },
    _onMouseMove (event) {
      this.shiftX += (event.clientX - this.preMousePos.x)
      this.shiftY += (event.clientY - this.preMousePos.y)
      this.preMousePos = { x: event.clientX, y: event.clientY }
    },
    handleSvgMouseDown (event) {
      this._beforeTransform()
      this.preMousePos = { x: event.clientX, y: event.clientY }
      document.addEventListener('mousemove', this._onMouseMove)
      this.svgEl.onmouseup = () => {
        this._afterTransform()
        document.removeEventListener('mousemove', this._onMouseMove)
        this.svgEl.onmouseup = null
      }
    },
    handleReadFile (event) {
      let file = event.target.files[0]
      let reader = new FileReader()

      reader.readAsText(file)
      reader.onload = () => {
        this.tree = hierarchy(md2json(reader.result), { fontWidth: this.fontWidth })
        this.$nextTick(this._centerTree)
      }

      reader.onerror = function () {
        console.log(reader.error)
      }
    },
    _centerTree () {
      const treeRect = this.treeEl.getBoundingClientRect()
      const svgRect = this.svgEl.getBoundingClientRect()

      if (treeRect.width > svgRect.width || treeRect.height > svgRect.height) {
        const scale = Math.min(svgRect.width / treeRect.width, svgRect.height / treeRect.height)
        // this._zoom(scale)
      }

      this.shiftX = (svgRect.width - treeRect.width) / 2
      this.shiftY = (svgRect.height - treeRect.height) / 2
    },
    _beforeTransform () {
      this.treeNoTransition = true
    },
    _afterTransform () {
      this.treeNoTransition = false
    },
    handleZoomBy (by) {
      this._zoom(this.scale + by)
    },
    _zoom (scale) {
      if (scale > scaleMin) {
        this.scale = scale
      } else {
        this.scale = scaleMin
      }
    },
    handleCreateTree (treeJson) {
      this.tree = hierarchy(treeJson, { fontWidth: this.fontWidth })
      this.$nextTick(this._centerTree)
    }
  },
  created () {
    this.$bus.$on(EVENT.NODE_SELECTED, this.handleSelectNode)
    this.$bus.$on(EVENT.TREE_EMPTY, this.handleEmptyTree)
    this.$bus.$on(EVENT.TREE_REFRESH, () => {
      this.tree = hierarchy(this.tree, { fontWidth: this.fontWidth })
    })

    this.$bus.$on(EVENT.TREE_LOCATE, this._centerTree)
    console.log({ fontWidth: this.fontWidth })
    this.tree = hierarchy({
      'name': 'Top level',
      'note': "```js\n  const name = 'jonge'\n```",
      'children': [
        { 'name': 'Top 2 level -1' },
        {
          'name': 'Top 2 level -2',
          'children': [
            {
              'name': 'Top 3 level -1',
              'note': '## note\n> interesting'
            },
            {
              'name': 'Top 3 level -2'
            }
          ]
        },
        { 'name': 'Top 2 level -3' }
      ]
    }, { fontWidth: this.fontWidth })
  },
  mounted () {
    const vm = this
    this.treeEl = this.$refs.tree.$el
    this.svgEl = this.$refs.svg
    this._centerTree()

    window.addEventListener('resize', () => {
      vm._centerTree()
    })

    window.addEventListener('wheel', (event) => {
      // if(event.target.tagName==='SVG')

      if (event.ctrlKey) {
        event.preventDefault()
        this._beforeTransform()
        this._zoom(-event.deltaY * 0.008)
        this.$nextTick(() => {
          this._afterTransform()
        })
      }
      //  else {
      //   this.shiftX -= event.deltaX * 0.9
      //   this.shiftY -= event.deltaY * 0.9
      // }
    }, { passive: false })
  }
}
</script>

<style lang="scss" scoped>
svg#collapse {
  all: inherit;
}

svg {
  background-color: var(--bgColor);
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  overflow: visible;
  display: flex;
  align-items: center;
  justify-content: center;
  .tree-wraper {
    transition: all 0.2s ease;
    &.no-transition {
      transition: none;
    }
  }
}
</style>
