import { useContext, useState } from "react";
import { WidgetProviderContext } from "@/components/widget-provider";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import parse from "html-react-parser";
import options from "@/available-ui";

import CodeEditor from "@uiw/react-textarea-code-editor";
import { useTheme } from "@/components/theme-provider";
import { cn } from "@/lib/utils";

// const widgetSchema = z.custom<WidgetData>();
const widgetSchema = z.object({
  name: z.string().trim().optional(),
  body: z
    .string()
    .trim()
    .min(2, { message: "Body must have at least 2 characters." }),
  resizable: z.boolean(),
  width: z.coerce.number(),
  height: z.coerce.number(),
});

type WidgetCreateProps = React.ComponentProps<typeof Card> & {
  setShowCreateWidget: React.Dispatch<React.SetStateAction<boolean>>;
};

function WidgetCreate({ setShowCreateWidget, className }: WidgetCreateProps) {
  const { theme } = useTheme();
  const { addWidget } = useContext(WidgetProviderContext);
  const [showDimensions, setShowDimensions] = useState(false);

  const form = useForm<z.infer<typeof widgetSchema>>({
    resolver: zodResolver(widgetSchema),
    defaultValues: {
      name: "",
      body: "",
      resizable: true,
      width: 240,
      height: 128,
    },
  });

  function onSubmit(values: z.infer<typeof widgetSchema>) {
    const html = parse(values.body, options);
    addWidget({
      name: values.name,
      body: html,
      resizable: values.resizable,
      width: values.width,
      height: values.height,
    });

    setShowCreateWidget(false);
    console.log("New widget created 🎉");
  }

  return (
    <div className={className}>
      <Form {...form}>
        <div
          className="absolute z-[9998] w-screen h-screen top-0 backdrop-blur-sm backdrop-brightness-75"
          onClick={() => setShowCreateWidget(false)}
        ></div>
        <Card className="absolute z-[9999] left-0 right-0 top-0 bottom-0 m-auto min-w-fit h-fit w-1/3">
          <CardHeader>
            <CardTitle>Create a new Widget</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              {/* Name */}
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Name of your widget (Optional)"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {/* Body */}
              <FormField
                control={form.control}
                name="body"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Body</FormLabel>
                    <FormControl>
                      <CodeEditor
                        language="html"
                        placeholder="Please enter widget code."
                        padding={15}
                        className="bg-background border rounded-md text-sm"
                        data-color-mode={theme}
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      This is the content displayed on your widget.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {/* Resize */}
              <FormField
                control={form.control}
                name="resizable"
                render={({ field }) => (
                  <FormItem className="flex flex-row-reverse items-center justify-center gap-2">
                    <FormLabel htmlFor="resizable-switch">
                      Resizable widget
                    </FormLabel>
                    <FormControl>
                      <Switch
                        style={{ margin: 0 }}
                        id="resizable-switch"
                        checked={field.value}
                        onCheckedChange={(e) => {
                          field.onChange(e);
                          setShowDimensions(field.value);
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex justify-between items-center pt-0">
                <Button
                  variant="outline"
                  onClick={() => setShowCreateWidget(false)}
                  type="button"
                >
                  Cancel
                </Button>
                <Button type="submit">Submit</Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Dimensions Card */}
        <div
          className={`${
            showDimensions ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}
        >
          <div
            className="absolute z-[99998] left-0 right-0 top-0 bottom-0 m-auto w-screen h-screen backdrop-blur-sm backdrop-brightness-75"
            onClick={() => setShowDimensions(false)}
          ></div>
          <Card className="absolute z-[99999] left-0 right-0 top-0 bottom-0 m-auto min-w-fit h-fit w-80">
            <div className="grid">
              <CardHeader>
                <CardTitle>Dimensions</CardTitle>
                <CardDescription>
                  Set the dimensions for the widget.
                </CardDescription>
              </CardHeader>
              <CardContent className="grid gap-2">
                <FormField
                  control={form.control}
                  name="width"
                  render={({ field }) => (
                    <FormItem className="grid grid-cols-3 items-center gap-4">
                      <Label htmlFor="width">Width</Label>
                      <FormControl>
                        <Input
                          id="width"
                          defaultValue="240"
                          className="col-span-2 h-8"
                          inputMode="numeric"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="height"
                  render={({ field }) => (
                    <FormItem className="grid grid-cols-3 items-center gap-4">
                      <Label htmlFor="height">Height</Label>
                      <FormControl>
                        <Input
                          id="height"
                          defaultValue="128"
                          className="col-span-2 h-8"
                          inputMode="numeric"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </div>
          </Card>
        </div>
      </Form>
    </div>
  );
}

export default WidgetCreate;
