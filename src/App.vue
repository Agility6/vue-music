<template>
  <div id="app">
    <m-header />
    <tab />
    <!-- 避免重复发送请求 -->
    <keep-alive>
      <router-view></router-view>
    </keep-alive>
  </div>
</template>

<script>
import MHeader from '@/components/m-header/m-header'
import Tab from '@/components/tab/tab'
export default {
  components: { 
    MHeader,
    Tab
  }
}
</script>
