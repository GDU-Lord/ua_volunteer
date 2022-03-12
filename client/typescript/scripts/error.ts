export default function (key: string) {

    return reasonMap[key] || "Помилка!";

};

const reasonMap = {
    "not-found": "Не знайдено!",
    "access-denied": "Доступ заборонено!",
    "logged-in": "Ви вже увійшли в обліковий запис!",
    "phone-exists": "Обліковий запис із даним номером телефону вже існує!",
    "phone-not-found": "Обліковий запис не знайдено!",
    "insufficient-code": "Код не збігається",
    "telegram-exists": "Обліковий запис з таким Telegram аккаунтом вже існує!",
    "bot-error": "Помилка сервера!",
    "telegram-not-found": "Telegram аккаунт не знайдено!",
    "wrong-telegram": "Telegram аккаунт не збігається!",
    "session-not-found": "Сесію не знайдено!",
    "too-many-ads": "Ви перевищили ліміт оголошень!",
    "post-not-found": "Оголошення не знайдено!",
    "input-error": "Помилка вводу!",
    "banned": "Цей аккаунт забанено!"
};