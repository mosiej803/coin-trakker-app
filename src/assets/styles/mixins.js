import { theme } from './theme';

export const scrollbar = () => {
  return `
        &::-webkit-scrollbar {
            width: 10px;
            height: 10px;
        }

        &::-webkit-scrollbar-track {
            background-color: ${theme.colors.tintSecondary.dark5};
        }
        
        &::-webkit-scrollbar-thumb {
            box-shadow: inset 0 0 9px 7px ${theme.colors.tintSecondary.dark11};
            border-radius: 5px;
        }
    `;
};

export const getChangeColor = (change, theme) => {
  if (!change) return '';
  if (change < 1) return theme.colors.red;
  if (change >= 1) return theme.colors.primary;
};
