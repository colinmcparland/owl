import React, { FC, useState } from "react";
import { AppContainer } from "./style";
import VirtualizedList from "./components/list";
import Toolbar from "./components/toolbar";

const App: FC = () => {
  /* 
  
    Keep track of the total number of rows in the list
  
  */
  const [listItems, setListItems] = useState<string[]>([]);

  return (
    <AppContainer rowGap="25px">
      {/* Input field and buttons */}
      <Toolbar listItems={listItems} setListItems={setListItems} />

      {/* List container */}
      <VirtualizedList listItems={listItems} setListItems={setListItems} />
    </AppContainer>
  );
};

export default App;
