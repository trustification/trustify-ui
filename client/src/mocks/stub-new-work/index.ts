import { type RequestHandler } from "msw";
import { config } from "../config";

const enableMe = (me: string) =>
  config.stub === "*" ||
  (Array.isArray(config.stub) ? (config.stub as string[]).includes(me) : false);

/**
 * Return the stub-new-work handlers that are enabled by config.
 */
const enabledStubs: RequestHandler[] = [].filter(Boolean);

export default enabledStubs;
