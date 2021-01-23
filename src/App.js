import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import './App.css';
import Home from "./components/Home";
import Room from "./components/Room";
import Header from "./components/Header";

function App() {
	return (
		<div>
			<Router>
				<Header />
				<Route path="/" exact render={() => <Home />} />
				<Route exact path="/home" render={() => <Home />} />
				<Route path="/room/:id" render={() => <Room />} />
			</Router>
		</div>
	)
}

export default App;