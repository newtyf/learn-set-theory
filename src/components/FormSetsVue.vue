<template>
  <a-form ref="formRef" name="dynamic_form_nest_item" :model="dynamicValidateForm" @finish="onFinish"
    :label-col="{ span: 24 }" :rules="{}">
    <a-form-item name="title">
      <a-input v-model:value="dynamicValidateForm.title" placeholder="Universo" />
    </a-form-item>
    <a-space v-for="(set, index) in dynamicValidateForm.sets" :key="set.id" style="display: flex" align="center">
      <a-form-item :name="['sets', index, 'label']" :rules="{
        required: true,
        message: 'Falta conjunto',
      }" label="Conjunto:">
        <a-input v-model:value.trim="set.label" placeholder="Nombre de conjunto" />
      </a-form-item>
      <a-form-item :name="['sets', index, 'values']" :rules="{
        required: true,
        message: 'Faltan valores',
      }" label="Lista de valores">
        <a-input v-model:value.trim="set.values" placeholder="1,2,3,4,5" />
      </a-form-item>
      <MinusCircleOutlined style="margin-top: 20px; color: red; font-size: 20px" @click="removeSet(set)" />
    </a-space>
    <a-form-item>
      <a-button type="dashed" block @click="addSet">
        <PlusOutlined />
        Agregar conjunto
      </a-button>
    </a-form-item>
    <a-form-item>
      <a-button type="primary" block html-type="submit">Graficar</a-button>
    </a-form-item>
  </a-form>
</template>

<script setup>
import { inject, ref } from "vue";

import {
  MinusCircleOutlined,
  PlusOutlined,
} from "@ant-design/icons-vue";
import { message } from "ant-design-vue";

const emit = defineEmits(["showVennGraphic"])
const dynamicValidateForm = inject("dynamicForm")
const formRef = ref();

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
  data.sets.map((item) => {
    item.values = item.values.split(",")
  });
  if (data.title.length === 0) {
    data.title = "Universo";
  }
  emit('showVennGraphic', data.sets, data.title)
};
</script>

<style lang="scss" scoped></style>
