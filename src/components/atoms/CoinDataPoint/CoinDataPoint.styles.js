import styled from 'styled-components';
import { getChangeColor } from 'assets/styles/mixins';

export const Wrapper = styled.div`
  min-width: ${({ isS }) => {
    if (isS) return '8rem';
    return '11rem';
  }};

  display: flex;
  flex-direction: column;
  gap: 0.6rem;
`;

export const Description = styled.div`
  font-size: 1.4rem;
  color: ${({ theme }) => theme.colors.tintSecondary.light10};
`;

export const DataPoint = styled.div`
  font-size: 2rem;
  color: ${({ theme, change }) => getChangeColor(change, theme)};
`;
