const {
  Product,
  Order
} = require('../models');

async function getDashboard(req, res) {
  try {
    const totalProducts =
      await Product.count();

    const totalOrders =
      await Order.count();

    const totalStock =
      await Product.sum('stock') || 0;

    const completedOrders =
      await Order.findAll({
        where: {
          status: 'completed'
        }
      });

    const revenue =
      completedOrders.reduce(
        (total, order) =>
          total + Number(order.total),
        0
      );

    res.json({
      success: true,
      data: {
        totalProducts,
        totalOrders,
        totalStock,
        revenue
      }
    });
  } catch (error) {
    console.error(
      'DASHBOARD ERROR:',
      error
    );

    res.status(500).json({
      success: false,
      message: 'Gagal mengambil dashboard'
    });
  }
}

module.exports = {
  getDashboard
};