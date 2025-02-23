// src/core/extensions/bigintExtension.ts

/* eslint-disable no-extend-native */

export {};

declare global {
  interface BigInt {
    toJSON(): number;
  }
}

BigInt.prototype.toJSON = function (): number {
  return Number(this.toString());
};
