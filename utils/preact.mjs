import htm from "../vendor/htm@3.1.1.mjs";

const { render, createContext } = window.preact;

const { useContext, useEffect, useState, useCallback, useRef } =
  window.preactHooks;

const h = htm.bind(window.preact.h);

export {
  h,
  render,
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  useRef,
};
