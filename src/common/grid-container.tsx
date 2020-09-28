import React, { FC } from "react";
import styled, { css } from "styled-components";

interface GridContainerProps {
  columnGap?: string;
  rowGap?: string;
  columns?: string;
  rows?: string;
}

const StyledGridContainer = styled.div<GridContainerProps>`
  display: grid;

  ${(props) =>
    props.columnGap &&
    css`
      grid-column-gap: ${props.columnGap};
    `}

  ${(props) =>
    props.rowGap &&
    css`
      grid-row-gap: ${props.rowGap};
    `}

  ${(props) =>
    props.columns &&
    css`
      grid-template-columns: ${props.columns};
    `}

  ${(props) =>
    props.rows &&
    css`
      grid-template-rows: ${props.rows};
    `}
`;

export const GridContainer: FC<GridContainerProps> = (props) => (
  <StyledGridContainer {...props} />
);
