import { useEffect, useState } from "react";
import * as routing from "../routing";
import React from "react";
function GoMain() {
  return <button onClick={() => routing.pushState("/")}>Go Main</button>;
}

export function Pokemons() {
  let [data, setData] = useState();
  useEffect(() => {
    fetch("https://pokeapi.co/api/v2/pokemon?limit=100&offset=0")
      .then((res) => res.json())
      .then((res) => setData(res));
  }, []);

  if (data && data.results.length > 0) {
    return (
      <div>
        {data.results.map((h, i) => (
          <div key={i}>{h.name}</div>
        ))}
        <GoMain />
      </div>
    );
  }
}
