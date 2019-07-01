<template>
  <div id="app">
    <MindMap v-if="fw"
             :fontWidth="fw" />
    <div class="font-measure">
      <span ref="fontCapital">X</span>
      <span ref="font">x</span>
      <span ref="fontChinese">脑</span>
    </div>
  </div>
</template>

<script>
import MindMap from './components/MindMap.vue'

export default {
  name: 'app',
  components: {
    MindMap
  },
  data () {
    return {
      fw: null
    }
  },
  mounted () {
    const rect = this.$refs.font.getBoundingClientRect()
    const capitalRect = this.$refs.fontCapital.getBoundingClientRect()
    const chineseRect = this.$refs.fontChinese.getBoundingClientRect()

    this.fw = {
      normal: rect.right - rect.left,
      capital: capitalRect.right - capitalRect.left,
      chinese: chineseRect.right - chineseRect.left
    }
    console.log(this.fw)
  }
}
</script>

<style lang="scss">
@import './assets/sass/base.scss';

#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  color: var(--textColor);
  margin-top: 60px;
}
.font-measure {
  position: absolute;
  opacity: 0;
  font-size: 12px;
}

</style>
