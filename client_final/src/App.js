import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from "./header";
import Items from './components/items';
import ProgressBoard from './progress_graph/progressboard';
import 'bootstrap/dist/css/bootstrap.min.css';

class App extends React.Component {

    constructor(props) {
      super(props);
      this.state = {
    };
    }

    render() {
      return (

      <Router>
      <div className="wrapper">
        <Header />

        <Routes>
           <Route path="/" element={<Items items={this.state.items}/>} />
           <Route path="/progressgraph" element={<ProgressBoard />} />
        </Routes>
        
      </div>
      </Router>
    );
  }
}

export default App;
