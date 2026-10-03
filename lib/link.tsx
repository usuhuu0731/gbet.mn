import type { ComponentProps } from "react";
import { basePath } from "./paths";
export default function Link({ href, ...props }: ComponentProps<"a">) {
  let path =
    href?.startsWith("/") &&
    !href.startsWith("//") &&
    !href.startsWith(basePath + "/")
      ? basePath + href
      : href;
  if (path?.startsWith("/") && !path.startsWith("//")) {
    const [, pathname, suffix = ""] = path.match(/^([^?#]+)(.*)$/)!;
    if (!pathname.endsWith("/") && !/\.[^/]+$/.test(pathname))
      path = pathname + "/" + suffix;
  }
  return <a {...props} href={path} />;
}
