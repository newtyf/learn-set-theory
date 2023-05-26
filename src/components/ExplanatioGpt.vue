<template>
  <div id="gtp-explanation">
    <p>Sigues sin entender? Solicita la explicacion de un experto aqui!</p>
    <a-button
      type="success"
      html-type="submit"
      @click="getChatCompletionOpenAi(dynamicValidateForm.sets)"
      :disabled="showLoaderExplanation"
      >Dame una expliacion</a-button
    >
    <a-row style="margin-top: 5px">
      <p
        v-if="!showLoaderExplanation"
        style="white-space: pre-line; color: #000"
      >
        -> {{ formatResponseHtml }}
      </p>
      <a-spin style="margin-top: 10px" v-else :indicator="indicator" />
    </a-row>
  </div>
</template>

<script setup>
import { h, inject } from "vue";
import { LoadingOutlined } from "@ant-design/icons-vue";

import { useGpt } from "../hooks/UseGpt";

const dynamicValidateForm = inject("dynamicForm");
const indicator = h(LoadingOutlined, {
  style: {
    fontSize: "36px",
  },
});

const { formatResponseHtml, getChatCompletionOpenAi, showLoaderExplanation } =
  useGpt();
</script>

<style lang="scss" scoped></style>
