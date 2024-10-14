import { loremIpsum } from "lorem-ipsum";
import { AutoSizer, List } from "react-virtualized";
import "./App.css";
import ListItem from "./components/ListItem";

export default function App() {
  // react vertualised helps to optimise the frontend performance
  //by realising the dom node that is out of the viewport. in devtools ctr + shift + p then //rendering show frame can show the purformance
  // one limitaton is that its row hieght and width must be define fixed way then list height also but if i use autoresizer than no need to use list height rowheight
  // vertualised is for big data for 100 data i should not use it
  // it has an issue so another packege need to install and configured
  // npm i esbuild-plugin-react-virtualized
  //// vite.config.js place this code bellow
  // import { defineConfig } from 'vite'
  // import fixReactVirtualized from 'esbuild-plugin-react-virtualized'

  // export default defineConfig({
  //   optimizeDeps: {
  //     esbuildOptions: {
  //       plugins: [fixReactVirtualized],
  //     },
  //   },
  // })
  // vertulised fixed code ends here

  const rowCount = 5000;
  // const listHeight = 700;
  const rowHeight = 50;
  // const rowWidth = 900;

  // creat a array of object to render . i can fetch data from the backend then no need this portion
  const list = Array(rowCount)
    .fill()
    .map((val, id) => {
      return {
        id,
        name: "Sumit Saha",
        image: "https://via.placeholder.com/40",
        text: loremIpsum({
          count: 1,
          units: "sentences",
          sentenceLowerBound: 4,
          sentenceUpperBound: 8,
        }),
      };
    });

  // render row function provide index, key, style  this
  function renderRow({ index, key, style }) {
    return (
      <ListItem //this will be my list that rendered  in dom
        key={key}
        name={list[index].name}
        text={list[index].text}
        image={list[index].image}
        style={style}
      />
    );
  }

  return (
    <div className="App">
      <div className="list">
        <AutoSizer>
          {/*  auto resizer need function  */}
          {({ width, height }) => (
            <List
              width={width}
              height={height}
              rowHeight={rowHeight}
              rowCount={rowCount}
              rowRenderer={renderRow} // this is  the renderer func
              overscanColumnCount={5}
            />
          )}
        </AutoSizer>
      </div>
    </div>
  );
}
