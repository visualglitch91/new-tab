import { css, keyframes } from "@emotion/react";
import styled from "@emotion/styled";

function cx(...classNames: (string | null | undefined | false)[]) {
  return classNames.filter(Boolean).join(" ");
}

export { styled, css, keyframes, cx };
