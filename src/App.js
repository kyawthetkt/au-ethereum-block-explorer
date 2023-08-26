import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import './App.css';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './components/Home';
import NotFound from './components/NotFound';
import Block from './components/Block';
import BlockTransactions from './components/BlockTransactions';
import Transaction from './components/Transaction';
import Address from './components/Address';

function App() {
  return (
    <Router>
      <Header />
      <section className="container mx-auto p-8 min-h-600">
      <Switch>
        <Route path="/" exact component={Home} />
        <Route path="/block/:blockHashTag" component={Block} />
        <Route path="/blockTransactions/:blockHashTag" component={BlockTransactions} />
        <Route path="/transaction/:transactionHash" component={Transaction} />
        <Route path="/address/:address" component={Address} />
        <Route component={NotFound} />
      </Switch>
      </section>
      <Footer />
    </Router>
  );  
}

export default App;
