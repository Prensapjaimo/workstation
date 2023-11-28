import { HTMLReactParserOptions, domToReact } from "html-react-parser";
import { cn } from "./lib/utils";

import { Button } from "@/components/ui/button";

// https://github.com/remarkablemark/html-react-parser#replace-element-and-children
const options: HTMLReactParserOptions = {
  replace(domNode) {
    console.log(domNode);
    if (domNode.name == "button") {
      return (
        <Button {...domNode.attribs}>{domToReact(domNode.children)}</Button>
      );
    } else if (domNode.name == "h1") {
      return (
        <h1 className={cn("font-extrabold", domNode.attribs.class)}>
          {domToReact(domNode.children)}
        </h1>
      );
    }
  },
};

export default options;
