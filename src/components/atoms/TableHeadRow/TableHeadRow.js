import styled from 'styled-components';

export const TableHeadRow = styled.tr`
  font-size: 1.4rem;
  border-bottom: 2px solid ${({ theme }) => theme.colors.tintSecondary.dark4};
  border-top: 2px solid ${({ theme }) => theme.colors.tintSecondary.dark4};

  td {
    padding-top: 1.6rem !important;
  }
`;