<template>
  <g class="node" @click="handleNodeActive"
     @dblclick.stop="handleToggle">
    <path :d="path"></path>
    <path v-if="pNode"
          :d="link"></path>
    <text class="name"
          :x="node.x"
          :y="node.y-5">{{node.name}}</text>
    <circle class="add"></circle>
    <transition name="bloom">
      <g v-if="node.children && !node.isCollapse">
        <MindNode v-for="child in node.children"
                  :pNode="node"
                  :key="child.id"
                  :node="child"></MindNode>
      </g>

    </transition>
  </g>
</template>

<script>
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
  methods: {
    handleToggle () {
      // this.node.isCollapse = !this.node.isCollapse
      this.$set(this.node, 'isCollapse', !this.node.isCollapse)
    },
    handleNodeActive() {
      this
    }
  }
}
</script>

<style scoped>
svg .node {
  fill: none;
  stroke: hotpink;
  stroke-width: 2px;
  stroke-linecap: round;
}

svg .name {
  fill: #333;
  font-size: 12px;
  stroke: none;
}

svg .add {
}

svg .node:hover .add {
}
.bloom-enter-active {
  transition: all .3s ease;
}
.bloom-leave-active {
  transition: all .8s cubic-bezier(1.0, 0.5, 0.8, 1.0);
}

.bloom-enter, .bloom-leave-to {
  transform: translateX(-20px);
  opacity: 0;
}

</style>
