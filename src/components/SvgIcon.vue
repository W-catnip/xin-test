<!--
 * SvgIcon
 * @author: Catnip
 * @since: 2022-12-29
 * src\components\SvgIcon.vue
-->
<template>
  <component :is="currentComponent" :style="{ 'width': width, 'height': height, 'fill': color }">
  </component>
</template>

<script setup>
import { computed } from 'vue';
import { px2vw } from '../utils';

const modules = import.meta.glob('@/assets/svg/*.svg', {
  eager: true
})

const props = defineProps({
  name: {
    type: String,
    required: true,
  },
  width: {
    type: String,
    default: px2vw(21)
  },
  height: {
    type: String,
    default: px2vw(21)
  },
  color: {
    type: String
  }
})

const currentComponent = computed(() => {
  const fileName = '/' + props.name + '.svg';
  for (const path in modules) {
    const mod = modules[path];
    if (path.endsWith(fileName)) {
      return mod;
    }
  }
  throw new Error('not found svg file:' + fileName);
})
</script>

<style lang='less' scoped>

</style>
