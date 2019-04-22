<template>
  <div>
    <svg width="100%"
         height="100%">
      <MindNode v-if="tree"
                :node="tree"></MindNode>
    </svg>
    <NotePanel :node="selectedNode" />
  </div>
</template>
<script>
import MindNode from './MindNode.vue'
import NotePanel from './NotePanel.vue'
import { hierarchy } from '../utils/hierarchy'

export default {
  components: {
    MindNode,
    NotePanel
  },
  data () {
    return {
      tree: {},
      selectedNode: {}
    }
  },
  methods:{
    handleSelectNode(node) {
      this.selectedNode = node
    }
  },
  created () {
    this.$bus.$on('node-selected', this.handleSelectNode)
    this.tree = hierarchy({
      "name": "Top level",
      "note": "```js\n  const name = 'jonge'\n```",
      "children": [
        { "name": "Top 2 level -1" },
        {
          "name": "Top 2 level -2",
          "children": [
            {
              "name": "Top 3 level -1",
              "note": "## note\n> interesting"
            },
            {
              "name": "Top 3 level -2"
            }
          ]
        },
        { "name": "Top 2 level -3" }
      ]
    })
  }
}
</script>

<style scoped>
svg {
  overflow: visible;
}
</style>
