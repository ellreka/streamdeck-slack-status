let ws: WebSocket | null = null;
let uuid = "";

// @ts-expect-error
const connectElgatoStreamDeckSocket = (
  inPort: number,
  inPluginUUID: string,
  inRegisterEvent: any,
  inInfo: any,
  inActionInfo: string
) => {
  const actionInfo = JSON.parse(inActionInfo);
  const settings = actionInfo.payload.settings;
  console.log({ settings });
  uuid = inPluginUUID;
  ws = new WebSocket(`ws://127.0.0.1:${inPort}`);
  ws.addEventListener("open", () => {
    console.log({
      event: inRegisterEvent,
      uuid: inPluginUUID,
    });
    if (ws == null) return;
    ws.send(
      JSON.stringify({
        event: inRegisterEvent,
        uuid: inPluginUUID,
      })
    );
    ws.send(
      JSON.stringify({
        event: "getSettings",
        context: uuid,
      })
    );
  });

  const apiToken = document.querySelector<HTMLInputElement>("#api-token");
  const statusEmoji = document.querySelector<HTMLInputElement>("#status-emoji");
  const statusText = document.querySelector<HTMLInputElement>("#status-text");
  const statusExpiration =
    document.querySelector<HTMLInputElement>("#status-expiration");

  if (apiToken != null) {
    apiToken.value = settings?.apiToken ?? "";
    apiToken.addEventListener("change", (event: any) => {
      sendValueToPlugin(event.target.value, "apiToken", settings);
    });
  }
  if (statusEmoji != null) {
    statusEmoji.value = settings?.statusEmoji ?? "";
    statusEmoji.addEventListener("change", (event: any) => {
      sendValueToPlugin(event.target.value, "statusEmoji", settings);
    });
  }
  if (statusText != null) {
    statusText.value = settings?.statusText ?? "";
    statusText.addEventListener("change", (event: any) => {
      sendValueToPlugin(event.target.value, "statusText", settings);
    });
  }
  if (statusExpiration != null) {
    statusExpiration.value = settings?.statusExpiration ?? "";
    statusExpiration.addEventListener("change", (event: any) => {
      sendValueToPlugin(event.target.value, "statusExpiration", settings);
    });
  }
};

const sendValueToPlugin = (value: string, param: string, settings: any) => {
  if (ws == null) return;
  ws.send(
    JSON.stringify({
      event: "setSettings",
      context: uuid,
      payload: {
        ...settings,
        [param]: value,
      },
    })
  );
};
