"use client";
import { useRef, useState } from "react";
import { CONTACT_EMAIL, CONTACT_REASONS, MESSAGE_MAX, mailtoHref } from "@/lib/contact";

/**
 * The /contact form. v1 opens the visitor's mail app with a prefilled
 * message (lib/contact.ts mailtoHref); v2 will post to a Resend server action
 * with the same fields, so the layout does not change between versions.
 *
 * <ContactForm initialReason="publishing" />
 */
export default function ContactForm({ initialReason = "general" }) {
  const [reason, setReason] = useState(initialReason);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState({});
  const [opened, setOpened] = useState(false);
  const emailRef = useRef(null);
  const messageRef = useRef(null);

  function handleSubmit(e) {
    e.preventDefault();
    const next = {};
    if (!email.trim()) next.email = "Email is required";
    else if (!/^\S+@\S+\.\S+$/.test(email.trim())) next.email = "Enter a valid email address";
    if (!message.trim()) next.message = "Message is required";
    setErrors(next);
    if (next.email) return emailRef.current?.focus();
    if (next.message) return messageRef.current?.focus();

    window.location.href = mailtoHref({ reason, name, email, message });
    setOpened(true);
  }

  return (
    <form className="contact-form" onSubmit={handleSubmit} noValidate>
      <fieldset className="contact-form__reasons">
        <legend className="contact-form__label">Reason</legend>
        <div className="contact-form__options">
          {CONTACT_REASONS.map((r) => (
            <label key={r.id} className="contact-form__option">
              <input
                type="radio"
                name="reason"
                value={r.id}
                checked={reason === r.id}
                onChange={() => setReason(r.id)}
              />
              <span>{r.label}</span>
            </label>
          ))}
        </div>
      </fieldset>

      <div className="contact-form__row">
        <div className="contact-form__field">
          <label htmlFor="contact-name" className="contact-form__label">
            Name <span className="contact-form__optional">(optional)</span>
          </label>
          <input
            id="contact-name"
            type="text"
            autoComplete="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            maxLength={100}
          />
        </div>

        <div className="contact-form__field">
          <label htmlFor="contact-email" className="contact-form__label">
            Email *
          </label>
          <input
            ref={emailRef}
            id="contact-email"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            aria-invalid={Boolean(errors.email)}
            aria-describedby={errors.email ? "contact-email-error" : undefined}
          />
          {errors.email && (
            <p id="contact-email-error" className="contact-form__error">
              {errors.email}
            </p>
          )}
        </div>
      </div>

      <div className="contact-form__field">
        <label htmlFor="contact-message" className="contact-form__label">
          Message *
        </label>
        <textarea
          ref={messageRef}
          id="contact-message"
          rows={7}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          maxLength={MESSAGE_MAX}
          aria-invalid={Boolean(errors.message)}
          aria-describedby={`contact-message-count${errors.message ? " contact-message-error" : ""}`}
        />
        <div className="contact-form__under">
          {errors.message ? (
            <p id="contact-message-error" className="contact-form__error">
              {errors.message}
            </p>
          ) : (
            <span />
          )}
          <span id="contact-message-count" className="contact-form__count">
            {message.length} / {MESSAGE_MAX}
          </span>
        </div>
      </div>

      <div className="contact-form__actions">
        <button type="submit" className="btn btn--primary">
          Open in your email app
        </button>
        <p className="contact-form__hint">Your message opens in your email app, ready to send.</p>
      </div>

      <div role="status" className="contact-form__status">
        {opened && (
          <p>
            Nothing opened? Copy the message and send it to{" "}
            <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>.
          </p>
        )}
      </div>
    </form>
  );
}
