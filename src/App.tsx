import { ThemeProvider } from "@/components/theme-provider";
import { WidgetProvider } from "@/components/widget-provider";
import { Toaster } from "@/components/ui/toaster";

import Navbar from "@/navbar";
import Whiteboard from "@/whiteboard";

function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <WidgetProvider>
        <div className="h-screen w-screen bg-background overflow-hidden flex flex-col">
          <Navbar />
          <Whiteboard />
        </div>
        <Toaster />
      </WidgetProvider>
    </ThemeProvider>
  );
}

export default App;
