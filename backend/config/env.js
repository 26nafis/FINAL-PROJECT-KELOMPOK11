require('dotenv').config();

module.exports = {
  port: process.env.PORT || 3000,

  frontendUrl:
    process.env.FRONTEND_URL || 'http://localhost:5173',

  databaseUrl: process.env.DATABASE_URL,

  jwtSecret:
    process.env.JWT_SECRET || 'development-secret',

  jwtExpiresIn:
    process.env.JWT_EXPIRES_IN || '7d',

  geminiApiKey:
    process.env.GEMINI_API_KEY,

  telegramBotToken:
    process.env.TELEGRAM_BOT_TOKEN,

  adminTelegramChatId:
    process.env.ADMIN_TELEGRAM_CHAT_ID
};