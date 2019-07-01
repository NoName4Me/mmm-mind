<template>
  <g class="node"
     tabindex="0"
     @click.stop="handleNodeActive"
     @dblclick.stop="handleEditName"
     @keydown.delete.stop="handleRemoveNode">
    <path v-if="pNode"
          :d="link"></path>
    <path :d="path"></path>
    <text class="name"
          :x="node.x"
          :y="node.y-5">{{node.name}}</text>
    <use class="collapse"
         @click.stop="handleToggleChildren"
         v-if="hasChild() && node.isCollapse"
         :x="node.x+node.w"
         :y="node.y"
         xlink:href="#collapse" />
    <use :x="node.x+node.w-20"
         :y="node.y-15"
         v-if="node.note"
         xlink:href="#note" />
    <g class="content"
       @mouseover="handleNodeMouseOver"
       @mouseout="handleNodeMouseOut">
      <rect class="fake-node-placeholder"
            :x="node.x"
            :y="node.y-30"
            :width="node.w + addWidth + addShift"
            height="30" />
      <use class="add"
           @click.stop="handleAddNode"
           :x="node.x+node.w + addShift"
           :y="node.y - addWidth"
           xlink:href="#add" />
    </g>
    <transition name="bloom">
      <g v-if="hasChild() && !node.isCollapse">
        <MindNode v-for="(child,idx) in node.children"
                  :pNode="node"
                  :key="`${node.y}_${child.y}_${idx}`"
                  :node="child"></MindNode>
      </g>
    </transition>
  </g>
</template>

<script>
import { hierarchy } from '../utils/hierarchy'
import { disActiveNode } from '../utils'
import { EVENT } from '../utils/constant'
export default {
  name: 'MindNode',
  props: {
    node: {
      type: Object
    },
    pNode: {
      type: Object
    }
  },
  computed: {
    path () {
      const { x, y, w } = this.node
      return `M${x} ${y} h ${w} v 0`
    },
    link () {
      const { x, y } = this.node
      const { x: px, y: y0, w: w0 } = this.pNode
      const x0 = px + w0
      return `M${x0} ${y0}
              C${(x0 + x) / 2} ${y0}, ${(x0 + x) / 2} ${y},
              ${x} ${y}`
    }
  },
  data () {
    return {
      addShift: 4,
      addWidth: 16
    }
  },
  methods: {
    hasChild () {
      return this.node && this.node.children.length
    },
    handleToggleChildren () {
      window.getSelection().removeAllRanges()
      this.$set(this.node, 'isCollapse', !this.node.isCollapse)
    },
    handleEditName (event) {
      this.$set(this.node, 'isCollapse', !this.node.isCollapse)
      // TODO: new vue component and mount it
      // const nameEl = this.$el.querySelector('.name')
      // const { left, top } = nameEl.getBoundingClientRect()
      // const input = document.createElement('input')
      // input.style.display = 'inline-block'
      // input.style.width = this.node.w + 'px'
      // input.style.height = '30px'
      // input.style.position = 'fixed'
      // input.style.left = left + 'px'
      // input.style.top = top + 'px'
      // input.value = this.node.name
      // document.body.append(input)
    },
    handleNodeActive () {
      disActiveNode()
      this.$el.querySelector('.content').classList.add('active')
      this._trigger(EVENT.NODE_SELECTED, this.node)
    },
    handleNodeMouseOver () {
      this.$el.querySelector('.add').classList.add('show')
    },
    handleNodeMouseOut () {
      this.$el.querySelector('.add').classList.remove('show')
    },
    handleAddNode () {
      if (!this.node.children) {
        this.node.children = []
      }
      this.node.children.push({
        name: '',
        children: []
      })
      this._trigger(EVENT.TREE_REFRESH)
    },
    handleRemoveNode () {
      const parent = this.$parent.node
      if (!parent) {
        this._trigger(EVENT.TREE_EMPTY)
      } else {
        for (let i = 0; i < parent.children.length; i++) {
          if (parent.children[i] === this.node) {
            parent.children.splice(i, 1)
            break
          }
        }
        this.$bus.$emit(EVENT.TREE_REFRESH)
      }
    },
    _trigger (event, data) {
      this.$bus.$emit(event, data)
    }
  },
  created () {
  }
}
</script>

<style lang="scss" scoped>
svg {
  .node {
    fill: none;
    stroke: var(--baseColor);
    stroke-width: 2px;
    stroke-linecap: round;
    outline: none;
    &:focus,
    &:active {
      outline: none;
    }
  }
  .name {
    fill: var(--textColor);
    font-size: 12px;
    stroke: none;
  }
  .collapse {
    transition: all 0.2s ease;
    fill: var(--bgColor);
    stroke: var(--baseColor);
    &:hover {
      fill: var(--baseColor);
      stroke: var(--bgColor);
    }
  }
  .add {
    transition: all 0.2s ease;
    fill: var(--bgColor);
    stroke: var(--hintColor);
    visibility: hidden;
    transform: translate(0);
    &:hover {
      fill: var(--bgColor);
      stroke: var(--warnColor);
    }
  }
  .show {
    visibility: visible;
  }
  .fake-node-placeholder {
    stroke: none;
    fill: rgba(0, 0, 0, 0);
    // pointer-events: all;
  }
  .active .fake-node-placeholder {
    fill: url("#nodeActiveTextBg");
  }
}

.bloom-enter-active {
  transition: all 0.3s ease;
}
.bloom-leave-active {
  transition: all 0.8s cubic-bezier(1, 0.5, 0.8, 1);
}

.bloom-enter,
.bloom-leave-to {
  transform: translateX(-20px);
  opacity: 0;
}
</style>
