import React, {
  FC,
  useRef,
  useState,
  useEffect,
  useCallback,
  Ref,
} from "react";
import {
  DragDropContext,
  DropResult,
  Droppable,
  DroppableProvided,
  Draggable,
} from "react-beautiful-dnd";
import {
  ListContainer,
  ScrollToBottomButton,
  ItemContainer,
  ItemText,
  RemoveItem,
} from "../style";
import {
  AutoSizer,
  ScrollParams,
  CellMeasurerCache,
  ListRowRenderer,
  CellMeasurer,
  List,
} from "react-virtualized";
import ReactDOM from "react-dom";

interface VirtualizedListProps {
  listItems: string[];
  setListItems: (items: string[]) => void;
}

const VirtualizedList: FC<VirtualizedListProps> = ({
  listItems,
  setListItems,
}) => {
  /* 
  
    Ref to keep track of the list so we can set its scroll position
  
  */
  const [listRef, setListRef] = useState<List | null>(null);

  /* 
  
    Ref to track the list so we can show a back to bottom prompt if tis scrolled up
  
  */
  const [showScrollToBottom, setShowScrollToBottom] = useState<boolean>(false);

  /* 
  
    Declare a cache that will store the height of the rows in the list
    This is useful because if we have thousands of rows, we dont need to calc the heights each time one comes into view
  
  */
  const cache = new CellMeasurerCache({
    fixedWidth: true,
    defaultHeight: 320,
  });

  /* 
  
    This will render a draggable list row, by auto sizing the row based on its parent (ie. List) component
  
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
        <Draggable key={index} draggableId={`draggable-${index}`} index={index}>
          {(provided, snapshot) => (
            <ItemContainer
              ref={provided.innerRef}
              {...provided.draggableProps}
              {...provided.dragHandleProps}
            >
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
          )}
        </Draggable>
      </div>
    </CellMeasurer>
  );

  /* 
  
    When we add list items, re compute the grid size and scroll to the bottom of the list
  
  */
  useEffect(() => {
    if (listRef && listItems.length) {
      listRef.measureAllRows();
      goToBottomOfList();
    }
  }, [listItems]);

  /* 
  
    Function to scroll to the bottom of the list
  
  */
  const goToBottomOfList = useCallback(
    () => listRef && listRef.scrollToRow(listItems.length - 1),
    [listItems]
  );

  return (
    <ListContainer rowGap="12px">
      <DragDropContext
        onDragEnd={({ source, destination }) => {
          if (!destination) {
            return;
          }

          const newData = [...listItems];
          const [removedItem] = newData.splice(source.index, 1);
          newData.splice(destination.index, 0, removedItem);
          setListItems(newData);
        }}
      >
        {/* Show a scroll to bottom of list prompt if scrolled up */}
        {!!(showScrollToBottom && listItems.length) && (
          <ScrollToBottomButton onClick={() => goToBottomOfList()}>
            Scroll to Bottom
          </ScrollToBottomButton>
        )}
        {/* AutoSizer will allow the virtualzied list to be the width and height of its parent */}
        <AutoSizer>
          {({ width, height }) => (
            <Droppable
              renderClone={(provided, _, rubric) => (
                <ItemContainer
                  {...provided.draggableProps}
                  {...provided.dragHandleProps}
                  ref={provided.innerRef}
                >
                  {rubric.source.index}
                  <ItemText>{listItems[rubric.source.index]}</ItemText>
                </ItemContainer>
              )}
              mode="virtual"
              droppableId="droppable-list"
            >
              {(provided, snapshot) => (
                <List
                  // ref={listRef}
                  ref={(ref) => {
                    // react-virtualized has no way to get the list's ref that I can so
                    // So we use the `ReactDOM.findDOMNode(ref)` escape hatch to get the ref
                    if (ref) {
                      setListRef(ref);
                      // eslint-disable-next-line react/no-find-dom-node
                      const whatHasMyLifeComeTo = ReactDOM.findDOMNode(ref);
                      if (whatHasMyLifeComeTo instanceof HTMLElement) {
                        provided.innerRef(whatHasMyLifeComeTo);
                      }
                    }
                  }}
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
                    if (listRef && listRef.props.scrollToRow) {
                      listRef.scrollToRow(undefined);
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
            </Droppable>
          )}
        </AutoSizer>
      </DragDropContext>
    </ListContainer>
  );
};

export default VirtualizedList;
