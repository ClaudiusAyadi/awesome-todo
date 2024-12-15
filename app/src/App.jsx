import React, { useEffect, useState } from 'react';
import axios from 'axios';

import './App.css';
import Signup from './pages/Signup';

function App() {

	useEffect(() => {
		const fetchApi = async () => {
			const res = await axios.get('http://localhost:8021/api/v1/todos')

			const {data} = res

			console.log(data.todos)
		}
		fetchApi();

		document.title = `Awesome Todo`;
	}, []);

	<Signup />;

}

export default App;
