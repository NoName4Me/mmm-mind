<template>
  <div class="menu-wrap">
    <button class="menu theme"
            title="night/day theme"
            @click="handleTheme"></button>
    <button class="menu zoom-in"
            title="zoom in"
            @click="handleZoom(scaleInterval)"></button>
    <button class="menu zoom-out"
            title="zoom out"
            @click="handleZoom(-scaleInterval)"></button>
    <button class="menu auto"
            title="auto fit"
            @click="handleAuto"></button>

    <label tabindex="-1"
           title="import from markdown file"
           class="menu import"
           for="invisibleFileReader"></label>
    <input id="invisibleFileReader"
           class="menu"
           type="file"
           @change="handleReadFile">
  </div>
</template>

<script>
const themeMap = {}
import { md2json } from '../utils/md2json'
import { EVENT } from '../utils/constant'

export default {
  data () {
    return {
      scaleInterval: 0.2,
      isNight: false
    }
  },
  mounted () {
    const rootStyle = getComputedStyle(document.documentElement);
    ['night', 'light'].forEach(key => {
      themeMap[key] = {
        bg: rootStyle.getPropertyValue(`--${key}Bg`),
        text: rootStyle.getPropertyValue(`--${key}Text`),
        note: rootStyle.getPropertyValue(`--${key}Note`),
      }
    })

  },
  methods: {
    handleZoom (val) {
      this.$emit('zoomBy', val)
    },
    handleAuto () {
      this.$bus.$emit(EVENT.TREE_LOCATE)
    },
    handleTheme () {
      this.isNight = !this.isNight
      const theme = themeMap[this.isNight ? 'night' : 'light']
      document.documentElement.style.setProperty('--bgColor', theme.bg)
      document.documentElement.style.setProperty('--textColor', theme.text)
      document.documentElement.style.setProperty('--NoteBg', theme.note)
    },
    handleReadFile (event) {
      let file = event.target.files[0]
      let reader = new FileReader()

      reader.readAsText(file)
      reader.onload = () => {
        const treeJson = md2json(reader.result)
        this.$emit('createTree', treeJson)
      }

      reader.onerror = function () {
        console.log(reader.error)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@import "../assets/sass/base.scss";

.menu-wrap {
  position: fixed;
  top: 20px;
  left: 20px;
  display: flex;
  flex-direction: column;
  z-index: $topZ;
  .menu {
    $menuSize: 30px;
    margin-top: 10px;
    display: inline-block;
    width: $menuSize;
    height: $menuSize;
    border-radius: 50%;
    border: none;
    box-shadow: 1px 1px 8px rgba(0, 0, 0, 0.4);
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: white !important;
    &:hover {
      opacity: 0.9;
      color: white;
    }
    &:focus {
      outline: none;
    }
    &:active {
      outline: none;
      background-color: var(--baseColor);
    }
  }
  .zoom-in {
    background: no-repeat center/60% url(../assets/icons/zoom-in.svg);
  }
  .zoom-out {
    background: no-repeat center/60% url(../assets/icons/zoom-out.svg);
  }
  .auto {
    background: no-repeat center/60% url(../assets/icons/auto.svg);
  }
  .import {
    background: no-repeat center/60% url(../assets/icons/import.svg);
  }
  .theme {
    background: no-repeat center/60% url(../assets/icons/theme.svg);
  }
  #invisibleFileReader {
    opacity: 0;
    position: absolute;
    left: -1000px;
    top: -1000px;
  }
}
</style>
