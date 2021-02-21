'use strict';
const { Model } = require('sequelize');
const bcrypt = require('bcrypt');

module.exports = (sequelize, DataTypes) => {
  class User extends Model {

    static associate(models) {
      User.hasMany(models.Course, {
        as: "course",
        foreignKey: {
          fieldName: "userId",
          allowNull: false,
        }
      });
    }
  }

  User.init({
    firstName: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'A first name is required'
        },
        notEmpty: {
          msg: 'Please provide a first name'
        }
      }
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'A last name is required'
        },
        notEmpty: {
          msg: 'Please provide a last name'
        }
      }
    },
    emailAddress: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: {
        msg: 'The email address you entered already exists'
      },
      validate: {
        isEmail: {
          msg: "Please enter a valid email"
        },
        notNull: {
          msg: 'An email address is required'
        }
      }
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      set(val){
        const hashedPassword = bcrypt.hashSync(val, 10);
        this.setDataValue('password', hashedPassword);
      },
      validate: {
        notNull: {
          msg: 'A password is required',
        },
      },
    },
  }, {
    sequelize,
    modelName: 'User',
  });
  return User; 
};