module.exports = function(sequelize, DataTypes){
    const User = sequelize.define('User', {
        username: {
            type: DataTypes.STRING,
            unique: true
        },
        password: {
            type: DataTypes.STRING
        },
        email: {
            type: DataTypes.STRING
        },
        profile_image: {
            type: DataTypes.STRING,
            defaultValue: 'media/defaultprofile.png'
        }
    });

    User.associate = function(models) {
        User.belongsTo(models.Invite, {
          onDelete: 'cascade'
        });  
    };
    return User;
};


