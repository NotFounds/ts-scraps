import { yellow, red, green, cyan, gray } from "https://deno.land/std@0.113.0/fmt/colors.ts";

if (Deno.args.length !== 1) {
  console.error("require a target file or directory path to watch");
  Deno.exit(1);
}
console.log(`Target: ${Deno.args[0]}`);

type Kind = Deno.FsEvent['kind'];
type Formatter = (str: string) => string;
const EventFormatterMap: Record<Kind, Formatter> = {
  "any": gray,
  "access": cyan,
  "create": yellow,
  "modify": green,
  "remove": red,
};

const formatEvent = (kind: Kind) => {
  return EventFormatterMap[kind](kind);
};

const watcher = Deno.watchFs(Deno.args[0]);
for await (const event of watcher) {
  console.log(`${new Date().toISOString()} [${formatEvent(event.kind)}] ${event.paths}`);
}
