import styled from 'styled-components';
import { scrollbar } from 'assets/styles/mixins';
import { breakPoints } from 'assets/styles/breakPoints';

export const Wrapper = styled.div`
  width: 100%;
  max-width: 84rem;
  min-height: 60rem;
  padding: 3rem 2rem;
  border-radius: 15px;
  background-color: ${({ theme }) => theme.colors.secondary};

  position: relative;
  overflow: hidden;
  ${scrollbar}
`;

export const StatsWrapper = styled.div`
  display: grid;
  grid-template-columns: 1fr 1.4fr;
  align-items: start;
  gap: 4.8rem;

  @media only screen and (max-width: ${breakPoints.m}) {
    grid-template-columns: 1fr;
    gap: 4.2rem;
    justify-content: start;
  }
`;

export const ChartWrapper = styled.div`
  position: relative;
`;

export const SideShadowWrapper = styled.div`
  width: 100%;
  overflow: auto;
  ${scrollbar}
`;

export const ChartContainer = styled.div`
  height: 100%;
  min-width: 32rem;
  display: flex;
  flex-direction: column;
  gap: 2.8rem;
`;

export const Line = styled.div`
  margin: 4rem 0;
  border-top: 2px solid ${({ theme }) => theme.colors.tintSecondary.dark5};
`;

export const SideShadow = styled.div`
  display: none;
  position: absolute;
  top: 0;
  right: 0;
  width: 3rem;
  height: 100%;
  box-shadow: inset -20px 0px 10px -14px rgba(19, 22, 30, 0.9);

  @media only screen and (max-width: ${breakPoints.s}) {
    display: block;
  }
`;
