import { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [name, setname] = useState();
  const [data, setData] = useState(["Your Movies will be shown here!"]);

  const handleChange = (e) => {
    setname(e.target.value);
  };

  const fetch = async () => {
    const res = await axios.get("http://localhost:3000");
    setData(res.data);
  };

  useEffect(() => {
    fetch();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    axios
      .post("http://localhost:3000/movie", {
        name,
      })
      .then((response) => {
        setData(response.data);
      });
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        <div className="container">
          <div className="head">
            <h1>Movie Recommendation</h1>
          </div>
          <div className="body">
            <div className="input">
              <p>Enter Movie Name </p>
              <input
                type="text"
                value={name}
                name="name"
                onChange={handleChange}
              />
            </div>
            <div className="movies">
              {data.map((item, key) => {
                return (
                  <div>
                    <p>{item}</p>
                  </div>
                );
              })}
            </div>
            <div className="search">
              <button type="submit">Search</button>
            </div>
          </div>
        </div>
      </form>
    </>
  );
}

export default App;
