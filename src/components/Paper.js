/* eslint-disable import/prefer-default-export */
import styled from 'styled-components';

export const Paper = styled.div`
  display: flex;
  flex-direction: column;
  width: ${p => (p.width ? p.width : '100%')};
  background-color: ${p =>
    p.highlight ? p.theme.ongoing : p.theme.paperBackground};
  border: 1px solid
    ${p => (p.highlight ? 'rgba(0,0,0,0.2)' : p.theme.borderColor)};
  border-radius: 4px;
  ${p => p.padding && 'padding: 16px;'};
  ${p => p.center && 'justify-content: center; align-items: center;'}
  box-shadow: ${p =>
    p.highlight
      ? '0px 1px 5px 0px rgba(0,0,0,0.2),0px 2px 2px 0px rgba(0,0,0,0.14),0px 3px 1px -2px rgba(0,0,0,0.12)'
      : 'none'};
`;
