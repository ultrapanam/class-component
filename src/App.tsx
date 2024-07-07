import React from 'react';
import './App.css';
import SearchComponent from './components/SearchComponent';
import ResultComponent from './components/ResultComponent';
import ErrorBoundary from './components/ErrorBoundary';
import { PokemonResult } from './types';

interface AppState {
  results: PokemonResult[];
}

class App extends React.Component<unknown, AppState> {
  constructor(props: Record<string, never>) {
    super(props);
    this.state = {
      results: []
    };
  }

  setResults = (results: PokemonResult[]) => {
    this.setState({ results });
  }

  render() {
    return (
      <div className="App">
        <ErrorBoundary>
          <div className="search-section">
            <SearchComponent onSetResults={this.setResults} />
          </div>
          <div className="results-section">
            <ResultComponent data={this.state.results} />
          </div>
        </ErrorBoundary>
      </div>
    );
  }
}

export default App;
