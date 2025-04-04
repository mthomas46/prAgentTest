import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/database';

class User extends Model {
  public userid!: number;
  public username!: string;
  public password!: string;
  public usertype!: string;
  public lastLogin!: Date | null;
  public lastAuthenticated!: Date | null;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

User.init(
  {
    userid: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    username: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    usertype: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    lastLogin: {
      type: DataTypes.DATE,
      allowNull: true,
      field: 'last_login',
    },
    lastAuthenticated: {
      type: DataTypes.DATE,
      allowNull: true,
      field: 'last_authenticated',
    },
  },
  {
    sequelize,
    tableName: 'users',
    timestamps: true,
    underscored: true,
  }
);

export default User; 