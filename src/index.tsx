import MovingPicture from "./components/moving-picture/container/MovingPicture";

import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import ParticleVortex from "./components/particle-vortex/container/ParticleVortex";

ReactDOM.render(<App />, document.getElementById("root"));

export { MovingPicture, ParticleVortex };
