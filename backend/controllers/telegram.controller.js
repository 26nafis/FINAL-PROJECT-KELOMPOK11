const telegramService = require('../services/telegram.service');
const config = require('../config/env');

async function getStatus(req, res) {
  try {
    if (!telegramService.isConfigured()) {
      return res.json({
        success: true,
        data: { connected: false, botUsername: null, chatId: config.adminTelegramChatId || null },
      });
    }

    const bot = await telegramService.getBotInfo();

    res.json({
      success: true,
      data: {
        connected: true,
        botUsername: bot.username,
        chatId: config.adminTelegramChatId,
      },
    });
  } catch (error) {
    console.error('TELEGRAM STATUS ERROR:', error);
    res.json({
      success: true,
      data: { connected: false, botUsername: null, chatId: config.adminTelegramChatId || null },
    });
  }
}

async function sendTest(req, res) {
  try {
    await telegramService.sendMessage('✅ Ini pesan test dari Gemini Commerce Admin Panel.');
    res.json({ success: true, message: 'Pesan test berhasil dikirim ke Telegram.' });
  } catch (error) {
    console.error('TELEGRAM TEST ERROR:', error);
    res.status(500).json({ success: false, message: error.message || 'Gagal mengirim pesan test.' });
  }
}

module.exports = { getStatus, sendTest };