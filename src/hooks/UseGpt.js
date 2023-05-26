import { computed, ref } from "vue";

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
    const completion = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "user",
          content: `Eres un profesor experto en el tema de Teoria de Conjuntos, dime todas las propiedades de este o estos conjuntos, ${setsInText} se conciso pero logrando captar la mayor atencion y entendimiento posible, como si el explicaras a un niño pero no lo trates como tal`,
        },
      ],
      max_tokens: 300,
    });
    gpt_response.value = completion.data.choices[0].message.content;
    showLoaderExplanation.value = false;
  };

  return {formatResponseHtml, getChatCompletionOpenAi, showLoaderExplanation}

}