module.exports = function(sequelize, DataTypes){
    const Invite = sequelize.define('Invite', {
        name: {
            type: DataTypes.STRING,
        },
        date: {
            type: DataTypes.DATEONLY,
        }
    });

    Invite.associate = function(models) {
        Invite.belongsTo(models.User, {
          onDelete: 'cascade'
        });  
    };

    return Invite;
};
