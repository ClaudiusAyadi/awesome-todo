import User from './User.js';
import { s } from '../shared/index.js';

const getUsers = s.getAll(User, 'users');
const getUser = s.getById(User, 'user');
const update = s.update(User, 'user');
const remove = s.remove(User, 'user');

export default { getAll: getUsers, getOne: getUser, update, delete: remove };
