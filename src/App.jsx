import { useEffect, useState } from "react";
import "./App.css";
import { TagCloud } from "react-tagcloud";

function App() {
  const [movies, setMovies] = useState([]);
  const [search, setSearch] = useState([]);
  const [searchedWords, setSearchedWords] = useState(null);

  // on Click we invoke the handle submit function that fetches the data from the API based on search that is being updated by the handle change function
  // after fetch we set the fetched data to the movies state and the searchedWords state and load the movies
  const loadMovies = async () => {
    try {
      const response = await fetch(
        `https://www.omdbapi.com/?s=${search}&type=movie&page=1&apikey=5c4ff5a9`
      );
      const data = await response.json();
      //setting movies from the fetch into a state
      console.log(data);
      setMovies(data.Search);
    } catch (error) {
      console.log(error);
    }
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    // fetching movies
    // calling function loadMovies
    loadMovies();

    const storeSearch = async () => {
      try {
        const response = await fetch(
          `http://www.cbp-exercises.test/projects/ic-group/store.php`,
          {
            method: "POST",
            headers: {
              // 'Content-Type': 'multipart/form-data'
            },
            body: JSON.stringify({
              searched_word: search,
            }),
          }
        );
        // console.log(response)
        const data = await response.json();
        // console.log(data);
        setSearchedWords(data);
      } catch (error) {
        console.log(error);
      }
    };
    storeSearch();
  };

  const showResearchedWords = async () => {
    try {
      const response = await fetch(
        `http://www.cbp-exercises.test/projects/ic-group/load.php`
      );
      const data = await response.json();
      setSearchedWords(data);
      console.log(data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    search.length !== 0 ? loadMovies() : "";
    // if(search)
  }, [search]);

  // this function is invoked on every change of the input and setting the search to be used after click
  const handleChange = (e) => {
    setSearch(e.target.value);
  };

  // creating new array that will store the object for the tagcloud
  const dataForTagCloud = [];
  // iterating over key-values of the original object and using object.entries
  // for each key-value pair we create a new object with value and count properties and the push into the array for tagcloud
  if (searchedWords !== null) {
    for (const [value, count] of Object.entries(searchedWords)) {
      dataForTagCloud.push({ value, count });
    }
  }

  useEffect(() => {
    showResearchedWords();
  }, []);

  return (
    <div className="container mt-4">
      <div className="row justify-content-center">
        <div className="col-lg-4 col-md-6 col-sm-8 text-center">
          <h1 className="display-1 mb-4">Movies list</h1>
          <form>
            <div className="input-group mb-3">
              <input
                type="text"
                placeholder="Search movies by name"
                className="form-control"
                name="search"
                // value={clickedTag}
                onChange={handleChange}
              />
              <button
                type="submit"
                onClick={handleSubmit}
                className="btn btn-success btn-custom"
              >
                Search
              </button>
            </div>
          </form>
        </div>
      </div>

      <div className="row justify-content-center">
        <div className="col-4 text-center my-4">
          {/* {console.log(clickedTag)} */}
          <TagCloud
            minSize={12}
            maxSize={50}
            rotate={90}
            onClick={(tag) => {
              setSearch(tag.value);
              // loadMovies();
              // const loadMovies = async () => {
              //   try {
              //     const response = await fetch(
              //       `https://www.omdbapi.com/?s=${search}&type=movie&page=1&apikey=5c4ff5a9`
              //     );
              //     const data = await response.json();
              //     //setting movies from the fetch into a state
              //     setMovies(data.Search);
              //   } catch (error) {
              //     console.log(error);
              //   }
              // };
              // // calling function loadMovies
              // loadMovies();
            }}
            tags={dataForTagCloud}
            style={{ width: 400, textAlign: "center" }}
          />
        </div>
      </div>
      {movies ? (
        <div className="row mt-4">
          {movies.map((movie, index) => {
            return (
              <div
                className="col-lg-4 col-md-6 col-sm-12 text-center"
                key={index}
              >
                <a
                  href={`https://www.imdb.com/title/${movie.imdbID}/?ref_=fn_al_tt_1`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <div className="card mb-4">
                    <img
                      className="card-img-top"
                      src={movie.Poster}
                      alt={`poster for ${movie.Title}`}
                    />
                    <div className="card-body">
                      <h4 className="card-title mt-4">{movie.Title}</h4>
                      <p className="card-text">Release year: {movie.Year}</p>
                    </div>
                  </div>
                </a>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="d-flex justify-content-center mt-4">
          <div class="spinner-border text-primary" role="status">
            <span class="visually-hidden"></span>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
