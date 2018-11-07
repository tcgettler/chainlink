'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('User', [{
      username: 'kingmoofasa',
      password: 'Password-1',
      email: 'test@test.com',
      profile_image: 'media/defaultprofile.png'
  },
  {
    username: 'finaltoaster',
    password: 'Password-1',
    email: 'test@test.com',
    profile_image:' media/katporfile.png'
  },
  {
    username: 'pyromania2090',
    passwpord: 'Password-1',
    email: 'test@test.com',
    profile_image: 'medial/heartlessprofile.png'
  },
  {
    username: 'surisimi',
    password: 'Password-1',
    email: 'test@test.com',
    profile_image: 'media/squidProfile.png'
},
{
  username: 'pandavas',
  password: 'Password-1',
  email: 'test@test.com',
  profile_image: 'media/defaultprofile.png'
},
{
  username: 'reaux',
  password: 'Password-1',
  email: 'test@test.com',
  profile_image: 'media/defaultprofile.png'
},
{
  username: 'squishy',
  password: 'Password-1',
  email: 'test@test.com',
  profile_image: 'media/defaultprofile.png'
},
{
  username: 'pharsalus',
  password: 'Password-1',
  email:' test@test.com',
  profile_image: 'media/defaultprofile.png'
},
{
  username: 'breckel',
  password: 'Password-1',
  email: 'test@test.com',
  profile_image: 'media/defaultprofile.png'
}, ])},

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Product', null, {});
  }
};
