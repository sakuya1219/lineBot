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

export async function getThreeCardTarot() {
    try {
        console.log('Fetching three tarot cards...');
        const response = await axios.get('https://tarotapi.dev/api/v1/cards/random?n=3');
        const cards = response.data.cards;
        console.log('Cards fetched:', cards);
        const translatedCards = await Promise.all(cards.map(async (card) => {
            const translatedMeaning = await translateText(card.meaning_up);
            return {
                name: card.name,
                meaning: translatedMeaning
            };
        }));
        const imagePath = getRandomImagePath();

        const labels = ["過去", "現在", "未來"];

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
                        text: "三張牌牌陣",
                        weight: "bold",
                        size: "xl",
                        align: 'center'
                    },
                    ...translatedCards.map((card, index) => ({
                        type: "box",
                        layout: "vertical",
                        margin: "md",
                        spacing: "sm",
                        contents: [
                            {
                                type: "text",
                                text: labels[index],
                                weight: "bold",
                                size: "md",
                                color: "#333333",
                                align: 'center'
                            },
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
                                        text: card.meaning,
                                        wrap: true,
                                        color: "#666666",
                                        size: "sm",
                                        flex: 5
                                    }
                                ]
                            }
                        ]
                    }))
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
        console.error('Error fetching tarot cards:', error);
        return '小桃不豬到辣！';
    }
}
