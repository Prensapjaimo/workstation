import { ElementRef, useEffect, useReducer, useRef, useState } from "react";

import { GripHorizontal, ArrowDownRight } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import { cn } from "@/lib/utils";
import { WidgetData } from "@/types";

interface MovableProps extends React.ComponentPropsWithoutRef<"div"> {
  i: number;
  whiteboardHeight: number;
  indexes: number[];
  setIndexes: React.Dispatch<React.SetStateAction<number[]>>;
  data: WidgetData;
}

function Movable({
  i,
  className,
  whiteboardHeight,
  indexes,
  setIndexes,
  data,
}: MovableProps) {
  const contentRef = useRef<ElementRef<"div">>(null);
  const movableRef = useRef<ElementRef<"div">>(null);

  // Drag n drop
  let offsetX = 0;
  let offsetY = 0;

  const dragMouseDown = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    const { pageX, pageY } = e;

    if (movableRef.current) {
      offsetX =
        pageX -
        +movableRef.current.style.left.slice(
          0,
          movableRef.current.style.left.length - 2
        );
      offsetY =
        pageY -
        +movableRef.current.style.top.slice(
          0,
          movableRef.current.style.top.length - 2
        );
    }

    document.body.style.userSelect = "none";

    document.addEventListener("mousemove", dragMouseMove);
    document.addEventListener("mouseup", dragMouseUp);
  };

  const dragMouseMove = (e: MouseEvent) => {
    const { pageX, pageY } = e;

    if (movableRef.current) {
      movableRef.current.style.top = `${dragWithinLimits(
        pageY - offsetY,
        document.body.clientHeight - whiteboardHeight,
        document.body.clientHeight - 1,
        movableRef,
        "y"
      )}px`;

      movableRef.current.style.left = `${dragWithinLimits(
        pageX - offsetX,
        0,
        document.body.clientWidth - 1,
        movableRef,
        "x"
      )}px`;
    }
  };

  const dragMouseUp = () => {
    document.body.style.userSelect = "auto";

    document.removeEventListener("mousemove", dragMouseMove);
    document.removeEventListener("mouseup", dragMouseUp);
  };

  const dragWithinLimits = (
    value: number,
    bottomlimit: number,
    toplimit: number,
    element: React.RefObject<HTMLDivElement>,
    axis: "x" | "y"
  ): number => {
    if (element.current) {
      if (axis == "x") {
        if (value + element.current.clientWidth > toplimit) {
          return toplimit - element.current.clientWidth;
        }
      }

      if (axis == "y") {
        if (value + element.current.clientHeight > toplimit) {
          return toplimit - element.current.clientHeight;
        }
      }

      if (value < bottomlimit) {
        return bottomlimit;
      }
    }
    return value;
  };

  // Resizing
  // const [startX, setStartX] = useState(0);
  // const [startY, setStartY] = useState(0);
  let startX = 0;
  let startY = 0;

  // const [prevWidth, setPrevWidth] = useState(0);
  // const [prevHeight, setPrevHeight] = useState(0);
  let prevHeight = 0;
  let prevWidth = 0;

  const resizeMouseDown = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    const { pageX, pageY } = e;

    // setStartX(pageX);
    // setStartY(pageY);
    startX = pageX;
    startY = pageY;

    if (movableRef.current && contentRef.current) {
      //   // setPrevHeight(parseFloat(contentRef.current.style.height));
      //   // setPrevWidth(parseFloat(movableRef.current.style.width));
      prevHeight = contentRef.current.getBoundingClientRect().height;
      prevWidth = movableRef.current.getBoundingClientRect().width;
    }

    document.body.style.userSelect = "none";

    document.addEventListener("mousemove", resizeMouseMove);
    document.addEventListener("mouseup", resizeMouseUp);
  };

  const resizeMouseMove = (e: MouseEvent) => {
    const { pageX, pageY } = e;

    if (movableRef.current && contentRef.current) {
      movableRef.current.style.width = `${prevWidth + pageX - startX}px`;
      contentRef.current.style.height = `${prevHeight + pageY - startY}px`;
    }
  };

  const resizeMouseUp = () => {
    document.body.style.userSelect = "auto";

    // if (movableRef.current && contentRef.current) {
    //   // setPrevHeight(parseFloat(contentRef.current.style.height));
    //   // setPrevWidth(parseFloat(movableRef.current.style.width));
    //   prevHeight = contentRef.current.getBoundingClientRect().height;
    //   prevWidth = movableRef.current.getBoundingClientRect().width;
    // }

    document.removeEventListener("mousemove", resizeMouseMove);
    document.removeEventListener("mouseup", resizeMouseUp);
  };

  // TODO
  // const resizeWithinLimits = ({
  //   pageX,
  //   pageY,
  // }: {
  //   pageX: number;
  //   pageY: number;
  // }) => {
  //   return (
  //     pageX < document.body.clientWidth - 10 &&
  //     pageY < document.body.clientHeight - 10
  //   );
  // };

  // z index
  const [, forceUpdate] = useReducer((x) => x + 1, 0);
  const changeZIndex = () => {
    const max = Math.max(...indexes);
    const maxindex = indexes.indexOf(max);
    const temp = max;
    indexes[maxindex] = indexes[i];
    indexes[i] = temp + 1;
    setIndexes(indexes);
    forceUpdate();
    console.log(indexes[i]);
  };

  return (
    <TooltipProvider>
      <div
        ref={movableRef}
        className={cn(
          "group flex flex-col absolute min-w-[10rem] max-w-full rounded-md border shadow-sm",
          className
        )}
        style={{
          zIndex: indexes[i],
          width: data.resizable ? "240px" : `${data.width}px`,
        }}
        onMouseDown={changeZIndex}
      >
        <Tooltip>
          <TooltipTrigger>
            <div
              className="h-4 bg-muted text-muted-foreground shadow-sm rounded-t-md flex justify-center items-center cursor-move"
              onMouseDown={dragMouseDown}
            >
              <GripHorizontal
                size={16}
                style={{ color: "hsla(var(--muted-foreground))" }}
              />
            </div>
          </TooltipTrigger>
          {data.name && <TooltipContent>{data.name}</TooltipContent>}
        </Tooltip>
        <div
          ref={contentRef}
          className="bg-background text-sm rounded-b-md flex flex-col justify-between min-h-[6rem] max-h-full break-words"
          style={{ height: data.resizable ? "128px" : `${data.height}px` }}
        >
          <div className="px-2 py-1">{data.body}</div>
          <div className="self-end p-[0.075rem] " onMouseDown={resizeMouseDown}>
            <ArrowDownRight
              size={12}
              strokeWidth={3}
              style={{ color: "hsla(var(--muted-foreground))" }}
              className={cn(
                "cursor-se-resize opacity-0 group-hover:opacity-100 active:opacity-100 transition-opacity ease-in-out duration-150",
                data.resizable ? "block" : "hidden"
              )}
            />
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
}

export default Movable;
