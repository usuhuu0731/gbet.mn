"use client";
import { useEffect } from "react";
import Link from "../lib/link";
import { basePath } from "../lib/paths";
export default function LocaleRedirect() {
 useEffect(() => {
  const saved = document.cookie.split(";").map(v=>v.trim()).find(v=>v.startsWith("gbet-locale="))?.split("=")[1];
  const locale = saved === "mn" || saved === "en" ? saved : navigator.language.toLowerCase().startsWith("en") ? "en" : "mn";
  window.location.replace(`${basePath}/${locale}/`);
 },[]);
 return <main id="main" className="section"><h1>ГБЭТ / GBET</h1><p><Link href="/mn/">Монгол</Link> · <Link href="/en/">English</Link></p></main>;
}
