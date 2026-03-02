import { EmailSignupForm } from "./email-signup-form";

export function EmailSignupBanner() {
  return (
    <section className="bg-gradient-to-r from-brand-50 to-brand-100 py-12 sm:py-16">
      <div className="mx-auto max-w-2xl px-4 text-center">
        <h2 className="text-2xl sm:text-3xl font-bold text-stone-900 mb-3">
          Get the best KW deals in your inbox
        </h2>
        <p className="text-stone-600 mb-6">
          Join locals who never miss a deal. One email per week, no spam.
        </p>
        <div className="max-w-md mx-auto">
          <EmailSignupForm />
        </div>
      </div>
    </section>
  );
}
