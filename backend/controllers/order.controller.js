const {
  sequelize,
  Product,
  Order,
  OrderItem,
  User
} = require('../models');

const telegramService = require('../services/telegram.service');

async function createOrder(req, res) {
  const transaction =
    await sequelize.transaction();

  try {
    const { items } = req.body;

    if (!Array.isArray(items) || items.length === 0) {
      await transaction.rollback();

      return res.status(400).json({
        success: false,
        message: 'Minimal satu produk harus dipesan'
      });
    }

    let total = 0;
    const orderItems = [];

    for (const item of items) {
      const product =
        await Product.findByPk(item.productId, {
          transaction
        });

      if (!product) {
        throw new Error(
          `Produk ${item.productId} tidak ditemukan`
        );
      }

      const quantity =
        Number(item.quantity);

      if (
        !Number.isInteger(quantity) ||
        quantity <= 0
      ) {
        throw new Error(
          `Jumlah produk ${product.name} tidak valid`
        );
      }

      if (product.stock < quantity) {
        throw new Error(
          `Stok ${product.name} tidak mencukupi`
        );
      }

      const price =
        Number(product.price);

      const subtotal =
        price * quantity;

      total += subtotal;

      orderItems.push({
        product,
        quantity,
        price,
        subtotal
      });
    }

    const invoiceNumber =
      `INV-${Date.now()}`;

    const order =
      await Order.create(
        {
          userId: req.user.id,
          invoiceNumber,
          total,
          status: 'pending'
        },
        { transaction }
      );

    for (const item of orderItems) {
      await OrderItem.create(
        {
          orderId: order.id,
          productId: item.product.id,
          quantity: item.quantity,
          price: item.price,
          subtotal: item.subtotal
        },
        { transaction }
      );

      await item.product.update(
        {
          stock:
            item.product.stock -
            item.quantity
        },
        { transaction }
      );
    }

    await transaction.commit();

    const createdOrder =
      await Order.findByPk(
        order.id,
        {
          include: [
            {
              model: OrderItem,
              as: 'items',
              include: [
                {
                  model: Product,
                  as: 'product'
                }
              ]
            }
          ]
        }
      );

    telegramService.notifyNewOrder(createdOrder).catch((err) =>
      console.error('TELEGRAM NOTIFY ERROR:', err.message)
    );

    res.status(201).json({
      success: true,
      message: 'Pesanan berhasil dibuat',
      data: createdOrder
    });
  } catch (error) {
    await transaction.rollback();

    console.error('CREATE ORDER ERROR:', error);

    res.status(400).json({
      success: false,
      message: error.message
    });
  }
}

async function getOrders(req, res) {
  try {
    const where =
      req.user.role === 'admin'
        ? {}
        : { userId: req.user.id };

    const orders =
      await Order.findAll({
        where,
        include: [
          {
            model: User,
            as: 'user',
            attributes: ['id', 'name', 'email']
          },
          {
            model: OrderItem,
            as: 'items',
            include: [
              {
                model: Product,
                as: 'product'
              }
            ]
          }
        ],
        order: [['createdAt', 'DESC']]
      });

    res.json({
      success: true,
      data: orders
    });
  } catch (error) {
    console.error('GET ORDERS ERROR:', error);

    res.status(500).json({
      success: false,
      message: 'Gagal mengambil pesanan'
    });
  }
}

async function getOrder(req, res) {
  try {
    const where = {
      id: req.params.id
    };

    if (req.user.role !== 'admin') {
      where.userId = req.user.id;
    }

    const order =
      await Order.findOne({
        where,
        include: [
          {
            model: User,
            as: 'user',
            attributes: ['id', 'name', 'email']
          },
          {
            model: OrderItem,
            as: 'items',
            include: [
              {
                model: Product,
                as: 'product'
              }
            ]
          }
        ]
      });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Pesanan tidak ditemukan'
      });
    }

    res.json({
      success: true,
      data: order
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Gagal mengambil detail pesanan'
    });
  }
}

async function updateOrderStatus(req, res) {
  try {
    const {
      status
    } = req.body;

    const allowedStatus = [
      'pending',
      'processing',
      'shipped',
      'completed',
      'cancelled'
    ];

    if (!allowedStatus.includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Status pesanan tidak valid'
      });
    }

    const order =
      await Order.findByPk(
        req.params.id
      );

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Pesanan tidak ditemukan'
      });
    }

    await order.update({
      status
    });

    telegramService.notifyOrderStatusChange(order).catch((err) =>
      console.error('TELEGRAM NOTIFY ERROR:', err.message)
    );

    res.json({
      success: true,
      message: 'Status pesanan berhasil diperbarui',
      data: order
    });
  } catch (error) {
    console.error(
      'UPDATE ORDER STATUS ERROR:',
      error
    );

    res.status(500).json({
      success: false,
      message: 'Gagal memperbarui status pesanan'
    });
  }
}

module.exports = {
  createOrder,
  getOrders,
  getOrder,
  updateOrderStatus
};