'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Questions', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      questionText: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      },
      choiceA: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      choiceB: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      choiceC: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      choiceD: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      correctChoice: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Questions');
  },
};
