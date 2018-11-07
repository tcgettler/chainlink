module.exports = function(sequelize, DataTypes){
    const Friends = sequelize.define('Friends', {
        username: {
            type: DataTypes.STRING,
        },
        email: {
            type: DataTypes.STRING,
        },
        profileImage: {
            type: DataTypes.STRING
        }
    });

    Friends.associate = function(models) {
        Friends.belongsTo(models.User, {
          onDelete: 'cascade'
        });  
    };
    return Friends;
};

