<template>
  <scroll 
    class="listview" 
    :data="data" 
    ref="listview" 
    :listenScroll="listenScroll"
    :probeType="probeType"
    @scroll="scroll">
    <ul>
      <li 
        class="list-group"
        v-for="(group,index) in data" 
        :key="index"
        ref="listGroup"
        >
          <h2 class="list-group-title">{{ group.title }}</h2>
          <ul>
            <li
              class="list-group-item"
              v-for="(item, index) in group.items"
              :key="index">
                <img v-lazy="item.avatar" class="avatar">
                <span class="name">{{ item.name }}</span>
              </li>
          </ul>
        </li>
    </ul>
    <div 
      class="list-shortcut" 
      @touchstart.stop.prevent="onShortcutTouchStart"
      @touchmove.stop.prevent="onShortcutTouchMove">
      <ul>
        <li 
          class="item"
          v-for="(item,index) in shortcutList"
          :key="index"
          :data-index="index"
          :class="{'current': index === currentIndex}"
          >
            {{ item }}
          </li>
      </ul>
    </div>
    <div class="list-fixed" v-show="fixedTitle" ref="fixed">
      <h1 class="fixed-title">{{ fixedTitle }}</h1>
    </div>
    <div v-show="!data.length" class="loading-container">
      <loading />
    </div>
  </scroll>
</template>

<script>
/**
 * 左右联动
 *  - 需要实时的知道滚动的位置
 *  - 计算当前滚动到哪个位置的区间
 *  - 通过区间得到索引
 */
import Scroll from '@/base/scroll/scroll';
import Loading from '@/base/loading/loading'
import { getData } from '@/common/js/dom'

