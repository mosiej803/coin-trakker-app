import styled from 'styled-components';

export const Input = styled.input`
  position: relative;
  font-size: ${({ isSearch }) => {
    if (isSearch) return '1.5rem';
    return '1.6rem';
  }};
  width: 100%;
  padding: ${({ isAddCoin, isSearch }) => {
    if (isAddCoin) return '1.3rem 1.3rem 1.3rem 5rem';
    if (isSearch) return '1.1rem';
    return '1.3rem';
  }};
  border: none;
  box-sizing: border-box;
  border-radius: 9px;
  color: ${({ theme }) => theme.colors.tintSecondary.light2};
  background-color: ${({ theme }) => theme.colors.tintSecondary.dark4};

  &:focus {
    outline: none;
    box-shadow: -2px 2px 10px rgba(115, 124, 142, 0.3);
  }

  &::placeholder {
    color: ${({ theme }) => theme.colors.tintSecondary.light12};
  }
`;
