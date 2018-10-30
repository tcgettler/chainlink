module.exports = function(sequelize, DataTypes){
    const Products = sequelize.define('Product', {
        username: {
            type: DataTypes.STRING
        },
        password: {
            type: DataTypes.STRING
        },
        email: {
            type: DataTypes.STRING
        },
    });

    return Products;
};


