<template>
  <div class="note-pannel-wraper">
    <div class="name"></div>
    <div class="content"
         v-html="content"
         contenteditable></div>
  </div>
</template>

<script>
import marked from 'marked'

export default {
  props: {
    node: {
      type: Object
    }
  },
  computed: {
    content () {
      return marked(this.node.note || '')
    }
  },
  data () {
    return {
      name: ''
    }
  }
}
</script>

<style lang="scss" scoped>
.note-pannel-wraper {
  position: fixed;
  top: 0;
  right: 0;
  width: 400px;
  bottom: 0;
  overflow: auto;
  background-color: lightgoldenrodyellow;
  .content {
    &:focus {
      outline: none;
    }
  }
}

</style>


