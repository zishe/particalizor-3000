import { isNil } from "ramda";
import {
  createParticles,
  IParticle
} from "../particle-creator/ParticleCreator";
import { moveParticles, moveVortexParticles } from "../animator/Animator";
import {
  IActualParticalizorPropertyValues,
  IActualParticalizorVortexPropertyValues
} from "../properties-handler/PropertiesHandler";
import errorImage from "../../assets/onErrorImage.png";
import { IVortex } from "../vortex-creator/VortexCreator";
import { getRandomIntNumberInRange } from "../color-calculator/ColorCalculator";

export const drawImageOnCanvas = (
  image: HTMLImageElement,
  isImageSourceValid: boolean,
  referenceCanvasRefCurrent: HTMLCanvasElement | null,
  destinationCanvasRefCurrent: HTMLCanvasElement | null,
  actualValues: IActualParticalizorPropertyValues,
  addAnimationRequestId: (animationRequestId: number) => void,
  cancelAllRelevantAnimationRequests: () => void
) => {
  cancelAllRelevantAnimationRequests();

  if (
    !isNil(referenceCanvasRefCurrent) &&
    !isNil(destinationCanvasRefCurrent)
  ) {
    const imageWidth = image.width;
    const imageHeight = image.height;
    const {
      actualParticleNumber,
      actualParticleLifeTime,
      actualParticleTraceWidth
    } = actualValues;

    referenceCanvasRefCurrent.height = imageHeight;
    referenceCanvasRefCurrent.width = imageWidth;
    destinationCanvasRefCurrent.height = imageHeight;
    destinationCanvasRefCurrent.width = imageWidth;

    const source2dContext = referenceCanvasRefCurrent.getContext("2d");
    const destination2dContext = destinationCanvasRefCurrent.getContext("2d");

    if (!isNil(source2dContext) && !isNil(destination2dContext)) {
      if (isImageSourceValid) {
        source2dContext.drawImage(image, 0, 0, imageWidth, imageHeight);

        destination2dContext.fillStyle = "#343a40";
        destination2dContext.fillRect(0, 0, imageWidth, imageHeight);

        destination2dContext.lineWidth = actualParticleTraceWidth;
        destination2dContext.imageSmoothingEnabled = false;

        const srcData: Uint8ClampedArray = source2dContext.getImageData(
          0,
          0,
          imageWidth,
          imageHeight
        ).data;

        const particles = createParticles(
          actualParticleNumber,
          image.width,
          image.height,
          actualParticleLifeTime
        );

        const animate = () => {
          moveParticles(
            particles,
            srcData,
            actualValues,
            destination2dContext,
            image
          );

          addAnimationRequestId(window.requestAnimationFrame(animate));
        };

        animate();
      } else {
        destination2dContext.drawImage(image, 0, 0, imageWidth, imageHeight);
      }
    }
  }
};

export const drawParticleVortexOnCanvas = (
  particles: IParticle[],
  vortexes: IVortex[],
  actualValues: IActualParticalizorVortexPropertyValues,
  destinationCanvasRefCurrent: HTMLCanvasElement | null,
  addAnimationRequestId: (animationRequestId: number) => void,
  cancelAllRelevantAnimationRequests: () => void
) => {
  cancelAllRelevantAnimationRequests();

  if (!isNil(destinationCanvasRefCurrent)) {
    const {
      actualParticleNumber,
      actualParticleLifeTime,
      actualParticleTraceWidth,
      actualImageHeight,
      actualImageWidth,
      actualBackgroundColor
    } = actualValues;

    destinationCanvasRefCurrent.height = actualImageHeight;
    destinationCanvasRefCurrent.width = actualImageWidth;

    const destination2dContext = destinationCanvasRefCurrent.getContext("2d");

    if (!isNil(destination2dContext)) {
      destination2dContext.fillStyle = actualBackgroundColor;
      destination2dContext.fillRect(0, 0, actualImageWidth, actualImageHeight);

      destination2dContext.lineWidth = actualParticleTraceWidth;
      destination2dContext.imageSmoothingEnabled = false;

      const particles = createParticles(
        actualParticleNumber,
        actualImageWidth,
        actualImageHeight,
        actualParticleLifeTime
      );

      const hueShift = getRandomIntNumberInRange(0, 360);

      const animate = () => {
        moveVortexParticles(
          particles,
          vortexes,
          actualValues,
          destination2dContext,
          hueShift
        );

        addAnimationRequestId(window.requestAnimationFrame(animate));
      };

      animate();
    }
  }
};

export const createNewImage: (
  onLoadImage: () => void
) => HTMLImageElement = onLoadImage => {
  const image = new Image();

  image.crossOrigin = "anonymous";
  image.onload = () => onLoadImage();

  return image;
};

export const onLoadImage = (
  image: HTMLImageElement,
  isImageSourceValid: boolean,
  referenceCanvasRefCurrent: HTMLCanvasElement | null,
  destinationCanvasRefCurrent: HTMLCanvasElement | null,
  actualValues: IActualParticalizorPropertyValues,
  addAnimationRequestId: (animationRequestId: number) => void,
  cancelAllRelevantAnimationRequests: () => void
) =>
  drawImageOnCanvas(
    image,
    isImageSourceValid,
    referenceCanvasRefCurrent,
    destinationCanvasRefCurrent,
    actualValues,
    addAnimationRequestId,
    cancelAllRelevantAnimationRequests
  );

export const onErrorImage = (
  image: HTMLImageElement,
  isImageSourceValid: boolean,
  referenceCanvasRefCurrent: HTMLCanvasElement | null,
  destinationCanvasRefCurrent: HTMLCanvasElement | null,
  actualValues: IActualParticalizorPropertyValues,
  addAnimationRequestId: (animationRequestId: number) => void,
  cancelAllRelevantAnimationRequests: () => void
) => {
  image = createNewImage(() =>
    onLoadImage(
      image,
      isImageSourceValid,
      referenceCanvasRefCurrent,
      destinationCanvasRefCurrent,
      actualValues,
      addAnimationRequestId,
      cancelAllRelevantAnimationRequests
    )
  );

  image.src = errorImage;

  drawImageOnCanvas(
    image,
    false,
    referenceCanvasRefCurrent,
    destinationCanvasRefCurrent,
    actualValues,
    addAnimationRequestId,
    cancelAllRelevantAnimationRequests
  );
};

export const createImageElement: (
  referenceCanvasRefCurrent: HTMLCanvasElement | null,
  destinationCanvasRefCurrent: HTMLCanvasElement | null,
  actualValues: IActualParticalizorPropertyValues,
  imageSource: string,
  addAnimationRequestId: (animationRequestId: number) => void,
  cancelAllRelevantAnimationRequests: () => void
) => void = (
  referenceCanvasRefCurrent,
  destinationCanvasRefCurrent,
  actualValues,
  imageSource,
  addAnimationRequestId,
  cancelAllRelevantAnimationRequests
) => {
  const image = createNewImage(() =>
    onLoadImage(
      image,
      true,
      referenceCanvasRefCurrent,
      destinationCanvasRefCurrent,
      actualValues,
      addAnimationRequestId,
      cancelAllRelevantAnimationRequests
    )
  );

  image.onerror = () =>
    onErrorImage(
      image,
      false,
      referenceCanvasRefCurrent,
      destinationCanvasRefCurrent,
      actualValues,
      addAnimationRequestId,
      cancelAllRelevantAnimationRequests
    );

  image.src = imageSource;
};
