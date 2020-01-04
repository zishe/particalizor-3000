import React from "react";
import "./App.css";
import ParticleVortex from "./components/particle-vortex/container/ParticleVortex";

const App: React.FC = () => {
  return (
    <div className={"top-container"}>
      <div className={"images"}>
        <div className={"image-container"}>
          <ParticleVortex
            particleTraceWidth={4}
            particleNumber={800}
            particleLifeTime={500}
            imageHeight={800}
            imageWidth={800}
            vortexNumber={10}
          />
        </div>
      </div>
    </div>
  );
};

export default App;
