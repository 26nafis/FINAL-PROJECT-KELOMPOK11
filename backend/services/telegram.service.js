const config = require('../config/env');

const TELEGRAM_API = 'https://api.telegram.org';

function isConfigured() {
  return Boolean(config.telegramBotToken && config.adminTelegramChatId);
}

/**
 * Cek validitas bot token ke Telegram (endpoint getMe bawaan Telegram),
 * dipakai buat nampilin status koneksi + username bot di halaman admin.
 */
async function getBotInfo() {
  if (!config.telegramBotToken) {
    throw new Error('TELEGRAM_BOT_TOKEN belum diatur di file .env');
  }

  const res = await fetch(`${TELEGRAM_API}/bot${config.telegramBotToken}/getMe`);
  const data = await res.json();

  if (!data.ok) {
    throw new Error(data.description || 'Token bot Telegram tidak valid');
  }

  return data.result; // { id, is_bot, first_name, username, ... }
}

/**
 * Kirim pesan teks ke chat admin (ADMIN_TELEGRAM_CHAT_ID). Dipakai buat
 * tombol "Kirim Pesan Test" dan notifikasi otomatis pesanan.
 */
async function sendMessage(text) {
  if (!isConfigured()) {
    throw new Error('TELEGRAM_BOT_TOKEN atau ADMIN_TELEGRAM_CHAT_ID belum diatur di file .env');
  }

  const res = await fetch(`${TELEGRAM_API}/bot${config.telegramBotToken}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      chat_id: config.adminTelegramChatId,
      text,
      parse_mode: 'HTML',
    }),
  });

  const data = await res.json();
  if (!data.ok) {
    throw new Error(data.description || 'Gagal mengirim pesan Telegram');
  }

  return data.result;
}

/**
 * Notifikasi otomatis - dipanggil dari order.controller.js. Sengaja
 * "fire and forget" (dibungkus try/catch di sisi pemanggil) supaya
 * kalau Telegram lagi down, itu TIDAK menggagalkan proses order.
 */
async function notifyNewOrder(order) {
  const text =
    `🛒 <b>Pesanan Baru</b>\n` +
    `Invoice: ${order.invoiceNumber}\n` +
    `Total: Rp${Number(order.total).toLocaleString('id-ID')}\n` +
    `Status: ${order.status}`;
  return sendMessage(text);
}

async function notifyOrderStatusChange(order) {
  const text =
    `🔄 <b>Status Pesanan Berubah</b>\n` +
    `Invoice: ${order.invoiceNumber}\n` +
    `Status baru: <b>${order.status}</b>`;
  return sendMessage(text);
}

module.exports = {
  isConfigured,
  getBotInfo,
  sendMessage,
  notifyNewOrder,
  notifyOrderStatusChange,
};