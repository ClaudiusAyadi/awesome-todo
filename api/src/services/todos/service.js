import Todo from './Todo.js';
import { s } from '../shared/index.js';

const getTodos = s.getAll(Todo, 'todos');
const getTodo = s.getById(Todo, 'todo');
const addTodo = s.create(Todo, 'todo');
const update = s.update(Todo, 'todo');
const remove = s.remove(Todo, 'todo');

export default {
	getAll: getTodos,
	getOne: getTodo,
	add: addTodo,
	update,
	delete: remove,
};
