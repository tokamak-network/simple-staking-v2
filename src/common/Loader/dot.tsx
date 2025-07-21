import styled, { keyframes } from "styled-components";

const blink = keyframes`
  0% {
    opacity: 1;
  }
  50% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
`;
export const Dot = styled.span`
  animation: 1.5s ${blink} infinite;
  height: 12px;
  width: 12px;
  background-color: #2a72e5;
  border-radius: 100px;
  &:nth-child(1) {
    animation-delay: 0ms;
    
  }
  &:nth-child(2) {
    animation-delay: 300ms;
    margin-right: 7px;
    margin-left: 7px;
    
  }
  &:nth-child(3) {
    animation-delay: 600ms;
  }
  &:nth-child(4) {
    animation-delay: 900ms;
    margin-left: 7px;
  }
`;
