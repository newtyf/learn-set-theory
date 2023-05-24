<script setup>
import { onMounted, ref } from "vue";
import { Chart, LinearScale, Tooltip, Legend } from "chart.js";
import {
  VennDiagramController,
  ArcSlice,
  extractSets,
} from "chartjs-chart-venn";

Chart.register(VennDiagramController, ArcSlice, LinearScale, Tooltip, Legend);
Chart.defaults.font.size = 20;
Chart.defaults.color = '#fff';
const setOne = ref("");
const setTwo = ref("");
const showGraphic = ref(false);

let chart = null;

const extractDataForms = () => {
  if (setOne.value.length === 0 || setTwo.value.length === 0) {
    alert("Ingresa los valores del conjunto");
    return null;
  }

  const valuesOne = setOne.value.split(",");
  const valuesTwo = setTwo.value.split(",");
  return { valuesOne, valuesTwo };
};

const showVennGraphic = (event) => {
  event.preventDefault();

  const values = extractDataForms();
  if (!values) {
    return;
  }
  showGraphic.value = true;
  let ctx = document.getElementById("myChart").getContext("2d");

  if (!!chart) {
    chart.destroy();
  }

  const data = extractSets(
    [
      { label: "Soccer", values: values.valuesOne },
      { label: "Tennis", values: values.valuesTwo },
      // { label: "Volleyball", values: ["drew", "glen", "jade"] },
    ],
    {
      label: "Sports",
    }
  );
  const config = {
    type: "venn",
    data: data,
    options: {
      borderColor: [
        "rgba(255, 26, 104, 1)",
        "rgba(54, 162, 235, 1)",
        "rgba(255, 206, 86, 1)",
        "rgba(75, 192, 192, 1)",
        "rgba(153, 102, 255, 1)",
        "rgba(255, 159, 64, 1)",
        "rgba(0, 0, 0, 1)",
      ],
      backgroundColor: "rgba(255, 26, 104, 0)",
    },
  };

  chart = new Chart(ctx, config);
};

onMounted(() => {});
</script>

<template>
  <!-- <Chart :data="config.data" :options="config.options" /> -->
  <h1>Graphic Venn Euler Sets</h1>
  <br />
  <form action="">
    <label for="set1">Ingrese los valores del conjunto 1: </label>
    <input id="set1" type="text" placeholder="1,2,3,4" v-model="setOne" />
    <br />
    <br />
    <label for="set2">Ingrese los valores del conjunto 2: </label>
    <input id="set2" type="text" v-model="setTwo" />
    <br />
    <br />
    <button type="submit" @click="showVennGraphic">Graficar</button>
  </form>
  <div class="graphic">
    <h3>Grafico</h3>
    <canvas
      id="myChart"
      style="{{ showGraphic ? display: block; display: flex; }}"
    ></canvas>
  </div>
</template>

<style scoped>
h1 {
  color: aliceblue;
}
label {
  color: aliceblue;
}
p {
  color: aliceblue;
}
.graphic {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  margin-top: 100px;
  width: 700px;
  padding: 20px;
  border-radius: 20px;
  border: solid 3px rgba(54, 162, 235, 1);
}

#myChart {
  padding: 20px;
}

.graphic h3 {
  margin-bottom: 30px;
  color: aliceblue;
}
</style>
