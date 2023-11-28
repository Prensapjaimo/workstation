import { WidgetData } from "@/types";
import { createContext, useState } from "react";

type WidgetProviderState = {
  widget: WidgetData[];
  addWidget: (widget: WidgetData) => void;
};

const initialState: WidgetProviderState = {
  widget: [],
  addWidget: () => null,
};

export const WidgetProviderContext =
  createContext<WidgetProviderState>(initialState);

export function WidgetProvider({
  children,
  ...props
}: {
  children: React.ReactNode;
}) {
  const [widget, addWidget] = useState<WidgetData[]>([]);

  const value = {
    widget,
    addWidget: (widget: WidgetData) => {
      addWidget((oldWidgets) => [...oldWidgets, widget]);
    },
  };

  return (
    <WidgetProviderContext.Provider {...props} value={value}>
      {children}
    </WidgetProviderContext.Provider>
  );
}
