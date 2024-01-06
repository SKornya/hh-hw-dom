import './index.less';

const startZone = document.querySelector('.start-zone') as HTMLDivElement;
const alignZone = document.querySelector('.align-zone') as HTMLDivElement;
const freeZone = document.querySelector('.free-zone') as HTMLDivElement;

const getRandomHSLColor = (): string => {
  const h = Math.floor(Math.random() * 361);
  const s = Math.floor(Math.random() * 101);
  const l = Math.floor(Math.random() * 101);
  return `hsl(${h}, ${s}%, ${l}%)`;
};

const setElementCoords = (
  element: HTMLDivElement,
  x: number,
  y: number,
): void => {
  element.style.left = `${x}px`;
  element.style.top = `${y}px`;
};

const moveElement = (element: HTMLDivElement, event: PointerEvent): void => {
  let x: number, y: number;

  if (element.offsetHeight && element.offsetWidth) {
    x = event.clientX - element.offsetWidth / 2;
    y = event.clientY - element.offsetHeight / 2;
  } else {
    const width = 100;
    const height = 100;

    x = event.clientX - width / 2;
    y = event.clientY - height / 2;
  }

  setElementCoords(element, x, y);
};

const isElementInTargetZone = (
  zone: HTMLDivElement,
  event: PointerEvent,
): boolean => {
  const { top, bottom, left, right } = zone.getBoundingClientRect();
  const { clientX, clientY } = event;

  return clientX > left && clientX < right && clientY > top && clientY < bottom;
};

startZone.onpointerdown = (event: PointerEvent): void => {
  const element = document.createElement('div');
  element.classList.add('element');
  element.style.backgroundColor = getRandomHSLColor();
  element.style.zIndex = '10';

  moveElement(element, event);
  startZone.append(element);

  document.onpointermove = (event: PointerEvent): void => {
    moveElement(element, event);
  };

  document.onpointerup = (event: PointerEvent): void => {
    element.style.zIndex = '1';

    if (isElementInTargetZone(alignZone, event)) {
      element.style.position = 'static';
      alignZone.prepend(element);
    } else if (isElementInTargetZone(freeZone, event)) {
      const x = event.clientX - freeZone.offsetLeft - element.offsetWidth / 2;
      const y = event.clientY - freeZone.offsetTop - element.offsetHeight / 2;

      setElementCoords(element, x, y);

      freeZone.append(element);
    } else {
      element.remove();
    }

    document.onpointermove = null;
    document.onpointerup = null;
  };
};
