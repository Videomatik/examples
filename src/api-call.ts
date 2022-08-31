import VideomatikAPI from '@videomatik/api';
import 'dotenv/config';

const videomatik = new VideomatikAPI({
  apiKey: process.env.API_KEY,
});
 
const customJSON = {
        "soundtrack": {
          "startTime": 0,
          "source": ""
        },
        "images": [
          {
            "path": "assets[0]",
            "source": "https://storage.videomatik.com.br/videomatik/templates/black-friday-loop-syr46pq/variations/promocao-batata/assets/85403ebb-e7cf-4572-9316-b942fc50ab63--compressed-png.png"
          },
          {
            "path": "assets[1]",
            "source": "https://storage.videomatik.com.br/videomatik/templates/black-friday-loop-syr46pq/variations/promocao-batata/assets/61271019-3ed4-4930-beff-2f5bf22f1eae--compressed-png.jpeg"
          }
        ],
        "version": "1",
        "texts": [
          {
            "fontURL": "/fonts/Montserrat-Bold.ttf",
            "fillColor": "#ffffff",
            "fontStyle": "Bold",
            "path": "assets[2].layers[0].t.d.k[0]",
            "fontWeight": "700",
            "fontAscent": 76.1989135742188,
            "hidden": null,
            "time": 0,
            "fontSize": 80,
            "value": "APENAS R$ 2,99 / kg",
            "justification": "CENTER",
            "fontFamily": "Montserrat",
            "stroke": null,
            "fontName": "Montserrat-Bold",
            "lineHeight": 105.600006103516
          },
          {
            "fontURL": "/fonts/Montserrat-Bold.ttf",
            "fillColor": "#ffffff",
            "fontStyle": "Bold",
            "path": "layers[6].t.d.k[0]",
            "fontWeight": "700",
            "fontAscent": 76.1989135742188,
            "hidden": null,
            "time": 0,
            "fontSize": 100,
            "value": "BATATA INGLESA",
            "justification": "CENTER",
            "fontFamily": "Montserrat",
            "stroke": null,
            "fontName": "Montserrat-Bold",
            "lineHeight": 147.6
          }
        ],
        "shapes": [
          {
            "path": "assets[2].layers[1].shapes[0].it[1]",
            "color": "#265fe2"
          },
          {
            "path": "layers[7].shapes[0].it[1]",
            "color": "#265fe2"
          }
        ],
        "colors": [
          {
            "path": [
              "layers[0].ef[0].ef[2].v.k"
            ],
            "color": "#F47731",
            "effectName": "Fill",
            "effectLayerName": "Transição 4",
            "effectPropertyName": "Color"
          },
          {
            "path": [
              "layers[1].ef[0].ef[2].v.k"
            ],
            "color": "#202020",
            "effectName": "Fill",
            "effectLayerName": "Transição 3",
            "effectPropertyName": "Color"
          },
          {
            "path": [
              "layers[2].ef[0].ef[2].v.k"
            ],
            "color": "#265fe2",
            "effectName": "Fill",
            "effectLayerName": "Transição 2",
            "effectPropertyName": "Color"
          }
        ]
      }

(async () => {
  const videoRequest = await videomatik.createVideoRequest({
    templateId: 'promocao-batata', // <- ID do Template
    customJSON,
    compositionId: 'default', // <- Vertical, neste template pode ser: default (Vertical), feed (Quadrado)
    actions: [
    // Você pode colocar um Webhook para ser notificado quando o vídeo ficar pronto
     {
       type: 'webhook',
       url: process.env.WEBHOOK_URL,
     },
    ],
  });

  console.log(videoRequest);
})();
