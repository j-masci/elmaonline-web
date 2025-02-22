import React from 'react';
import { Button as MuiButton } from '@material-ui/core';
import styled from 'styled-components';
import { Link as ReachLink } from '@reach/router';

const StyledButton = styled(MuiButton)`
  && {
    ${p => p.margin && `margin: ${p.margin};`}
    ${p => p.little && 'font-size: 0.8125rem;'}
    ${p => p.right && `margin-right: ${p.theme.padXXSmall};`}
    padding: ${p =>
      p.little
        ? `${p.to ? 0 : p.theme.padXXSmall} ${p.to ? 0 : p.theme.padXXSmall}`
        : `${p.to ? 0 : p.theme.padXSmall} ${p.to ? 0 : p.theme.padMedium}`};
    a {
      display: block;
      padding: ${p =>
        p.little
          ? `${p.theme.padXXSmall} ${p.theme.padXXSmall}`
          : `${p.theme.padXSmall} ${p.theme.padMedium}`};
    }
  }
`;

const Button = ({
  children,
  onClick, // use this to execute some js function
  margin,
  disabled,
  secondary,
  naked,
  little,
  to, // use this to create a normal link
  right,
}) => {
  let color = 'primary';
  let variant = 'contained';
  if (secondary) {
    color = 'secondary';
  }
  if (naked) {
    color = 'default';
    variant = 'text';
  }
  return (
    <StyledButton
      right={right}
      disabled={disabled}
      margin={margin}
      variant={variant}
      color={color}
      little={little}
      onClick={() => onClick && onClick()}
      to={to}
    >
      {to ? <ReachLink to={to}>{children}</ReachLink> : <>{children}</>}
    </StyledButton>
  );
};

export default Button;
