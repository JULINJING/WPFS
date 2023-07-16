import axios from 'axios';

const API_KEY = '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';//open AI key
const MODEL = 'text-davinci-002';//使用的语言模型

const api = axios.create({
    baseURL: 'https://api.openai.com/v1/',
    headers: {
        Authorization: `Bearer ${API_KEY}`,
        'Content-Type': 'application/json',
    },
});

async function generateText(prompt) {
    try {
        const response = await api.post(`/engines/${MODEL}/completions`, {
            prompt: prompt,//问的问题
            max_tokens: 1024,
            n: 1,
            stop: '\n',
        });
        return response.data.choices[0].text.trim();
    } catch (error) {
        console.error('OpenAI API request failed: ', error);
        throw error;
    }
}

export default {
    generateText,
};