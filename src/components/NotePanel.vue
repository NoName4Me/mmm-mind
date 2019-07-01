<template>
  <div class="note-pannel-wraper">
    <textarea class="name"
              @input="handleNameChange"
              type="textarea"
              v-model="node.name"></textarea>
    <div class="line-gap"></div>
    <div class="tabs">
      <div class="tab"
           :class="{active:activeTabName==='preview'}"
           @click="handlePreview">Preview</div>
      <div class="tab"
           :class="{active:activeTabName==='edit'}"
           @click="handleEdit">Edit</div>
    </div>

    <div class="content-wraper">
      <div v-if="isPreview"
           v-html="content"></div>
      <div v-else
           class="editor">
        <div class="line"></div>
        <textarea class="content"
                  v-model="node.note"></textarea>
      </div>
    </div>

  </div>
</template>

<script>
import marked from 'marked'
import { EVENT } from '../utils/constant'

export default {
  props: {
    node: {
      type: Object
    }
  },
  computed: {
    content () {
      return marked(this.node.note || '')
    },
    isPreview () {
      return this.activeTabName === 'preview'
    }
  },
  data () {
    return {
      name: '',
      activeTabName: 'preview'
    }
  },
  methods: {
    handleEdit () {
      this.activeTabName = 'edit'
    },
    handlePreview () {
      this.activeTabName = 'preview'
    },
    handleNameChange () {
      this.$bus.$emit(EVENT.TREE_REFRESH)
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
  background-color: var(--NoteBg);
  padding: 10px;
  box-sizing: border-box;
  font-size: 14px;
  display: flex;
  flex-direction: column;
  box-shadow: -4px 0 8px rgba(0,0,0,0.2);
  .line-gap {
    margin-top: 10px;
    height: 1px;
    background: var(--baseColor);
  }
  .content,
  .name {
    outline: none;
    border: none;
    padding: 10px;
    display: inline-block;
    width: 100%;
    box-sizing: border-box;
    &:focus {
      outline: 1px solid var(--baseColor);
    }
  }
  .name {
    flex: 1 0 40px;
  }
  .tabs {
    display: flex;

    .tab {
      position: relative;
      padding-top: 6px;
      width: 60px;
      text-align: center;
      user-select: none;
      &.active:before {
        content: "";
      }
      &:before {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 2px;
        background-color: var(--baseColor);
      }
    }
  }
  .content-wraper {
    margin-top: 10px;
    padding: 20px 10px;
    position: relative;
    flex: 0 1 100%;
    overflow: auto;
    .editor {
      height: 100%;
    }
    .content {
      height: 100%;
      font-size: 12px;
      font-family: "Courier New", Courier, monospace;
      resize: none;
    }
    // markded custom styles
    // table
    ::v-deep table {
      margin: 10px;
      border-top: 2px solid var(--textColor);
      border-bottom: 2px solid var(--textColor);
      border-collapse: collapse;
      thead th {
        border-bottom: 1px solid var(--textColor);
      }
      td,
      th {
        padding: 5px 10px;
      }
    }
    // inline code
    ::v-deep code {
      border: 1px solid var(--hintColor);
      background-color: var(--activeTextBg);
      padding: 0 4px;
      border-radius: 2px;
    }
    // block code
    ::v-deep pre {
      margin: 10px 0;
      padding: 10px;
      border-radius: 4px;
      border: 1px solid var(--hintColor);
      background-color: var(--activeTextBg);
      & code {
        border: none;
        background-color: unset;
      }
    }
    // quote
    ::v-deep blockquote {
      position: relative;
      padding: 6px 10px;
      overflow: visible;
      margin: 10px;
      &:before {
        content: "";
        position: absolute;
        left: 0px;
        top: 0;
        bottom: 0;
        width: 4px;
        background: var(--hintColor);
      }
    }
    // link
    ::v-deep a {
      position: relative;
      color: var(--baseColor);
      display: inline-block;
      padding: 0 2px;
      transition: all 0.2s ease;
      font-weight: 500;
      &:after {
        position: absolute;
        bottom: -2px;
        left: 0;
        content: "";
        display: inline-block;
        width: 100%;
        height: 1px;
        background: var(--baseColor);
      }
      &:hover {
        background-color: var(--bgColor);
      }
    }
    // image
    ::v-deep img {
      margin: 10px;
      box-shadow: 4px 4px 16px rgba(0, 0, 0, 0.2);
    }
  }
}
</style>
