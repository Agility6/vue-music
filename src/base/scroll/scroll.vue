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
     *  为 3，任何时候都派发 scroll 事件，包括调用 scrollTo 或者触发 momentum 滚动动画
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
    },
    // scroll是否监听滚动事件
    listenScroll: {
      type: Boolean,
      default: false
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

      // 判断是否监听了scroll
      if(this.listenScroll) {
        let me = this
        this.scroll.on('scroll', (pos) => {
          // 派发事件
          me.$emit('scroll', pos)
        })
      }
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
    },
    scrollTo() {
      this.scroll && this.scroll.scrollTo.apply(this.scroll , arguments)
    },
    scrollToElement() {
      this.scroll && this.scroll.scrollToElement.apply(this.scroll, arguments)
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