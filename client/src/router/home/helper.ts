const compassLogic = (jsonMessage, element) => {
  try {
    const closestRole = jsonMessage
      .map((item) => ({
        ...item,
        distance:
          window.screenY +
          window.screenX -
          (item.windowDetails.screenY + item.windowDetails.screenX),
      }))
      .sort((a, b) => Math.abs(a.distance) - Math.abs(b.distance))
      .at(0);

    const calculationTheta = ({ windowDetails }) => {
      const dy =
        window.screenY +
        window.innerHeight / 2 -
        (windowDetails.screenY + windowDetails.height / 2);
      const dx =
        window.screenX +
        window.outerWidth / 2 -
        (windowDetails.screenX + windowDetails.width / 2);

      return Math.atan2(dx, dy) * (180 / Math.PI) * -1;
    };

    const theta = calculationTheta(closestRole);

    element.current.setAttribute("style", `rotate: ${theta}deg; scale: 7`);
  } catch (error) {
    console.error(error);
  }
};

export { compassLogic };
