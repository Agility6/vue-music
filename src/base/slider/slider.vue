<template>
  <div class="slider" ref="slider">
    <div class="slider-group" ref="sliderGroup">
      <slot></slot>  
    </div>
    <div class="dots">
      <span 
        class="dot"
        v-for="(item, index) in dots"
        :key="index"
        :class="{active: currentPageIndex === index}">
        </span>
    </div>
  </div>
</template>

<script>
import BScroll from 'better-scroll'
import {addClass} from '@/common/js/dom'
export default {
  props: {
    // 循环轮播
    loop: {
      type: Boolean,
      default: true
    },
    // 自动轮播
    autoPlay: {
      type: Boolean,
      default: true
    },
    // 轮播的间隔
    interval: {
      type: Number,
      default: 2000
    }
  },
  data() {
    return {
      dots: [],
      currentPageIndex: 0
    }
  },
  mounted() {
    // 等DOM刷新完
    setTimeout(() => {
      this._setSliderWidth()
      /**
       * 这里注意一下initDots的时候是根据children.length的长度去进行的
       * 如果先initSlider的话，并且使用了loop就会导致children.length多
       * 可以自己实验！
       */
      this._initDots()
      this._initSlider()

      /**
       * 判断是否自动播放
       */
      if(this.autoPlay) {
        this._play()
      }
    },20)

    /**
     * 如果slider还没有初始化的时候就直接return
     */
    window.addEventListener('resize', () =>{
      if(!this.slider) {
        return
      }
      /**
       * 注意这里重新去计算_setSliderWidth()
       * 如果有loop会再次计算加宽度，这个是不行的！
       * 所以加入了标记isResize
       */
      this._setSliderWidth(true)
      /*
      * better-scroll
      * 宽度发生变化时重新计算
      */
      this.slider.refresh()
    })
  },
  methods: {
    /**
     * 设置轮播的宽度
     * 当我们改变视窗的时候 宽度也需要改变
     * 所以在mounted监听window事件
     * isResize：判断是否是改变视窗
     */ 
    _setSliderWidth(isResize) {
      // 获取sliderGroup的children
      this.children = this.$refs.sliderGroup.children 
      // 计算sliderGroup的宽度
      let width = 0
      let sliderWidth = this.$refs.slider.clientWidth
      for(let i = 0 ; i < this.children.length; i++) {
        let child = this.children[i]
        /**
         * 这里有一个问题！
         * 如果数据是后台请求，属于异步操作，这样就会导致sliderGroup没有元素
         * 这样就会失效了
         * 
         * 解决办法：
         * 可以在recommend中增加v-if去判断，数据.length是否大于零
         * 大于才进行渲染
         */
        addClass(child, 'slider-item')
        child.style.width = sliderWidth + 'px'
        width += sliderWidth
      }

      /**
       * 如果loop为true
       * 宽度需要增加，这样循环就可以连续
       */
      if(this.loop && !isResize) {
        width += 2 * sliderWidth
      }
      this.$refs.sliderGroup.style.width = width + 'px'
    },
    // 初始化轮播图
    _initSlider() {
      /**
       * 
       */
      this.slider = new BScroll(this.$refs.slider,{
        scrollX: true,
        scrollY: false,
        momentum: false,
        snap: true,
        snapLoop: this.loop,
        snapThreshold: 0.3,
        snapSpeed: 400
      })
      // 维护currentPageIndex
      /**
       * better-scroll会派发一个事件
       */
      this.slider.on('scrollEnd', () => {
        let pageIndex = this.slider .getCurrentPage().pageX
        // 如果是循环的pageIndex需要减1
        if(this.loop) {
          pageIndex -= 1
        }
        this.currentPageIndex = pageIndex
        
        /**
         * 自动播放遇到手动滑动~
         * 这里需要先移除自动播放的任务
         * 
         */
        if(this.autoPlay) {
          clearTimeout(this.timer)
          this._play()
        }
        })
    },
    // 初始化dots
    _initDots() {
      this.dots = new Array(this.children.length)
    },
    _play() {
      let pageIndex = this.currentPageIndex + 1
      // 因为有副本 所以循环的时候需要再+1
      if(this.loop) {
        pageIndex += 1
      }
      this.timer = setTimeout(() => {
        /**
         * better-scroll有的
         * 0：是Y轴方向
         * 400：是X轴方向
         */
        this.slider.goToPage(pageIndex, 0, 400)
      },this.interval) 
    }
  },
  
  destroyed() {
    clearTimeout(this.timer)
  }
}
</script>

<style lang="stylus" scoped>
  @import ('~@/common/stylus/variable')
  .slider
    min-height: 1px
    .slider-group
      position: relative
      overflow: hidden
      white-space: nowrap
      .slider-item
        float: left
        box-sizing: border-box
        overflow: hidden
        text-align: center
        a
          display: block
          width: 100%
          overflow: hidden
          text-decoration: none
        img
          display: block
          width: 100%
    .dots
      position: absolute
      right: 0
      left: 0
      bottom: 12px
      text-align: center
      font-size: 0
      .dot
        display: inline-block
        margin: 0 4px
        width: 8px
        height: 8px
        border-radius: 50%
        background: $color-text-l
        &.active
          width: 20px
          border-radius: 5px
          background: $color-text-ll
</style>