import axios from 'axios';

export async function translateText(text) {
    try {
        console.log(`Translating text: ${text}`);
        const response = await axios.get('https://api.mymemory.translated.net/get', {
            params: {
                q: text,
                langpair: 'en|zh'
            }
        });
        const translation = response.data.responseData.translatedText;
        console.log(`Translation successful: ${text} -> ${translation}`);
        return translation;
    } catch (error) {
        console.error('Error translating text:', error);
        return '翻譯失敗';
    }
}
