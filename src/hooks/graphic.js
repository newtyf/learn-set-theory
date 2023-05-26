import { Chart, LinearScale, Title, Tooltip } from "chart.js";
import { ArcSlice, VennDiagramController } from "chartjs-chart-venn";
import { ref } from "vue";

Chart.register(VennDiagramController, ArcSlice, LinearScale, Tooltip, Title);
Chart.defaults.font.size = 14;
Chart.defaults.color = "#000";

const defaultConfig = {
  type: "venn",
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
    hoverBackgroundColor: [
      "#e74c3c",
      "#2980b9",
      "#f1c40f",
      "#2ecc71",
      "#2ecc71",
      "#2ecc71",
      "#8e44ad",
    ],
    layout: {
      padding: 20,
    },
    borderWidth: 2,
    plugins: {
      tooltip: {
        backgroundColor: "#000",
      },
      title: {
        display: true,
        text: "Custom Chart Title",
      },
    },
  },
};

export function useGraphic() {
  const showGraphic = ref(false);

  let chart;
  const createGraphic = (ctx, data, title = "Universo", config = defaultConfig) => {
    if (!ctx) {
      throw new Error("ctx is required");
    }
    if (!data) {
      throw new Error("data not found");
    }

    config.data = data;
    config.options.plugins.title.text = title
    if (!chart) {
      chart = new Chart(ctx, config);
    }
    chart.update();
    showGraphic.value = true;
  };

  return { createGraphic, showGraphic };
}
