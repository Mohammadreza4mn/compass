const queryParams = new URL(window.location as unknown as string).searchParams;
const broadcast = new BroadcastChannel("compassBroadcast");

const wsUrl = "ws://127.0.0.1:8080";
const duration = 1000;

type RoleType = (typeof roleList)[number]["value"];
const browserId = queryParams.get("id") as RoleType;

const waveTiming = {
  duration,
  direction: "alternate",
  iterations: Infinity,
};
const waveTumbling = {
  filter: [
    "drop-shadow(0px 0px 0px black)",
    "drop-shadow(0px 0px 7px black)",
    "drop-shadow(0px 0px 0px black)",
  ],
  scale: [6.3, 7, 6.3],
};

const roleList = [
  { label: "💎", value: "gemstone" },
  { label: "🧭", value: "compass" },
  { label: "👑", value: "crown" },
  { label: "💰", value: "monyBag" },
] as const;

export {
  queryParams,
  broadcast,
  wsUrl,
  duration,
  browserId,
  waveTiming,
  waveTumbling,
  roleList,
};
