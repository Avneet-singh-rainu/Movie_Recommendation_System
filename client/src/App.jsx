import { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";
import SkeletonMovie from "./SkeletonMovie";

function App() {
  const [name, setName] = useState("");
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setName(e.target.value);
  };

  const fetch = async () => {
    try {
      const res = await axios.get("http://localhost:3000");
      setData(res.data);
    } catch (error) {
      console.error("Error fetching data:", error);
      setData(["Failed to fetch data"]);
    }
  };

  useEffect(() => {
    fetch();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    axios
      .post("http://localhost:3000/movie", { name })
      .then((response) => {
        console.log("Response data:", response.data);
        if (Array.isArray(response.data.data)) {
          setData(response.data.data);
        } else {
          setData(["No recommendations found!"]);
        }
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching recommendations:", error);
        setData(["Failed to fetch recommendations. Please try again."]);
        setLoading(false);
      });
  };

  return (
    <div className="app">
      <header className="header">
        <h1>Movie Recommendation</h1>
      </header>
      <form className="search-form" onSubmit={handleSubmit}>
        <input
          type="text"
          className="search-input"
          placeholder="Enter Movie Name"
          value={name}
          onChange={handleChange}
        />
        <button type="submit" className="search-button">
          Search
        </button>
      </form>
      <div className="movie-container">
        {loading ? (
          <SkeletonMovie />
        ) : Array.isArray(data) ? (
          data.map((item, key) => (
            <div key={key} className="movie">
              <p>{item}</p>
            </div>
          ))
        ) : (
          <p>{data}</p>
        )}
      </div>
    </div>
  );
}

export default App;
