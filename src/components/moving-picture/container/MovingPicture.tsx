import React, { useEffect, useRef } from "react";
import MovingPictureView from "../view/MovingPictureView";
import { IMovingPictureProps } from "./IMovingPictureProps";
import { getActualValues } from "../../../service/properties-handler/PropertiesHandler";
import { createImageElement } from "../../../service/painter/Painter";

export const MovingPicture: React.FC<IMovingPictureProps> = ({
  particleNumber,
  particleLifeTime,
  particleVelocity,
  directionChannel,
  reverseDirection,
  hueChannel,
  reverseHue,
  particleTraceWidth,
  imageSource
}) => {
  const destinationCanvasRef = useRef<HTMLCanvasElement>(null);
  const referenceCanvasRef = useRef<HTMLCanvasElement>(null);

  const actualValues = getActualValues(
    particleNumber,
    particleLifeTime,
    particleVelocity,
    directionChannel,
    reverseDirection,
    hueChannel,
    reverseHue,
    particleTraceWidth
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

  useEffect(() =>
    createImageElement(
      referenceCanvasRef.current,
      destinationCanvasRef.current,
      actualValues,
      imageSource,
      addAnimationRequestId,
      cancelAllRelevantAnimationRequests
    )
  );

  return (
    <MovingPictureView
      destinationCanvasRef={destinationCanvasRef}
      referenceCanvasRef={referenceCanvasRef}
    />
  );
};

export default MovingPicture;
