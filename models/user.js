module.exports = function(sequelize, DataTypes){
    const User = sequelize.define('User', {
        username: {
            type: DataTypes.STRING
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

    return User;
};


