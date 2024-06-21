import 'dotenv/config';
import linebot from 'linebot';
import { getDailyTarot } from './commands/getDailyTarot.js';
import { getThreeCardTarot } from './commands/getThreeCardTarot.js';

const bot = linebot({
    channelId: process.env.CHANNEL_ID,
    channelSecret: process.env.CHANNEL_SECRET,
    channelAccessToken: process.env.CHANNEL_ACCESS_TOKEN
});

function getTarotOptions() {
    return {
        type: 'flex',
        altText: '請選擇占卜類型',
        contents: {
            type: 'bubble',
            body: {
                type: 'box',
                layout: 'vertical',
                contents: [
                    {
                        type: 'text',
                        text: '今天要小桃算蝦米！',
                        weight: 'bold',
                        size: 'xl',
                        align: 'center'
                    },
                    {
                        type: 'box',
                        layout: 'vertical',
                        margin: 'lg',
                        spacing: 'sm',
                        contents: [
                            {
                                type: 'button',
                                style: 'link',
                                height: 'sm',
                                action: {
                                    type: 'message',
                                    label: '我想算今日運勢！',
                                    text: '想算每日運勢！'
                                }
                            },
                            {
                                type: 'button',
                                style: 'link',
                                height: 'sm',
                                action: {
                                    type: 'message',
                                    label: '我想算三張牌牌陣！',
                                    text: '想算三張牌牌陣！'
                                }
                            }
                        ]
                    }
                ]
            }
        }
    };
}

function getThreeCardOptions() {
    const options = ['事業', '學業', '戀愛', '金錢', '健康'];

    return {
        type: 'flex',
        altText: '選擇三張牌牌陣的範疇',
        contents: {
            type: 'bubble',
            body: {
                type: 'box',
                layout: 'vertical',
                contents: [
                    {
                        type: 'text',
                        text: '想算蝦米代誌挖！',
                        weight: 'bold',
                        size: 'xl',
                        align: 'center'
                    },
                    {
                        type: 'box',
                        layout: 'vertical',
                        margin: 'lg',
                        spacing: 'sm',
                        contents: options.map(option => ({
                            type: 'button',
                            style: 'link',
                            height: 'sm',
                            action: {
                                type: 'message',
                                label: `今天想算${option}運！`,
                                text: `今天想算${option}運！`
                            }
                        }))
                    }
                ]
            }
        }
    };
}

function getReadyConfirmation() {
    return {
        type: 'flex',
        altText: '心中默念問題，你準備好了嗎？',
        contents: {
            type: 'bubble',
            body: {
                type: 'box',
                layout: 'vertical',
                contents: [
                    {
                        type: 'text',
                        text: '心中默念問題，',
                        weight: 'bold',
                        size: 'xl',
                        align: 'center'
                    },
                    {
                        type: 'text',
                        text: '你準備好了嗎？',
                        weight: 'bold',
                        size: 'xl',
                        align: 'center'
                    },
                    {
                        type: 'box',
                        layout: 'vertical',
                        margin: 'lg',
                        spacing: 'sm',
                        contents: [
                            {
                                type: 'button',
                                style: 'primary',
                                height: 'sm',
                                action: {
                                    type: 'message',
                                    label: '我準備好了！',
                                    text: '我準備好了！'
                                }
                            },
                            {
                                type: 'button',
                                style: 'secondary',
                                height: 'sm',
                                action: {
                                    type: 'message',
                                    label: '我還沒準備好！',
                                    text: '我還沒準備好！'
                                }
                            }
                        ]
                    }
                ]
            }
        }
    };
}

const welcomeMessage = '不必害羞！需要占卜找桃桃！\n需要小桃幫幫就喊"小桃幫我算！"';

bot.on('follow', async (event) => {
    event.reply(welcomeMessage);
});

bot.on('join', async (event) => {
    event.reply(welcomeMessage);
});

bot.on('message', async (event) => {
    const userMessage = event.message.text.trim();
    console.log(`Received message: ${userMessage}`);

    if (userMessage === '小桃幫我算！') {
        const tarotOptions = getTarotOptions();
        event.reply(tarotOptions);
    } else if (userMessage === '想算每日運勢！' || userMessage === '重新算每日運勢') {
        const readyConfirmation = getReadyConfirmation();
        event.reply(readyConfirmation);
    } else if (userMessage === '我準備好了！') {
        try {
            const tarotResponse = await getDailyTarot();
            console.log(`Replying with daily tarot: ${JSON.stringify(tarotResponse)}`);
            event.reply({
                type: 'flex',
                altText: '今日運勢',
                contents: tarotResponse
            });
        } catch (error) {
            console.error('Error replying with daily tarot:', error);
            event.reply('無法獲取塔羅牌讀數');
        }
    } else if (userMessage === '我還沒準備好！') {
        event.reply('準備好再跟小桃說！\n沒事不要吵小桃！');
    } else if (userMessage === '想算三張牌牌陣！' || userMessage === '重新算三張牌牌陣') {
        const threeCardOptions = getThreeCardOptions();
        event.reply(threeCardOptions);
    } else if (['今天想算事業運！', '今天想算學業運！', '今天想算戀愛運！', '今天想算金錢運！', '今天想算健康運！'].includes(userMessage)) {
        try {
            const tarotResponse = await getThreeCardTarot();
            console.log(`Replying with three card tarot: ${JSON.stringify(tarotResponse)}`);
            event.reply({
                type: 'flex',
                altText: `三張牌牌陣 - ${userMessage}`,
                contents: tarotResponse
            });
        } catch (error) {
            console.error('Error replying with three card tarot:', error);
            event.reply('無法獲取塔羅牌讀數');
        }
    } else {
        event.reply('小桃現在有事沒空！\n晚點也不會和你聯絡！\n要算牌跟小桃說"小桃幫我算！"');
    }
});

bot.listen('/', process.env.PORT || 3000, () => {
    console.log('機器人啟動');
});
