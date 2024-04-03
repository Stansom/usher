import React, { useEffect, useState } from "react";
import * as routing from "../routing";
function GoMain() {
  return <button onClick={() => routing.pushState("/")}>Go Main</button>;
}

function GoPokemons() {
  return (
    <button onClick={() => routing.pushState("/pokemons")}>Go Pokemons</button>
  );
}
export function Houses() {
  const [data, setData] = useState();
  useEffect(() => {
    fetch("http://localhost:3030/houses")
      .then((res) => res.json())
      .then((res) => setData(res))
      .catch(() => console.error("Can't fetch data", "houses"));
  }, []);
  return (
    <div>
      {data && data.map((h, i) => <div key={i}>{h.name}</div>)}
      <GoMain />
      <GoPokemons />
    </div>
  );
}
