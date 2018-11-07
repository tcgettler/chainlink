'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('User', [{
      username: kingmoofasa,
      password: Password-1,
      email: test@test.com,
      profile_image: media/defaultprofile.png
  },
  {
    username: finaltoaster,
    password: Password-1,
    email: test@test.com,
    profile_image: media/defaultprofile.png
  },
  {
    username: pyromania2090,
    passwpord: Password-1,
    email: test@test.com,
    profile_image: medial/defaultprofile.png
  }] )},

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Product', null, {});
  }
};
