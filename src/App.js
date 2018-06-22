import React, { Component } from 'react';
import Navbar from './Header';
import Search from './Search'
import Results from "./Results";
import './App.css';

class App extends Component {
  render() {
    return (
      <div className="App">
        <Navbar />
        <Search />
        <Results />
      </div>
    );
  }
}

export default App;
