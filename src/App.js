import React from 'react'
import { BrowserRouter as Router, Route, Redirect } from 'react-router-dom'
import './App.css'
import Home from "./components/Home";
import Room from "./components/Room";
import Header from "./components/Header"

function App() {
	return (
		<div>
			<Router>
			<Header />
			<Route path="/Home" exact render={() => <Home />} />
			<Route exact path="/"><Redirect to="/home" /></Route>
			<Route path="/room/:id" exact render={() => <Room />} />
			</Router>
		</div>
	)
}

export default App

