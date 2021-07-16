const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  sequelize.define(
    "order",
    {
      orderState: {
        type: DataTypes.ENUM("cart", "processing", "cancelled", "completed"),
        defaultValue: "cart",
        allowNull: true,
      },
      shippingState: {
        type: DataTypes.ENUM(
          "initial", //appears as soon as payment is verified
          "created",
          "processing",
          "cancelled",
          "completed"
        ),
        allowNull: true,
      },
      shippingLocation: {
        type: DataTypes.STRING,
      },
      shippingCost: {
        type: DataTypes.FLOAT,
      },
      paymentMethod: {
        type: DataTypes.STRING,
      },
    },
    { timestamps: false }
    // createdAT does not appear
    // updateAT does not appear
  );
};
