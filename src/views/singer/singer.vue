<template>
  <div class="singer">
    <listview :data="singer" />
  </div>
</template>

<script>
import Listview from '@/base/listview/listview'
import { getSingerList } from '@/api/singer'
import { ERR_OK } from '@/api/config'
import Singer from 'common/js/singer'
// 定义常量
const HOT_NAME = '热门'
const HOT_SINGER_LEN = 10
export default {
  components: {
    Listview
  },
  data() {
    return {
      singer: []
    }
  },
  created() {
    this._getSingerList()
  },
  methods: {
    /**
     * 这里的数据结构需要做操作
     */
    _getSingerList() {
      getSingerList().then((res) => {
        if(res.code === ERR_OK) {
          this.singer = this._normalizeSinger(res.data.list)
        }
      })
    },
    /**
     * 数据进行处理
     * 将singer进行封装
     * 1.热门数据（前十条）
     *  - Fsinger_name
     *  - Fsinger_mid
     * 2.A-Z字母
     */
    _normalizeSinger(list) {
      let map = {
        hot: {
          title: HOT_NAME,
          items: []
        }
      }
      list.forEach((item, index) => {
        if(index<HOT_SINGER_LEN) {
          map.hot.items.push(new Singer({
            id: item.Fsinger_mid,
            name: item.Fsinger_name
          }))
        }
        // 首字母
        const key = item.Findex
        if(!map[key]) {
          map[key] = {
            title: key,
            items: []
          }
        }
        map[key].items.push(new Singer({
            id: item.Fsinger_mid,
            name: item.Fsinger_name
          }))
      });
      // 得到有序列表
      let hot = []
      let ret = []
      for(let key in map) {
        let val = map[key]
        // 字母
        if(val.title.match(/[a-zA-Z]/)) {
          ret.push(val)
          // 热门
        } else if(val.title === HOT_NAME) {
          hot.push(val)
        }
      }
      // 排序
      ret.sort((a,b) => {
        return a.title.charCodeAt(0) - b.title.charCodeAt(0)
      })
      // 合并
      return hot.concat(ret)
    }
  },
}
</script>

<style lang="stylus" scoped>
  .singer
    position: fixed
    top: 88px
    bottom 0
    width: 100%
</style>