<script setup lang="ts">
import { SkyButton, SkyDivider, SkyIcon, SkyImage, SkyLink, SkySpace, SkyText, Minus, Plus } from '@'
</script>

<template>
  <div class="margin: 0 25px">
    <sky-button>test</sky-button>
    <sky-button type="primary">test</sky-button>
    <sky-button type="info">test</sky-button>
    <sky-button type="success">test</sky-button>
    <sky-button type="warning">test</sky-button>
    <sky-button type="danger">test</sky-button>
  </div>
  <div class="margin: 0 25px">
    <sky-button round>test</sky-button>
    <sky-button type="primary" round>test</sky-button>
    <sky-button type="info" round>test</sky-button>
    <sky-button type="success" round>test</sky-button>
    <sky-button type="warning" round>test</sky-button>
    <sky-button type="danger" round>test</sky-button>
  </div>
  <div class="margin: 0 25px">
    <sky-button circle>test</sky-button>
    <sky-button type="primary" circle>test</sky-button>
    <sky-button type="info" circle>test</sky-button>
    <sky-button type="success" circle>test</sky-button>
    <sky-button type="warning" circle>test</sky-button>
    <sky-button type="danger" circle>test</sky-button>
  </div>
  <div class="margin: 0 25px">
    <sky-button disabled>test</sky-button>
    <sky-button type="primary" disabled>test</sky-button>
    <sky-button type="info" disabled>test</sky-button>
    <sky-button type="success" disabled>test</sky-button>
    <sky-button type="warning" disabled>test</sky-button>
    <sky-button type="danger" disabled>test</sky-button>
  </div>
  <div class="margin: 0 25px">
    <sky-button plain>test</sky-button>
    <sky-button type="primary" plain>test</sky-button>
    <sky-button type="info" plain>test</sky-button>
    <sky-button type="success" plain>test</sky-button>
    <sky-button type="warning" plain>test</sky-button>
    <sky-button type="danger" plain>test</sky-button>
  </div>
  <div class="margin: 0 25px">
    <sky-button>test</sky-button>
    <sky-button size="small">test</sky-button>
    <sky-button size="large">test</sky-button>
  </div>
  <div class="margin: 0 25px">
    <sky-button block>test</sky-button>
  </div>
  <div class="margin: 0 25px">
    <sky-button :icon="Plus">test</sky-button>
    <sky-button>
      test
      <template #icon>
        <Plus />
      </template>
    </sky-button>
  </div>
  <div class="margin: 0 25px">
    <sky-divider />
    <sky-divider>test</sky-divider>
    <sky-divider position="left">test</sky-divider>
    <sky-divider position="right">test</sky-divider>
  </div>
  <div class="margin: 0 25px">
    test
    <sky-divider direction="vertical" />
    test
  </div>
  <div class="margin: 0 25px">
    <sky-link href="#">test</sky-link>
    <sky-link href="#" type="primary">test</sky-link>
    <sky-link href="#" type="info">test</sky-link>
    <sky-link href="#" type="success">test</sky-link>
    <sky-link href="#" type="warning">test</sky-link>
    <sky-link href="#" type="danger">test</sky-link>
  </div>
  <div class="margin: 0 25px">
    <sky-link href="#" disabled>test</sky-link>
    <sky-link href="#" type="primary" disabled>test</sky-link>
    <sky-link href="#" type="info" disabled>test</sky-link>
    <sky-link href="#" type="success" disabled>test</sky-link>
    <sky-link href="#" type="warning" disabled>test</sky-link>
    <sky-link href="#" type="danger" disabled>test</sky-link>
  </div>
  <div class="margin: 0 25px">
    <sky-link href="#" :underline="false">test</sky-link>
    <sky-link href="#" type="primary" :underline="false">test</sky-link>
    <sky-link href="#" type="info" :underline="false">test</sky-link>
    <sky-link href="#" type="success" :underline="false">test</sky-link>
    <sky-link href="#" type="warning" :underline="false">test</sky-link>
    <sky-link href="#" type="danger" :underline="false">test</sky-link>
  </div>
  <div class="margin: 0 25px">
    <sky-link href="#">test</sky-link>
    <sky-link href="#" size="large">test</sky-link>
    <sky-link href="#" size="small">test</sky-link>
  </div>
  <div class="margin: 0 25px">
    <sky-text>test</sky-text>
    <sky-text type="primary">test</sky-text>
    <sky-text type="info">test</sky-text>
    <sky-text type="success">test</sky-text>
    <sky-text type="warning">test</sky-text>
    <sky-text type="danger">test</sky-text>
  </div>
  <div class="margin: 0 25px">
    <sky-text>test</sky-text>
    <sky-text size="large">test</sky-text>
    <sky-text size="small">test</sky-text>
  </div>
  <div class="margin: 0 25px">
    <sky-space>
      <div>test</div>
      <div>test</div>
      <div>test</div>
    </sky-space>
  </div>
  <div class="margin: 0 25px">
    <sky-space direction="vertical">
      <div>test</div>
      <div>test</div>
      <div>test</div>
    </sky-space>
  </div>
  <div class="margin: 0 25px">
    <sky-icon>
      <Minus />
    </sky-icon>
    <sky-icon :size="25">
      <Plus />
    </sky-icon>
  </div>
  <div class="margin: 0 25px">
    <sky-image src="https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg" :width="100" :height="100" />
  </div>
  <div class="margin: 0 25px">
    <sky-image src="https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg" :width="100" :height="100">
      <template #placeholder>
        <span>placeholder</span>
      </template>
    </sky-image>
  </div>
  <div class="margin: 0 25px">
    <sky-image src="xxx" :width="100" :height="100">
      <template #error>
        <span>error</span>
      </template>
    </sky-image>
  </div>
</template>

<style scoped lang="scss"></style>
