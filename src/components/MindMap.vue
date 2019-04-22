<template>
  <svg width="100%" height="100%">
    <MindNode v-if="tree" :node="tree"></MindNode>
  </svg>
</template>
<script>
import MindNode from './MindNode'
import demo from './demo.json'
import { hierarchy } from './hierarchy'

export default {
  components: {
    MindNode
  },
  data () {
    return {
      tree: {
        name: 'Top Level',
        x: 10,
        y: 50,
        w: 100,
        children: [
          { name: 'Top 2 Level-1', x: 180, y: 20, w: 200 },
          { name: 'Top 2 Level-2', x: 180, y: 70, w: 180 }
        ]
      }
    }
  },
  created () {
    console.log(demo)
    hierarchy(demo)
    this.tree = demo
  }
}
</script>

<style scoped>
svg {
  overflow: visible;
}
</style>

