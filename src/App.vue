<script setup>
import { ref, computed, h } from "vue";
import {
  MinusCircleOutlined,
  PlusOutlined,
  LoadingOutlined,
} from "@ant-design/icons-vue";
import { message } from "ant-design-vue";

import { extractSets } from "chartjs-chart-venn";

import { useGraphic } from "./hooks/graphic";

import { Configuration, OpenAIApi } from "openai";
const configuration = new Configuration({
  organization: import.meta.env.VITE_ORG,
  apiKey: import.meta.env.VITE_APIKEY,
});
const openai = new OpenAIApi(configuration);

const { createGraphic, showGraphic } = useGraphic();
const showVennGraphic = (data, title) => {
  let ctx = document.getElementById("myChart").getContext("2d");

  const extractData = extractSets(data, {
    label: title,
  });

  createGraphic(ctx, extractData, title);
};

const chat_response = ref("");
const formRef = ref();
const showLoaderExplanation = ref(false);
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
const indicator = h(LoadingOutlined, {
  style: {
    fontSize: "36px",
  },
});

const formatResponseHtml = computed(() => {
  let formatted = chat_response.value.replace(/\\n/g, "<br>").toString();
  return formatted;
});

const getFormattedSets = () => {
  let formatSets = "";
  dynamicValidateForm.value.sets.forEach((value) => {
    formatSets += `${value.label} = \{${value.values}\}, `;
  });
  return formatSets;
};
const getEnginesOpenAi = async () => {
  // delete configuration.baseOptions.headers["User-Agent"];
  showLoaderExplanation.value = true;
  const setsInText = getFormattedSets();
  const completion = await openai.createChatCompletion({
    model: "gpt-3.5-turbo",
    messages: [
      {
        role: "user",
        content: `Eres un profesor experto en el tema de Teoria de Conjuntos, dime todas las propiedades de este o estos conjuntos, ${setsInText} se conciso pero logrando captar la mayor atencion y entendimiento posible, como si el explicaras a un niño pero no lo trates como tal`,
      },
    ],
    max_tokens: 400,
  });
  chat_response.value = completion.data.choices[0].message.content;
  showLoaderExplanation.value = false;
};

const removeSet = (item) => {
  let index = dynamicValidateForm.value.sets.indexOf(item);
  if (index !== -1) {
    dynamicValidateForm.value.sets.splice(index, 1);
  }
};
const addSet = () => {
  if (dynamicValidateForm.value.sets.length == 5) {
    message.error("Solo puede agregar un maximo de 5 conjuntos");
    return;
  }

  dynamicValidateForm.value.sets.push({
    label: "",
    values: "",
    id: Date.now(),
  });
};
const onFinish = (data) => {
  data.sets.map((item) => (item.values = item.values.split(",")));

  if (data.title.length === 0) {
    data.title = "Universo";
  }
  showVennGraphic(data.sets, data.title);
};
</script>

<template>
  <a-layout>
    <!-- <Chart :data="config.data" :options="config.options" /> -->
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
          <a-form
            ref="formRef"
            name="dynamic_form_nest_item"
            :model="dynamicValidateForm"
            @finish="onFinish"
            :label-col="{ span: 24 }"
            :rules="{}"
          >
            <a-form-item name="title">
              <a-input
                v-model:value="dynamicValidateForm.title"
                placeholder="Universo"
              />
            </a-form-item>
            <a-space
              v-for="(set, index) in dynamicValidateForm.sets"
              :key="set.id"
              style="display: flex"
              align="center"
            >
              <a-form-item
                :name="['sets', index, 'label']"
                :rules="{
                  required: true,
                  message: 'Falta conjunto',
                }"
                label="Conjunto:"
              >
                <a-input
                  v-model:value="set.label"
                  placeholder="Nombre de conjunto"
                />
              </a-form-item>
              <a-form-item
                :name="['sets', index, 'values']"
                :rules="{
                  required: true,
                  message: 'Faltan valores',
                }"
                label="Lista de valores"
              >
                <a-input v-model:value="set.values" placeholder="1,2,3,4,5" />
              </a-form-item>
              <MinusCircleOutlined
                style="margin-top: 20px; color: red; font-size: 20px"
                @click="removeSet(set)"
              />
            </a-space>
            <a-form-item>
              <a-button type="dashed" block @click="addSet">
                <PlusOutlined />
                Agregar conjunto
              </a-button>
            </a-form-item>
            <a-form-item>
              <a-button type="primary" block html-type="submit"
                >Graficar</a-button
              >
            </a-form-item>
          </a-form>
        </a-col>
        <a-col :md="14" :xs="24">
          <a-card hoverable>
            <a-card-meta title="Grafico">
              <template #description>
                <a-row v-if="showGraphic">
                  <a-col
                    :md="6"
                    :xs="8"
                    v-for="(set, index) in dynamicValidateForm.sets"
                  >
                    {{
                      set.values.length > 0 || set.label.length > 0
                        ? `${set.label} = \{${set.values}\}`
                        : null
                    }}
                  </a-col>
                  <br />
                  <br />
                  <a-col :span="24"
                    >No entiendes muy bien? solicita la explicacion de un
                    experto aqui!</a-col
                  >
                  <a-col :span="24"
                    ><a-button
                      type="success"
                      html-type="submit"
                      @click="getEnginesOpenAi"
                      style="margin-top: 10px"
                      >Dame una expliacion</a-button
                    >
                  </a-col>
                  <a-col
                    v-if="!showLoaderExplanation"
                    :span="24"
                    style="margin-top: 10px"
                  >
                    <p style="white-space: pre-line; color: #000">
                      -> {{ formatResponseHtml }}
                    </p>
                  </a-col>
                  <a-col style="margin-top: 10px" v-else>
                    <a-spin :indicator="indicator" />
                  </a-col>
                </a-row>
                <a-row v-else> Aun no hay datos para graficar </a-row>
              </template>
            </a-card-meta>
            <template #cover>
              <canvas id="myChart" v-show="showGraphic"></canvas>
            </template>
          </a-card>
          <canvas id="myChart" v-show="showGraphic"></canvas>
        </a-col>
      </a-row>
    </a-layout-content>
  </a-layout>
</template>

<style scoped></style>
