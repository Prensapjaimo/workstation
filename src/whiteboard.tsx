import { ElementRef, useRef, useState, useContext, useEffect } from "react";
import Movable from "./components/movable";
import { WidgetData } from "./types";
import { WidgetProviderContext } from "./components/widget-provider";
import { Button } from "./components/ui/button";

function Whiteboard() {
  const whiteboardRef = useRef<ElementRef<"div">>(null);
  const [whiteboardHeight, setWhiteboardHeight] = useState(0);

  const { widget } = useContext(WidgetProviderContext);

  const [indexes, setIndexes] = useState<number[]>([]);

  useEffect(() => {
    widget.forEach((_widget, i) => {
      setIndexes([...indexes, i]);
    });
    console.log(indexes);
  }, [widget]);

  // const changeZIndex = (i: number) => {
  //   const max = Math.max(...indexes);
  //   const maxindex = indexes.indexOf(max);
  //   const temp = max;
  //   indexes[maxindex] = indexes[i];
  //   indexes[i] = temp;
  //   setIndexes(indexes);
  //   console.log(indexes);
  // };

  return (
    <div
      ref={whiteboardRef}
      className="w-full h-full"
      onMouseEnter={() => {
        if (whiteboardRef.current != null) {
          setWhiteboardHeight(
            parseFloat(window.getComputedStyle(whiteboardRef.current).height)
          );
        }
      }}
    >
      <Movable
        key={1234}
        i={0}
        indexes={indexes}
        setIndexes={setIndexes}
        whiteboardHeight={whiteboardHeight}
        data={{
          name: "test",
          body: (
            <div>
              werewrwer
              <Button variant="ghost">Click me</Button>
            </div>
          ),
          resizable: true,
        }}
      ></Movable>
      {widget.map((data, i) => (
        <Movable
          key={i}
          i={i}
          indexes={indexes}
          setIndexes={setIndexes}
          whiteboardHeight={whiteboardHeight}
          data={data}
        ></Movable>
      ))}
    </div>
  );
}

export default Whiteboard;
