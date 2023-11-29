import "./style.css";
import useWebSocket from "react-use-websocket";
import { useEffect, useRef } from "react";
import {
  queryParams,
  broadcast,
  wsUrl,
  duration,
  browserId,
  waveTiming,
  waveTumbling,
  roleList,
} from "./constant";
import { compassLogic } from "./helper";

let waveAnimation;
let isPausedInterval = false;

export default function App() {
  const element = useRef();
  const { sendJsonMessage } = useWebSocket(
    wsUrl,
    {
      queryParams: {
        id: browserId,
      },
      onError: () => alert("error websocket"),
      onMessage: ({ data }) => {
        if (browserId !== "compass") return;

        const jsonMessage = JSON.parse(data).filter(
          (item) => item.browserId !== browserId
        );

        compassLogic(jsonMessage, element);
      },
    },
    roleList.some(({ value }) => value === browserId)
  );

  useEffect(() => {
    const interval = setInterval(
      () =>
        !isPausedInterval &&
        sendJsonMessage({
          screenX: window.screenX,
          screenY: window.screenY,
          width: window.outerWidth,
          height: window.innerHeight,
        }),
      duration
    );

    if (browserId !== "compass") {
      waveAnimation = element.current.animate(waveTumbling, waveTiming);
    }

    return () => clearInterval(interval);
  }, []);

  broadcast.onmessage = ({ data }) => {
    if (data === "pause") pauseAnimation(isPausedInterval, waveAnimation);
    if (data === "play") playAnimation(isPausedInterval, waveAnimation);
  };

  const changeBrowserId = ({ target }) => {
    queryParams.set("id", target.value);
    window.location.search = queryParams.toString();
  };

  const pauseAnimation = () => {
    isPausedInterval = true;
    waveAnimation?.pause();
  };
  const playAnimation = () => {
    isPausedInterval = false;
    waveAnimation?.play();
  };

  const pause = () => {
    broadcast.postMessage("pause");
    pauseAnimation();
  };
  const play = () => {
    broadcast.postMessage("play");
    playAnimation();
  };

  const iconRole = roleList.find(({ value }) => value === browserId)?.label;

  return (
    <div className="main">
      <div>
        <button onClick={play}>play</button>
        <button onClick={pause}>pause</button>
        <select onChange={changeBrowserId}>
          <option disabled selected hidden>
            Select role
          </option>
          {roleList.map(({ label, value }) => (
            <option key={value} value={value} selected={value === browserId}>
              {label}
            </option>
          ))}
        </select>
      </div>

      <div ref={element} className="ball">
        {iconRole}
      </div>
    </div>
  );
}
