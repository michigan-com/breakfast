'use strict';

export default function uploads(context, images, canvasOptions) {
  for (const image of images) {
    context.drawImage(
      image.img,
      0,
      0,
      image.img.width,
      image.img.height,
      image.dx * 2,
      image.dy * 2,
      image.width * canvasOptions.height * 2,
      image.height * canvasOptions.height * 2,
    );
  }
}
