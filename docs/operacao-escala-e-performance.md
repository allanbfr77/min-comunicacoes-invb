# Escala por API e performance

## 1) Fonte de dados da escala (Google Sheets/API)

O site agora tenta carregar a escala nesta ordem:

1. URL configurada em `<meta name="escala-api-url" content="...">`
2. fallback local em `dados.json`

### Exemplo de uso com Google Sheets

- Publique a planilha (ou use um endpoint intermediario) em JSON.
- Garanta que o retorno seja um destes formatos:
  - array direto: `[{ ... }, { ... }]`
  - objeto com chave `escala`: `{ "escala": [{ ... }] }`
- Configure a URL no `index.html`:

```html
<meta name="escala-api-url" content="https://sua-url-json-aqui">
```

## 2) Performance de vinhetas (mobile)

As vinhetas sao arquivos de download. Para reduzir consumo de dados no celular:

- Gere versoes comprimidas em H.264 (`.mp4`) ou AV1/VP9 (`.webm`).
- Mantenha bitrate entre 2 e 4 Mbps para 1080p.
- Use nomes curtos e sem espacos, quando possivel.

Sugestao de padrao:

- `vinheta-abertura-mobile.mp4`
- `vinheta-encerramento-mobile.mp4`

Depois ajuste os `href` dos cards de download no `index.html`.
