module.exports = function(sequelize, DataTypes){
    const Inventory = sequelize.define('Inventory', {
        type: {
            type: DataTypes.STRING,
        },
        mediaID: {
            type: DataTypes.STRING,
        },
        coverArt: {
            type: DataTypes.STRING
        },
        owned: {
            type: DataTypes.STRING,
        }
    });

    Inventory.associate = function(models) {
        Inventory.belongsTo(models.User, {
          onDelete: 'cascade'
        });  
    };
    return Inventory;
};

