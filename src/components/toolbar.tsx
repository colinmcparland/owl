import React, { FC, useRef, useCallback } from "react";
import { loremIpsum } from "react-lorem-ipsum";
import { GridContainer } from "../common/grid-container";

interface ToolbarProps {
  listItems: string[];
  setListItems: (items: string[]) => void;
}

const Toolbar: FC<ToolbarProps> = ({ listItems, setListItems }) => {
  /* 
  
    Ref to track the contents of the input
  
  */
  const inputRef = useRef<HTMLInputElement>(null);

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

  return (
    <GridContainer columnGap="6px" rowGap="6px" columns="50% 1fr 1fr">
      <input type="number" ref={inputRef} placeholder="# of Items" />
      <button onClick={() => onGenerate()}>Generate</button>
      <button onClick={() => setListItems([])}>Reset</button>

      <div />

      {/* Save to localStorage button, disabled if list is empty */}
      <button
        disabled={!listItems.length}
        onClick={() =>
          localStorage &&
          listItems &&
          localStorage.setItem("list", JSON.stringify(listItems))
        }
      >
        Save to localStorage
      </button>

      {/* Load from localStorage button, disabled if no data to load */}
      <button
        disabled={localStorage && !localStorage.getItem("list")}
        onClick={() => {
          const lsList = localStorage.getItem("list");

          if (localStorage && lsList) {
            setListItems(JSON.parse(lsList));
          }
        }}
      >
        Load from LocalStorage
      </button>
    </GridContainer>
  );
};

export default Toolbar;
