import axios from 'axios';
import { translateText } from './translate.js';

function getRandomImagePath() {
    const images = [
        'https://th.bing.com/th/id/OIP.3VzVOnHbt3mHNuKE_m3avwAAAA?rs=1&pid=ImgDetMain',
        'https://th.bing.com/th/id/OIP.nuEEPWs4SyLJzkSWEOGIwgAAAA?rs=1&pid=ImgDetMain',
        'https://pbs.twimg.com/media/FUM_IH7UsAAR2nh?format=jpg&name=large',
        'https://pbs.twimg.com/media/Fy4wtoBakAEn0d_.jpg',
        'https://pbs.twimg.com/media/Ft9_LCBaUAYRwT_.jpg',
        'https://th.bing.com/th/id/OIP.OYea_e-k566JPEYJJ_EeNAAAAA?rs=1&pid=ImgDetMain',
        'https://c-ssl.duitang.com/uploads/blog/202309/09/q4SylX8lFxveNdw.jpg',
        'https://i.pinimg.com/originals/fc/7a/79/fc7a7985a31494c6cf21f27ea57f2f40.jpg',
        'https://th.bing.com/th/id/OIP.iSZX2DGdrgJetkeRdGJZGgAAAA?w=400&h=400&rs=1&pid=ImgDetMain'
    ];
    const randomIndex = Math.floor(Math.random() * images.length);
    return images[randomIndex];
}

export async function getDailyTarot() {
    try {
        console.log('Fetching daily tarot card...');
        const response = await axios.get('https://tarotapi.dev/api/v1/cards/random?n=1');
        const card = response.data.cards[0];
        console.log(`Card fetched: ${card.name} - ${card.meaning_up}`);
        const translatedMeaning = await translateText(card.meaning_up);
        const imagePath = getRandomImagePath();

        const flexMessage = {
            type: "bubble",
            hero: {
                type: "image",
                url: imagePath,
                size: "full",
                aspectRatio: "20:13",
                aspectMode: "cover"
            },
            body: {
                type: "box",
                layout: "vertical",
                contents: [
                    {
                        type: "text",
                        text: "今日運勢",
                        weight: "bold",
                        size: "xl",
                        align: 'center'
                    },
                    {
                        type: "box",
                        layout: "vertical",
                        margin: "lg",
                        spacing: "sm",
                        contents: [
                            {
                                type: "box",
                                layout: "baseline",
                                spacing: "sm",
                                contents: [
                                    {
                                        type: "text",
                                        text: "牌卡",
                                        color: "#aaaaaa",
                                        size: "sm",
                                        flex: 1,
                                        align: 'center'
                                    },
                                    {
                                        type: "text",
                                        text: card.name,
                                        wrap: true,
                                        color: "#666666",
                                        size: "sm",
                                        flex: 5
                                    }
                                ]
                            },
                            {
                                type: "box",
                                layout: "baseline",
                                spacing: "sm",
                                contents: [
                                    {
                                        type: "text",
                                        text: "牌義",
                                        color: "#aaaaaa",
                                        size: "sm",
                                        flex: 1,
                                        align: 'center'
                                    },
                                    {
                                        type: "text",
                                        text: translatedMeaning,
                                        wrap: true,
                                        color: "#666666",
                                        size: "sm",
                                        flex: 5
                                    }
                                ]
                            }
                        ]
                    }
                ]
            },
            footer: {
                type: "box",
                layout: "vertical",
                spacing: "sm",
                contents: [
                    {
                        type: "button",
                        style: "link",
                        height: "sm",
                        action: {
                            type: "message",
                            label: "重新算每日運勢",
                            text: "重新算每日運勢"
                        }
                    },
                    {
                        type: "button",
                        style: "link",
                        height: "sm",
                        action: {
                            type: "message",
                            label: "重新算三張牌牌陣",
                            text: "重新算三張牌牌陣"
                        }
                    },
                    {
                        type: "box",
                        layout: "vertical",
                        contents: [],
                        margin: "sm"
                    }
                ],
                flex: 0
            }
        };

        return flexMessage;
    } catch (error) {
        console.error('Error fetching tarot card:', error);
        return '小桃不豬到辣！';
    }
}
