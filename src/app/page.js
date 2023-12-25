'use client'
import style from './page.module.css';
import { useState } from 'react';
import setAuthToken from './utils/setAuthToken';

// Components
import Results from './components/Results';
import Nav from './components/Nav';
import MovieDetails from './components/MovieDetails';
import Homepage from './components/Homepage';
import Explore from './components/Explore';

export default function Home() {
  let movieId = 11;

  // tabs item click handler
  const [activeView, setActiveView] = useState('Home');
  const [searchQuery, setSearchQuery] = useState(''); // Default value is empty string
  const [resultsKey, setResultsKey] = useState(1); // Start counting at 1
  const [resultsLength, setResultsLength] = useState(10); // Default value is 10

  const handleTabChange = (selectedTab) => {
    setActiveView(selectedTab);
    setResultsKey(resultsKey + 1);
    clearSearchQuery();
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
    setResultsKey(resultsKey + 1);
  };

  const clearSearchQuery = () => {
    setSearchQuery('');
  };

  const handleResultsLengthChange = (length) => {
    setResultsLength(length);
    setResultsKey(resultsKey + 1);
  };

  // render content based on active tab or search
  const renderContent = () => {
    if (searchQuery) {
      return (
        <Results
          key={resultsKey}
          resultsLength={resultsLength}
          resultsRoute={`/movies/search/${searchQuery}`}
        />
      );
    } else {
      if (activeView === 'Now Playing') {
        return (
          <Results
            key={resultsKey}
            resultsLength={resultsLength}
            resultsRoute="/movies/now-playing"
          />
        );
      } else if (activeView === 'Popular') {
        return (
          <Results
            key={resultsKey}
            resultsLength={resultsLength}
            resultsRoute="/movies/popular"
          />
        );
      } else if (activeView === 'Recommended') {
        return (
          <Results
            key={resultsKey}
            resultsLength={resultsLength}
            resultsRoute={`/movies/movie/${movieId}/recommendations`}
          />
        );
      } else if  (activeView === 'MovieDetails') {
        return (
          <MovieDetails />
        );
      } else if (activeView === 'Home') {
        return (
          <Homepage />
        );
      } else if (activeView === 'Account') {
        return (
          <div>
            <h1>Account</h1>
          </div>
        );
      } else if (activeView === 'Explore') {
        return (
          <Explore />
        );
      }
    }
  };

  return (
    <main className={style.wrapper}>
      <div className={style.navBar}>
        <Nav handleTabChange={handleTabChange} handleSearch={handleSearch} />
      </div>
      <div className={style.main}>
        {renderContent()}
      </div>
    </main>
  );
}
