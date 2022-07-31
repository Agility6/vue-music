<template>
  <div class="recommend">
    <scroll ref="scroll" class="recommend-content" :data="discList">
      <div>
        <div class="slider-wrapper">
          <slider>
            <div v-for="(item, index) in recommends" :key="index">
              <a :href="item.linkUrl">
                <img class="needsclick" @load="loadImage" :src="item.picUrl" />
              </a>
            </div>
          </slider>
        </div>
        <div class="recommend-list">
          <h1 class="list-title">热门歌单推荐</h1>
          <ul>
            <li class="item" v-for="(item, index) in discList" :key="index">
              <div class="icon">
                <img width="60" height="60" v-lazy="item.imgurl" />
              </div>
              <div class="text">
                <h2 class="name" v-html="item.creator.name"></h2>
                <p class="desc" v-html="item.dissname"></p>
              </div>
            </li>
          </ul>
        </div>
      </div>
      <div class="loading-container" v-show="!discList.length">
        <loading />
      </div>
    </scroll>
  </div>
</template>

<script>
import Slider from "@/base/slider/slider";
import Scroll from "@/base/scroll/scroll"
import Loading from "@/base/loading/loading"
import { getRecommend, getDiscList } from "@/api/recommend";
import { ERR_OK } from "@/api/config";
export default {
  components: {
    Slider,
    Scroll,
    Loading
  },
  data() {
    return {
      /**
       * 模拟_getRecommend获取到的数据
       */
      recommends: [
        {
          linkUrl: "https://y.qq.com/n/ryqq/mv/004eWLVM11VqcV#",
          picUrl:
            "https://y.qq.com/music/common/upload/MUSIC_FOCUS/4402352.jpg?max_age=2592000",
        },
        {
          linkUrl: "https://y.qq.com/n/ryqq/mv/004eWLVM11VqcV#",
          picUrl:
            "https://y.qq.com/music/common/upload/MUSIC_FOCUS/4402352.jpg?max_age=2592000",
        },
        {
          linkUrl: "https://y.qq.com/n/ryqq/mv/004eWLVM11VqcV#",
          picUrl:
            "https://y.qq.com/music/common/upload/MUSIC_FOCUS/4402352.jpg?max_age=2592000",
        },
        {
          linkUrl: "https://y.qq.com/n/ryqq/mv/004eWLVM11VqcV#",
          picUrl:
            "https://y.qq.com/music/common/upload/MUSIC_FOCUS/4402352.jpg?max_age=2592000",
        },
      ],
      discList: [],
    };
  },
  created() {
    /**
     * 这里有一个获取的顺序问题
     * 如果Recommend后获取成功
     * 那么DiscList先成功，传递scroll的data就会撑开整个页面
     * 就会导致滚动不到最后，大约差slider的高度
     */
    this._getRecommend();
    this._getDiscList();
  },
  methods: {
    /**
     * 接口问题无法正常调用
     */
    _getRecommend() {
      getRecommend().then((res) => {
        if (res.code === ERR_OK) {
          console.log(res.code);
        }
      });
    },
    _getDiscList() {
      getDiscList().then((res) => {
        if (res.code === ERR_OK) {
          // 利用props传给scroll中
          this.discList = res.data.list;
        }
      });
    },
    /**
     * 解决recommend后获取导致scroll无法滚动到最后
     * 如果单单的解决recommend与DiscList的获取时间也不可取
     * 因为图片也是需要加载出来的，所以使用load去解决
     * 当图片加载出来的话就再执行scroll中的refresh
     * 当然这里不需要全部图片出来都需要执行一下，一次即可
     */
    loadImage() {
      if(!this.checkLoaded) {
        this.$refs.scroll.refresh()
        this.checkLoaded = true
      }
    }
  },
};
</script>

<style lang="stylus" scoped>
@import ('~@/common/stylus/variable');

.recommend {
  position: fixed;
  width: 100%;
  top: 88px;
  bottom: 0;

  .recommend-content {
    height: 100%;
    overflow: hidden;

    .slider-wrapper {
      position: relative;
      width: 100%;
      overflow: hidden;
    }

    .recommend-list {
      .list-title {
        height: 65px;
        line-height: 65px;
        text-align: center;
        font-size: $font-size-medium;
        color: $color-theme;
      }

      .item {
        display: flex;
        box-sizing: border-box;
        align-items: center;
        padding: 0 20px 20px 20px;

        .icon {
          flex: 0 0 60px;
          width: 60px;
          padding-right: 20px;
        }

        .text {
          display: flex;
          flex-direction: column;
          justify-content: center;
          flex: 1;
          line-height: 20px;
          overflow: hidden;
          font-size: $font-size-medium;

          .name {
            margin-bottom: 10px;
            color: $color-text;
          }

          .desc {
            color: $color-text-d;
          }
        }
      }
    }

    .loading-container {
      position: absolute;
      width: 100%;
      top: 50%;
      transform: translateY(-50%);
    }
  }
}
</style>