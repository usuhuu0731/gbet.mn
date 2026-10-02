import type { ComponentProps } from "react";
import { basePath } from "./paths";
export default function Link({href,...props}: ComponentProps<"a">) {
 const path = href?.startsWith("/") && !href.startsWith("//") && !href.startsWith(basePath + "/") ? basePath + href : href;
 return <a {...props} href={path} />;
}
