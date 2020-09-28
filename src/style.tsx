import styled from "styled-components";
import { GridContainer } from "./common/grid-container";

export const AppContainer = styled(GridContainer)`
  max-width: 768px;
  margin: 12px auto;
  border-radius: 15px;
  border: 2px solid #cfcfcf;
  padding: 12px;
`;

export const ListContainer = styled(GridContainer)`
  height: calc(100vh - 100px - 30px);
  overflow: scroll;
  border-radius: 12px;
  border: 2px solid #cfcfcf;
  padding: 12px;
  background-color: #afafaf;
`;

export const ItemContainer = styled.div`
  position: relative;
  background-color: #ffffff;
  padding: 8px;
  border-radius: 8px;

  &:last-child {
    margin-bottom: 12px;
  }
`;

export const RemoveItem = styled.div`
  position: absolute;
  top: 5px;
  right: 20px;
  color: #ff0000;
  cursor: pointer;
`;

export const ItemText = styled.p`
  /* Adding this rule so we can join the array of strings with newline */
  white-space: pre-line;
`;

export const ScrollToBottomButton = styled.button`
  position: absolute;
  bottom: 5px;
  z-index: 100;
  left: 0;
  right: 0;
  margin: auto;
  width: 25%;
`;