// 每个元素的高度
const ANCHOR_HEIGHT = 18
// 默认title高度
const TITLE_HEIGHT = 30
export default {
  props: {
    data: {
      type: Array,
      default: []
    }
  },
  data() {
    return {
      scrollY: -1,
      // 当前位置
      currentIndex: 0,
      // 顶部title更加流程转变
      diff: -1

    }
  },
  created() {
    /**
     * 为了touchStart与touchMove数据共享
     * 疑惑：为什么不在data中进行呢？
     *  - 因为touch的作用只是为了去访问数据，并不用去监听touch的东西
     */
    this.touch = {}
    // 是否监听滚动事件
    this.listenScroll = true
    // 为 3，任何时候都派发 scroll 事件，包括调用 scrollTo 或者触发 momentum 滚动动画
    this.probeType = 3
    this.listHeight = []
  },
  watch: {
    /**
     * 当我们数据发生变化的时候,计算高度
     * 
     */
    data() {
      setTimeout(() => {
        this._calculateHeight()
      },20)
    },
    /**
     */
    scrollY(newY) {
      const listHeight = this.listHeight
     // 滚动到顶部
     if(newY > 0) {
      this.currentIndex = 0
      return
     }
      /**
       * 中间部分
       * 当newY的大于height1 && newY小于height2時 说明在此区间
       * 
       */
      
      for(let i = 0; i < listHeight.length - 1; i++) {
        let height1 = listHeight[i]
        let height2 = listHeight[i + 1];
        if(-newY >= height1 && -newY < height2) {
          this.currentIndex = i
          // 滚动的上线 - 滚动newY如果
          // console.log(height2, newY);
          this.diff = height2 + newY
          return
        }
      }
      /**
       * 当滚动到底部，且-newY大于最后一个元素的上限
       */  
      this.currentIndex = listHeight.length - 2
    },
    /**
     * 当diff改变
     */
    diff(newVal) {
     let fixedTop = (newVal > 0 && newVal < TITLE_HEIGHT) ? newVal - TITLE_HEIGHT : 0 
     if(this.fixedTop === fixedTop) {
      return
     }
     this.fixedTop = fixedTop
     this.$refs.fixed.style.transform = `translate3d(0,${fixedTop}px,0)`
    } 
  },
  components: {
    Scroll,
    Loading
  },
  methods: {
    /**
     * 获取当前touch的位置
     * 需要在scroll方法中添加方法，使其滚动到响应的位置上去
     */
    onShortcutTouchStart(e) {
      // 获取属性data-index
      let anchorIndex = getData(e.target, 'index')
      // console.log(anchorIndex);
      // 记录y值
      let firstTouch = e.touches[0]
      // 当前点击的index
      this.touch.anchorIndex = anchorIndex
      this.touch.y1 = firstTouch.pageY
      // console.log(e.touches);
      // 调用scrollToElement去到Group具体地方
      this._scrollToElement(anchorIndex)
    },
    /**
     * 监听滑动時数据也跟着改变
     * 思路：需要计算touchStart到touchmove滚动的位置，计算差值
     *    - 在touchStart记录Y值
     * 注意:要阻止冒泡事件，也可以阻止浏览器的原生滚动
     *    - 疑惑~待测试影响啥了) 如果TouchStart不设置重复点击会报错
     */
    onShortcutTouchMove(e) {
      let firstTouch = e.touches[0]
      this.touch.y2 = firstTouch.pageY
      // 偏移量,(|0：向下取整)
      let delta = (this.touch.y2 - this.touch.y1) / ANCHOR_HEIGHT | 0
      // console.log(delta);
      // 注意这里的this.touch.anchorIndex是字符串
      let anchorIndex = parseInt(this.touch.anchorIndex) + delta
      // console.log(anchorIndex);
      this._scrollToElement(anchorIndex)
    },
    /**
     * 需要观测scrollY的数据，因此在data中
     * 将pos中的y赋值给scrollY
     */
    scroll(pos) {
      this.scrollY = pos.y
    },
    /**
     * 封装：调用scrollToElement去到Group具体地方
     * 注意：第二个参数的含义，控制滚动动画的时间
     */
    _scrollToElement(anchorIndex) {
      if(!anchorIndex && anchorIndex !== 0) {
        return
      }
      if(anchorIndex < 0) {
        anchorIndex = 0
      } else if(anchorIndex > this.listHeight.length - 2) {
        anchorIndex = this.listHeight.length - 2
      }
      this.scrollY = -this.listHeight[anchorIndex]
      this.$refs.listview.scrollToElement(this.$refs.listGroup[anchorIndex], 0)
    },
    _calculateHeight() {
      // 再次赋初始值，因为假如data中的数据改变了，watch将会重新执行calculateHeight
      this.listHeight = []

      const list = this.$refs.listGroup
      let height = 0
      this.listHeight.push(height)
      list.forEach((item) => {
        height += item.clientHeight
        this.listHeight.push(height)
      })
    }
  },
  computed: {
    /**
     * 计算shortcut的数据
     */
    shortcutList() {
      return this.data.map((group) => {
        return group.title.substr(0,1)
      })
    },
    /**
     * 滑动时显示每个字母顶部的title
     * 当向上滑动的时候，到达热门就不应该重复显示 
     */
    fixedTitle() { 
      if(this.scrollY > 0 ){
        return
      }
      return this.data[this.currentIndex] ? this.data[this.currentIndex].title : ''
    }
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
@import ('~@/common/stylus/variable');

  .listview
    position: relative
    width: 100%
    height: 100%
    overflow: hidden
    background: $color-background
    .list-group
      padding-bottom: 30px
      .list-group-title
        height: 30px
        line-height: 30px
        padding-left: 20px
        font-size: $font-size-small
        color: $color-text-l
        background: $color-highlight-background
      .list-group-item
        display: flex
        align-items: center
        padding: 20px 0 0 30px
        .avatar
          width: 50px
          height: 50px
          border-radius: 50%
        .name
          margin-left: 20px
          color: $color-text-l
          font-size: $font-size-medium
    .list-shortcut
      position: absolute
      z-index: 30
      right: 0
      top: 50%
      transform: translateY(-50%)
      width: 20px
      padding: 20px 0
      border-radius: 10px
      text-align: center
      background: $color-background-d
      font-family: Helvetica
      .item
        padding: 3px
        line-height: 1
        color: $color-text-l
        font-size: $font-size-small
        &.current
          color: $color-theme
    .list-fixed
      position: absolute
      top: 0
      left: 0
      width: 100%
      .fixed-title
        height: 30px
        line-height: 30px
        padding-left: 20px
        font-size: $font-size-small
        color: $color-text-l
        background: $color-highlight-background
    .loading-container
      position: absolute
      width: 100%
      top: 50%
      transform: translateY(-50%)
</style>