<template>
  <div id="app">
    <MindMap />
  </div>
</template>

<script>
import MindMap from './components/MindMap.vue'

export default {
  name: 'app',
  components: {
    MindMap
  }
}
</script>

<style>
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}

:root {
  --baseColor: steelblue;
}
</style>
