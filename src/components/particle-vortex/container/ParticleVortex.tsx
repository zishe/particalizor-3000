import React, { useEffect, useRef } from "react";
import ParticleVortexView from "../view/ParticleVortexView";
import { IParticleVortexProps } from "./IParticleVortexProps";
import { getActualParticleVortexValues } from "../../../service/properties-handler/PropertiesHandler";
import { createVortexes } from "../../../service/vortex-creator/VortexCreator";
import { createParticles } from "../../../service/particle-creator/ParticleCreator";
import { isNil } from "ramda";
import { drawParticleVortexOnCanvas } from "../../../service/painter/Painter";

export const ParticleVortex: React.FC<IParticleVortexProps> = ({
  particleNumber,
  particleLifeTime,
  particleTraceWidth,
  imageWidth,
  imageHeight,
  vortexNumber,
  backgroundColor
}) => {
  const destinationCanvasRef = useRef<HTMLCanvasElement>(null);

  const actualValues = getActualParticleVortexValues(
    particleNumber,
    particleLifeTime,
    particleTraceWidth,
    imageWidth,
    imageHeight,
    vortexNumber,
    backgroundColor
  );

  const particles = createParticles(
    actualValues.actualParticleNumber,
    actualValues.actualImageWidth,
    actualValues.actualImageHeight,
    actualValues.actualParticleLifeTime
  );
  const vortexes = createVortexes(
    actualValues.actualVortexNumber,
    actualValues.actualImageWidth,
    actualValues.actualImageHeight
  );

  let animationRequestIds: number[] = [];

  const addAnimationRequestId = (animationRequestId: number) =>
    animationRequestIds.push(animationRequestId);

  const cancelAllRelevantAnimationRequests = () => {
    animationRequestIds.map(animationRequestId =>
      window.cancelAnimationFrame(animationRequestId)
    );

    animationRequestIds = [];
  };

  useEffect(() => {
    if (!isNil(destinationCanvasRef.current)) {
      drawParticleVortexOnCanvas(
        particles,
        vortexes,
        actualValues,
        destinationCanvasRef.current,
        addAnimationRequestId,
        cancelAllRelevantAnimationRequests
      );
    }
  });

  return <ParticleVortexView destinationCanvasRef={destinationCanvasRef} />;
};

export default ParticleVortex;
