import { useEffect, useState } from "react";
import "./App.css";
import { TagCloud } from "react-tagcloud";

function App() {
  const [movies, setMovies] = useState([]);
  const [search, setSearch] = useState([]);
  const [searchedWords, setSearchedWords] = useState([]);

  // on Click we invoke the handle submit function that fetches the data from the API based on search that is being updated by the handle change function
  // after fetch we set the fetched data to the movies state and the searchedWords state and load the movies
  const handleSubmit = (e) => {
    e.preventDefault();
    // fetching movies
    const loadMovies = async () => {
      try {
        const response = await fetch(
          `https://www.omdbapi.com/?s=${search}&type=movie&page=1&apikey=5c4ff5a9`
        );
        const data = await response.json();
        //setting movies from the fetch into a state
        setMovies(data.Search);
      } catch (error) {
        console.log(error);
      }
    };
    // calling function loadMovies
    loadMovies();
    // adding the search word into array of searched words
    setSearchedWords([...searchedWords, search]);
  };

  // using reduce method to iterate over the searchWords array and build up an array of objects with value and properties for the Tagcloud Component
  // acc is the array that is build up on each iteration and val is the current value in the array
  const counts = searchedWords.reduce((acc, val) => {
    // if current value already exists in the array using find method
    // we increment the count by one
    const existing = acc.find((item) => item.value === val);
    if (existing) {
      existing.count++;
      // if it doesnt we add a new object with the value property of the current value a set its count to 1
    } else {
      acc.push({ value: val, count: 1 });
    }
    return acc;
  }, []);
  // after building the array we sort the data from the one with highest count to the data with the lowest count
  const data = counts.sort((a, b) => b.count - a.count);
  // this function is invoked on every change of the input and setting the search to be used after click
  const handleChange = (e) => {
    setSearch(e.target.value);
  };

  return (
    <div className="App">
      <div className="header">
        <h1>Movies list</h1>
        <label htmlFor="search">Search movies by name:</label>
        <br />
        <input type="text" name="search" onChange={handleChange} />
        <br />
        <button type="submit" onClick={handleSubmit}>
          Search
        </button>
      </div>
      <div className="cloud">
        <TagCloud
          minSize={12}
          maxSize={50}
          rotate={90}
          tags={counts}
          style={{ width: 400, textAlign: "center" }}
        />
      </div>
      <div className="movies">
        {movies ? (
          <div>
            {movies.map((movie, index) => {
              return (
                <div key={index}>
                  <div>{movie.Title}</div>
                  <img src={movie.Poster} alt="" />
                </div>
              );
            })}
          </div>
        ) : (
          <div>loading..</div>
        )}
      </div>
    </div>
  );
}

export default App;
