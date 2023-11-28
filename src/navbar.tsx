import { useContext, useState } from "react";

import { ModeToggle } from "./components/mode-toggle";
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarShortcut,
  MenubarTrigger,
} from "@/components/ui/menubar";
import WidgetCreate from "@/components/widget-create";
import { WidgetProviderContext } from "@/components/widget-provider";
import { useToast } from "@/components/ui/use-toast";

function Navbar() {
  const { widget } = useContext(WidgetProviderContext);

  const [showCreateWidget, setShowCreateWidget] = useState(false);

  document.addEventListener("keydown", (e) => {
    if (e.ctrlKey && e.altKey && e.key.toLowerCase() === "n") {
      setShowCreateWidget(true);
    }
  });

  const { toast } = useToast();
  const copyToClipboard = () => {
    toast({
      title: "Widget data copied!",
      description:
        "The data for all widgets has been copied to your clipboard.",
    });
    navigator.clipboard.writeText(JSON.stringify(widget));
  };

  return (
    <div>
      <header className="border-b bg-background/95 h-14 flex items-center gap-4 px-4 justify-between">
        <Menubar>
          <MenubarMenu>
            <MenubarTrigger>File</MenubarTrigger>
            <MenubarContent>
              <MenubarItem onClick={() => setShowCreateWidget(true)}>
                New Widget <MenubarShortcut>Ctrl+Alt+T</MenubarShortcut>
              </MenubarItem>
              <MenubarSeparator />
              <MenubarItem onClick={() => copyToClipboard()}>Share</MenubarItem>
              <MenubarSeparator />
              <MenubarItem onClick={() => window.print()}>Print</MenubarItem>
            </MenubarContent>
          </MenubarMenu>
          <MenubarMenu>
            <MenubarTrigger>Edit</MenubarTrigger>
            <MenubarContent>
              <MenubarItem>
                New Tab <MenubarShortcut>⌘T</MenubarShortcut>
              </MenubarItem>
              <MenubarItem>New Window</MenubarItem>
              <MenubarSeparator />
              <MenubarItem>Share</MenubarItem>
              <MenubarSeparator />
              <MenubarItem>Print</MenubarItem>
            </MenubarContent>
          </MenubarMenu>
        </Menubar>

        <ModeToggle />
      </header>
      {/* Implement with dialog: https://ui.shadcn.com/docs/components/dialog */}
      <WidgetCreate
        className={`${showCreateWidget ? "block" : "hidden"}`}
        setShowCreateWidget={setShowCreateWidget}
      />
    </div>
  );
}

export default Navbar;
