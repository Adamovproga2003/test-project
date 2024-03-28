import { Schema, model } from 'mongoose';
import bcrypt from 'bcrypt';
import { object, string } from 'zod';

export interface IUser {
  username: string;
  hashedPassword: string;
  _password: string;
  encryptPassword: (password: string) => string;
  authenticate: (password: string) => boolean;
}

const UserSchema = new Schema<IUser>({
  username: { type: String, unique: true, required: true },
  hashedPassword: {
    type: String,
    required: true,
  },
});

UserSchema.virtual('password')
  .set(function (password: string) {
    this._password = password;
    this.hashedPassword = this.encryptPassword(password);
  })
  .get(function () {
    return this._password;
  });

UserSchema.methods = {
  encryptPassword: function (password: string) {
    try {
      const salt = bcrypt.genSaltSync(10);
      return bcrypt.hashSync(password, salt);
    } catch (error) {
      console.error(error);
      process.exit(1);
    }
  },
  authenticate: function (password: string) {
    return bcrypt.compareSync(password, this.hashedPassword);
  },
};

export const userAuthSchema = object({
  body: object({
    username: string({
      required_error: 'username is required',
    }),
    password: string({
      required_error: 'password is required',
    }),
  }),
});

export const User = model<IUser>('User', UserSchema);
