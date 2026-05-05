import type { Server } from "node:http";

import { afterAll, beforeAll, describe, expect, it } from "vitest";

import { app } from "../../src/server";

let server: Server;
let apiUrl: string;

beforeAll(() => {
  server = app.listen(0);

  const address = server.address();

  if (!address || typeof address === "string") {
    throw new Error("Could not start test server");
  }

  apiUrl = `http://127.0.0.1:${address.port}`;
});

afterAll(() => {
  server.close();
});

describe("API - Health", () => {
  it("should return status ok", async () => {
    const response = await fetch(`${apiUrl}/health`);
    const output = await response.json();

    expect(response.status).toBe(200);
    expect(output).toEqual({ status: "ok" });
  });
});
