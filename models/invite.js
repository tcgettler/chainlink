module.exports = function(sequelize, DataTypes){
    const Invite = sequelize.define('Invite', {
        name: {
            type: DataTypes.STRING,
        },
        date: {
            type: DataTypes.DATE,
        }
    });

    Invite.associate = function(models) {
        Invite.hasMany(models.User, {
          onDelete: 'cascade'
        });  
    };

    return Invite;
};
