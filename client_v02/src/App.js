import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from "./components/header";
import Footer from "./components/footer";
import Items from './components/items';
import RecordList from './components/recordList';
import FetchHelper from './fetch-helper'
import 'bootstrap/dist/css/bootstrap.min.css';

class App extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      items: []
    };
  }

  componentDidMount() {
    this.loadWorkoutRecords();
  }

  async loadWorkoutRecords() {
      const result = await FetchHelper.wrecord.load({daterate: "year", year: 2024});
      if (result.ok) {
        this.setState({items: result.data});
      } else {
        console.error("Load error:", result.status);
      }
  }

  render() {
    return (
      <Router>
      <div className="wrapper">
        <Header />
        <Routes>
           <Route path="/" element={<Items items={this.state.items} />} />
           <Route path="/recordList" element={<RecordList />} />
        </Routes>
        <Footer />
      </div>
      </Router>
    );
  }
}

export default App;
