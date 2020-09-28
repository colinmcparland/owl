import React, { FC, useRef, useState, useCallback, useEffect } from "react";
import { GridContainer } from "./common/grid-container";
import styled from "styled-components";
import { loremIpsum } from "react-lorem-ipsum";
import {
  List,
  ListRowRenderer,
  AutoSizer,
  CellMeasurer,
  CellMeasurerCache,
  ScrollParams,
} from "react-virtualized";

const AppContainer = styled(GridContainer)`
  max-width: 768px;
  margin: 12px auto;
  border-radius: 15px;
  border: 2px solid #cfcfcf;
  padding: 12px;
`;

const ListContainer = styled(GridContainer)`
  height: calc(100vh - 100px - 30px);
  overflow: scroll;
  border-radius: 12px;
  border: 2px solid #cfcfcf;
  padding: 12px;
  background-color: #afafaf;
`;

const ItemContainer = styled.div`
  position: relative;
  background-color: #ffffff;
  padding: 8px;
  border-radius: 8px;

  &:last-child {
    margin-bottom: 12px;
  }
`;

const RemoveItem = styled.div`
  position: absolute;
  top: 5px;
  right: 20px;
  color: #ff0000;
  cursor: pointer;
`;

const ItemText = styled.p`
  /* Adding this rule so we can join the array of strings with newline */
  white-space: pre-line;
`;

const ScrollToBottomButton = styled.button`
  position: absolute;
  bottom: 5px;
  z-index: 100;
  left: 0;
  right: 0;
  margin: auto;
  width: 25%;
`;

const App: FC = () => {
  /* 
  
    Ref to track the contents of the input
  
  */
  const inputRef = useRef<HTMLInputElement>(null);

  /* 
  
    Ref to keep track of the list so we can set its scroll position
  
  */
  const listRef = useRef<List>(null);

  /* 
  
    Ref to track the list so we can show a back to bottom prompt if tis scrolled up
  
  */
  const [showScrollToBottom, setShowScrollToBottom] = useState<boolean>(false);

  /* 
  
    Keep track of the total number of rows in the list
  
  */
  const [listItems, setListItems] = useState<string[]>([]);

  /* 
  
    Declare a cache that will store the height of the rows in the list
    This is useful because if we have thousands of rows, we dont need to calc the heights each time one comes into view
  
  */
  const cache = new CellMeasurerCache({
    fixedWidth: true,
    defaultHeight: 320,
  });

  /* 
  
    This will render a list row, by auto sizing the row based on its parent (ie. List) component
  
  */
  const renderRow: ListRowRenderer = ({ index, key, style, parent }) => (
    <CellMeasurer
      key={key}
      cache={cache}
      parent={parent}
      columnIndex={0}
      rowIndex={index}
    >
      <div key={key} style={style} className="row">
        <ItemContainer>
          {index}
          <ItemText>{listItems[index]}</ItemText>
          <RemoveItem
            onClick={() => {
              const listItemsClone = [...listItems];
              listItemsClone.splice(index, 1);
              setListItems(listItemsClone);
            }}
          >
            X
          </RemoveItem>
        </ItemContainer>
      </div>
    </CellMeasurer>
  );

  /* 
  
    Function to scroll to the bottom of the list
  
  */
  const goToBottomOfList = useCallback(
    () =>
      listRef &&
      listRef.current &&
      listRef.current.scrollToRow(listItems.length - 1),
    [listItems]
  );

  /* 
  
    When the user hits the 'Generate' button, add items to the list and clear the input
  
  */
  const onGenerate = useCallback(() => {
    if (inputRef && inputRef.current && inputRef.current.value) {
      // Generate the new list items with between 1-3 lipsum paragraphs
      const newListItems: string[] = new Array(parseInt(inputRef.current.value))
        .fill(0)
        .map(() => loremIpsum({ p: Math.random() * 3 + 1 }).join("\n\n"));

      // Add the new items to the list
      setListItems([...listItems, ...newListItems]);
    }
  }, [listItems]);

  /* 
  
    When we add list items, re compute the grid size and scroll to the bottom of the list
  
  */
  useEffect(() => {
    if (listRef && listRef.current && listItems.length) {
      listRef.current.measureAllRows();
      goToBottomOfList();
    }
  }, [listItems]);

  return (
    <AppContainer rowGap="25px">
      {/* Input field and buttons */}
      <GridContainer columnGap="6px" columns="50% 1fr 1fr">
        <input type="number" ref={inputRef} placeholder="# of Items" />
        <button onClick={() => onGenerate()}>Generate</button>
        <button onClick={() => setListItems([])}>Reset</button>
      </GridContainer>

      {/* List container */}
      <ListContainer rowGap="12px">
        {/* Show a scroll to bottom of list prompt if scrolled up */}
        {!!(showScrollToBottom && listItems.length) && (
          <ScrollToBottomButton onClick={() => goToBottomOfList()}>
            Scroll to Bottom
          </ScrollToBottomButton>
        )}
        {/* AutoSizer will allow the virtualzied list to be the width and height of its parent */}
        <AutoSizer>
          {({ width, height }) => (
            <List
              estimatedRowSize={320}
              ref={listRef}
              deferredMeasurementCache={cache}
              rowHeight={cache.rowHeight}
              width={width}
              height={height}
              rowRenderer={renderRow}
              rowCount={listItems.length}
              scrollToAlignment="end"
              onScroll={({
                scrollTop,
                clientHeight,
                scrollHeight,
              }: ScrollParams) => {
                // Reset the scrollToRow property of the list
                if (
                  listRef &&
                  listRef.current &&
                  listRef.current.props.scrollToRow
                ) {
                  listRef.current.scrollToRow(undefined);
                }

                // If we have reached the bottom of the list, hide the 'Scroll to Bottom' prompt
                // Otherwise, show it
                if (scrollHeight === clientHeight + scrollTop) {
                  setShowScrollToBottom(false);
                } else {
                  setShowScrollToBottom(true);
                }
              }}
            />
          )}
        </AutoSizer>
      </ListContainer>
    </AppContainer>
  );
};

export default App;
