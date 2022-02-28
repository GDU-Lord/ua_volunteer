# ua_volunteer
Сайт для взаємодії волонтерів України

Endpoints:
https://www.notion.so/ukraineisforever/back-end-login-endpoints-c7975e97d2174e419f29c0d1416defc2

## Telegram bot
Використовується для реєстрації нових користувачів

###Prod
@volunteers_org_ua_bot

### Додати Telegram bot hook (виконується один раз для кожного бота)

`curl --request POST --url https://api.telegram.org/bot<TELEGRAM_TOKEN>/setWebhook --header 'content-type: application/json' --data '{"url": "<LINK_YOU_GET_FROM_SERVERLESS_DEPLOY + BOT_ENDPOINT>"}'`

### Видалити Telegram bot hook
`curl --request POST --url https://api.telegram.org/bot<TELEGRAM_TOKEN>/setWebhook --header 'content-type: application/json' --data '{"url": ""}'`
