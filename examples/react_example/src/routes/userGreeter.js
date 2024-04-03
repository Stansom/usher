import * as routing from "../routing";
import React from "react";
import PropTypes from "prop-types";
function GoMain() {
  return <button onClick={() => routing.pushState("/")}>Go Main</button>;
}

UserGreeter.propTypes = {
  id: PropTypes.string,
};
export function UserGreeter({ id }) {
  return (
    <div>
      <h1>Hello, {id}!</h1>
      <GoMain />
    </div>
  );
}
