"use client";
import { useState } from "react";
import { services, site, type Locale } from "../content/site";
export function ContactForm({ locale: l }: { locale: Locale }) {
  const [state, setState] = useState("");
  const [busy, setBusy] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const labels = {
    name: l === "mn" ? "Нэр" : "Name",
    organization: l === "mn" ? "Байгууллага" : "Organization",
    email: l === "mn" ? "И-мэйл" : "Email",
    phone: l === "mn" ? "Утас (заавал биш)" : "Phone (optional)",
    type: l === "mn" ? "Төслийн төрөл" : "Project type",
    message: l === "mn" ? "Төслийн тухай" : "Message",
  };
  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form));
    const next: Record<string, string> = {};
    for (const key of ["name", "organization", "email", "type", "message"])
      if (!String(data[key] || "").trim())
        next[key] =
          l === "mn"
            ? "Энэ талбарыг бөглөнө үү."
            : "Please complete this field.";
    if (data.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(data.email)))
      next.email =
        l === "mn"
          ? "Зөв и-мэйл хаяг оруулна уу."
          : "Enter a valid email address.";
    setErrors(next);
    if (Object.keys(next).length) {
      setState(
        l === "mn"
          ? "Тэмдэглэсэн талбаруудыг шалгана уу."
          : "Please check the marked fields.",
      );
      form
        .querySelector<HTMLElement>(`[name="${Object.keys(next)[0]}"]`)
        ?.focus();
      return;
    }
    if (!site.contactEndpoint) {
      const body = Object.entries(data)
        .map(([k, v]) => `${labels[k as keyof typeof labels]}: ${v}`)
        .join("\n\n");
      window.location.href = `mailto:${site.email}?subject=${encodeURIComponent(`${data.organization} / ${data.type}`)}&body=${encodeURIComponent(body)}`;
      setState(
        l === "mn"
          ? "И-мэйл програмд ноорог нээгдэнэ. Илгээх үйлдлийг тэндээс гүйцэтгэнэ үү."
          : "A draft opens in your email application. Send it from there.",
      );
      return;
    }
    setBusy(true);
    setState(l === "mn" ? "Илгээж байна…" : "Sending…");
    try {
      const res = await fetch(site.contactEndpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, locale: l }),
      });
      if (!res.ok) throw new Error("Request failed");
      setState(
        l === "mn" ? "Хүсэлт хүлээн авлаа." : "Your enquiry was received.",
      );
      form.reset();
    } catch {
      setState(
        l === "mn"
          ? "Илгээж чадсангүй. И-мэйлээр холбогдоно уу."
          : "Unable to send. Please contact us by email.",
      );
    } finally {
      setBusy(false);
    }
  }
  return (
    <form className="contact-form" noValidate onSubmit={submit}>
      <div className="form-grid">
        {(["name", "organization", "email", "phone"] as const).map((key) => (
          <label key={key} htmlFor={key}>
            {labels[key]}
            <input
              aria-label={labels[key]}
              id={key}
              name={key}
              type={
                key === "email" ? "email" : key === "phone" ? "tel" : "text"
              }
              autoComplete={
                key === "name"
                  ? "name"
                  : key === "organization"
                    ? "organization"
                    : key === "phone"
                      ? "tel"
                      : "email"
              }
              required={key !== "phone"}
              maxLength={200}
              aria-invalid={!!errors[key]}
              aria-describedby={errors[key] ? `${key}-error` : undefined}
            />
            {errors[key] && (
              <span id={`${key}-error`} className="field-error">
                {errors[key]}
              </span>
            )}
          </label>
        ))}
      </div>
      <label htmlFor="type">
        {labels.type}
        <select
          aria-label={labels.type}
          id="type"
          name="type"
          required
          aria-invalid={!!errors.type}
          aria-describedby={errors.type ? "type-error" : undefined}
        >
          <option value="">
            {l === "mn" ? "Сонгох" : "Select a project type"}
          </option>
          {services.map((s) => (
            <option key={s.title.en}>{s.title[l]}</option>
          ))}
        </select>
        {errors.type && (
          <span id="type-error" className="field-error">
            {errors.type}
          </span>
        )}
      </label>
      <label htmlFor="message">
        {labels.message}
        <textarea
          aria-label={labels.message}
          id="message"
          name="message"
          required
          rows={5}
          maxLength={5000}
          aria-invalid={!!errors.message}
          aria-describedby={errors.message ? "message-error" : undefined}
        />
        {errors.message && (
          <span id="message-error" className="field-error">
            {errors.message}
          </span>
        )}
      </label>
      <p className="small">
        {l === "mn"
          ? "Энэ хувилбар таны и-мэйл програмд ноорог нээнэ. Вэбсайт дээр мэдээлэл хадгалахгүй."
          : "This version opens a draft in your email application. It does not store your enquiry on this website."}
      </p>
      <button className="button" disabled={busy}>
        {site.contactEndpoint
          ? l === "mn"
            ? "Хүсэлт илгээх"
            : "Send enquiry"
          : l === "mn"
            ? "И-мэйл ноорог бэлтгэх"
            : "Prepare email draft"}
      </button>
      <p role="status" className="form-status">
        {state}
      </p>
      <a className="text-link" href={`mailto:${site.email}`}>
        {site.email}
      </a>
    </form>
  );
}
