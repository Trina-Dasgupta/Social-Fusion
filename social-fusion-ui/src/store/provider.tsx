"use client";
import { Provider } from "react-redux";
import { makeStore } from "./store";
import { ReactNode } from "react";

const store = makeStore();

export function ReduxProvider({ children }: { children: ReactNode }) {
  return <Provider store={store}>{children}</Provider>;
}
