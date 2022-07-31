<template>
  <div ref="wrapper">
    <slot></slot>
  </div>
</template>

<script>
import BScroll from 'better-scroll'
export default {
  props: {
    /**
     *  决定是否派发 scroll 事件
     *  为 1，仅仅当手指按在滚动区域上，每隔 momentumLimitTime 毫秒派发一次 scroll 事件
     */
    probeType: {
      type: Number,
      default: 1
    },
    click: {
      type: Boolean,
      default: true
    },
    data: {
      type: Array,
      default: null
    }
  },
  mounted() {
    setTimeout(() => {
      this._initScroll()
    },20)
  },
  methods: {
    /**
     * 没有数据的时候直接返回
     */
    _initScroll() {
      if(!this.$refs.wrapper) {
        return
      }
      this.scroll = new BScroll(this.$refs.wrapper, {
        probeType: this.probeType,
        click: this.click
      })
    },

    /**
     * 如果scroll存在则执行
     */
    enable() {
      this.scroll && this.scroll.enable()
    },
    disable() {
      this.scroll && this.scroll.disable()
    },
    // 重新计算
    refresh() {
      this.scroll && this.scroll.refresh()
    }
  },
  watch: {
    /**
     * 侦听data的变化，自动进行
     */
    data() {
      setTimeout(() => {
        this.refresh()
      },20)
    }
  }
}
</script>

<style>

</style>