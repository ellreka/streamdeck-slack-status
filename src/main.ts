const ACTIONS = {
  UPDATE_STATUS: "net.ellreka.slack-status.update-status",
};

// @ts-expect-error
const connectElgatoStreamDeckSocket = (
  inPort: number,
  inPluginUUID: string,
  inRegisterEvent: any,
  inInfo: any
) => {
  const ws = new WebSocket(`ws://127.0.0.1:${inPort}`);
  ws.addEventListener("open", () => {
    console.log({
      event: inRegisterEvent,
      uuid: inPluginUUID,
    });
    ws.send(
      JSON.stringify({
        event: inRegisterEvent,
        uuid: inPluginUUID,
      })
    );
  });

  ws.addEventListener("message", async (e) => {
    const data = JSON.parse(e.data);
    const { event, payload, action } = data;
    console.log(data);
    switch (event) {
      case "keyDown":
        switch (action) {
          case ACTIONS.UPDATE_STATUS:
            await changeStatus(payload.settings);
            break;
        }
        break;
    }
  });
};

const changeStatus = async (payload: {
  apiToken: string;
  statusText: string;
  statusEmoji: string;
  statusExpiration: string;
}) => {
  console.log({ payload });
  const data = {
    profile: {
      status_emoji: payload.statusEmoji,
      status_text: payload.statusText,
      status_expiration: Number(payload.statusExpiration),
    },
  };
  const response = await fetch("https://slack.com/api/users.profile.set", {
    method: "POST",
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      Authorization: `Bearer ${payload.apiToken}`,
    },
    body: JSON.stringify(data),
  }).then((res) => {
    return res.json();
  });
  console.log(response);
};
