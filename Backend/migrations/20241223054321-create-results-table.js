'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Results', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      userId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Users', // Assuming 'Users' table exists
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      score: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      userAnswer: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      attemptedQuestions: {  // Fixed typo
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      correctAnswers: {
        type: Sequelize.INTEGER,
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
    await queryInterface.dropTable('Results');
  },
};
