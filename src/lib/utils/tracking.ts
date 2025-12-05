function track(payload: object) {
  if (process.env.NODE_ENV === "production") {
    // @ts-expect-error - window.gtag is not typed
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    window.gtag("event", "conversion", payload);
  }
}

export function trackJoinWaitlist() {
  track({
    send_to: "AW-17050543013/Bc9MCOietcEaEKXHqsI_",
    value: 1.0,
    currency: "USD",
  });
}

export function trackSignup() {
  //todo
}
