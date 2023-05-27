import { computed, ref } from "vue";
import { message } from "ant-design-vue";

import { Configuration, OpenAIApi } from "openai";
const configuration = new Configuration({
  organization: import.meta.env.VITE_ORG,
  apiKey: import.meta.env.VITE_APIKEY,
});
const openai = new OpenAIApi(configuration);

export function useGpt() {
  const gpt_response = ref("");
  const showLoaderExplanation = ref(false);

  const getFormattedSets = (sets) => {
    let formatSets = "";
    sets.forEach((value) => {
      formatSets += `${value.label} = \{${value.values}\}, `;
    });
    return formatSets;
  };

  const formatResponseHtml = computed(() => {
    let formatted = gpt_response.value.replace(/\\n/g, "<br>").toString();
    return formatted;
  });

  const getChatCompletionOpenAi = async (sets) => {
    // delete configuration.baseOptions.headers["User-Agent"];
    showLoaderExplanation.value = true;
    const setsInText = getFormattedSets(sets);
    try {
      const completion = await openai.createChatCompletion({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "assistant",
            content: `Hola soy un profesor experto en el tema de Teoria de Conjuntos, capaz de dar explicaciones efectivas y logrando captar tu atencion lo mayor posible`,
          },
          {
            role: "user",
            content: `Dame una explicacion y dime todas las propiedades de este o estos conjuntos, ${setsInText}`,
          },
        ],
        max_tokens: 500,
      });
      gpt_response.value = completion.data.choices[0].message.content;
    } catch (error) {
      console.log(error);
      message.error("Hubo un error al generar tu explicacion, intentalo mas tarde 😿")
      showLoaderExplanation.value = false;
    }
    showLoaderExplanation.value = false;
  };

  return { formatResponseHtml, getChatCompletionOpenAi, showLoaderExplanation };
}
