<!--
 * Explain
 * @author: Catnip
 * @since: 2023-01-04
 * src\components\Explain.vue
-->
<template>
  <div class="container">
    <div class="answer">答案：{{ answer }}</div>
    <div>
      <div class="label">试题分析</div>
      <div class="explain">{{ explain }}</div>
    </div>
  </div>
  <div class="gap"></div>
</template>

<script setup>
const props = defineProps({
  answer: {
    type: String
  },
  explain: {
    type: String
  }
})
</script>

<style lang='less' scoped>
.container {
  margin-top: 6px;

  .answer {
    font-size: @main_fs;
    padding-bottom: 5px;
    border-bottom: 1px solid #ddd;
  }

  .label::before {
    content: '';
    display: inline-block;
    vertical-align: middle;
    width: 5px;
    height: 14px;
    background-color: green;
    margin-right: 10px;
  }

  .label {
    margin: 10px 0;
    font-size: @main_fs;
  }

  .explain {
    text-indent: 2em;
    font-size: @main_fs;
    padding: 20px;
    background-color: #f1f1f1;
    border-radius: 10px;
  }
}

.gap {
  height: 42px;
  width: 100%;
  background-color: #fff;
}
</style>
