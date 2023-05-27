<template>
  <a-layout>
    <a-layout-header>
      <a-typography-title
        style="color: aliceblue; margin-top: 8px"
        align="center"
        >Venn Graphic</a-typography-title
      >
    </a-layout-header>
    <br />
    <a-layout-content style="padding: 20px">
      <a-row :gutter="30">
        <a-col :md="10" :xs="24">
          <FormSetsVue
            @show-venn-graphic="(sets, title) => showVennGraphic(sets, title)"
          />
        </a-col>
        <a-col :md="14" :xs="24">
          <a-card>
            <template #cover>
              <canvas id="myChart" v-show="showGraphic"></canvas>
            </template>
            <a-card-meta title="Grafico">
              <template #description>
                <a-row v-if="showGraphic">
                  <span
                    style="margin-right: 20px"
                    v-for="(set, index) in dynamicValidateForm.sets"
                  >
                    {{
                      set.values.length > 0 || set.label.length > 0
                        ? `${set.label} = \{${set.values}\}`
                        : null
                    }}
                  </span>
                  <br />
                  <br />
                </a-row>
                <a-row v-else> Aun no hay datos para graficar </a-row>
                <ExplanatioGptVue v-if="showGraphic" />
              </template>
            </a-card-meta>
          </a-card>
        </a-col>
      </a-row>
    </a-layout-content>
  </a-layout>
</template>

<script setup>
import { ref, provide } from "vue";

import FormSetsVue from "./components/FormSetsVue.vue";
import ExplanatioGptVue from "./components/ExplanatioGpt.vue";
import { message } from "ant-design-vue";

import { useGraphic } from "./hooks/UseGraphic";

const countGraphicsCreated = ref(0);
const dynamicValidateForm = ref({
  title: "",
  sets: [
    {
      label: "",
      values: "",
      id: Date.now(),
    },
  ],
});
provide("dynamicForm", dynamicValidateForm);

const { createGraphic, showGraphic } = useGraphic();
const showVennGraphic = (data, title) => {
  let ctx = document.getElementById("myChart").getContext("2d");
  createGraphic(ctx, data, title);
  if (countGraphicsCreated.value === 0) {
    message.success("🎊 Increible creaste tu primer conjunto! 🥳");
    countGraphicsCreated.value++;
  } else {
    message.success("Grafico actualizado 👽")
  }
};
</script>

<style scoped></style>
