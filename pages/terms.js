import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";

export default function Terms() {
  const [accepted, setAccepted] = useState(false);
  const router = useRouter();

  const handleAcceptAndReturn = () => {
    if (accepted) {
      router.push("/signup");
    }
  };

  return (
    <div className="min-h-screen bg-[#E7EFC7] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/signup"
            className="inline-flex items-center text-[#3B3B1A] hover:text-[#8A784E] transition-colors mb-6"
          >
            <svg
              className="w-5 h-5 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            Back to Sign Up
          </Link>
          <h1 className="text-4xl font-bold text-[#3B3B1A] mb-2">
            Terms and Conditions
          </h1>
          <p className="text-[#3B3B1A]/70">
            Last updated: {new Date().toLocaleDateString()}
          </p>
        </div>

        {/* Content */}
        <div className="bg-white rounded-2xl shadow-lg p-8 border border-[#3B3B1A]/20 select-text">
          <div className="prose prose-lg max-w-none select-text">
            <p className="text-[#3B3B1A] mb-6 select-text cursor-text">
              Welcome to <strong>Fin-Valora</strong> ("we," "us," or "our").
              These Terms and Conditions ("Terms") govern your access to and use
              of our financial web application, website, and related services
              (collectively, the "Service"). By creating an account or using our
              Service, you agree to these Terms. If you don't agree, please
              don't use the Service.
            </p>

            <section className="mb-8 select-text">
              <h2 className="text-2xl font-bold text-[#3B3B1A] mb-4 select-text cursor-text">
                1. Use of the Service
              </h2>
              <p className="text-[#3B3B1A] mb-4 select-text cursor-text">
                You must be at least 18 years old to use our Service. You agree
                to use the Service only for lawful purposes and in compliance
                with all applicable laws and regulations. You're responsible for
                maintaining the confidentiality of your account credentials and
                for all activities that occur under your account.
              </p>
            </section>

            <section className="mb-8 select-text">
              <h2 className="text-2xl font-bold text-[#3B3B1A] mb-4 select-text cursor-text">
                2. Account Registration
              </h2>
              <p className="text-[#3B3B1A] mb-4 select-text cursor-text">
                When creating an account, you must provide accurate, complete,
                and up-to-date information. You may not impersonate anyone or
                use another person's account. If we suspect unauthorized use or
                breach of these Terms, we reserve the right to suspend or
                terminate your account without notice.
              </p>
            </section>

            <section className="mb-8 select-text">
              <h2 className="text-2xl font-bold text-[#3B3B1A] mb-4 select-text cursor-text">
                3. Prohibited Activities
              </h2>
              <p className="text-[#3B3B1A] mb-4 select-text cursor-text">You agree not to:</p>
              <ul className="list-disc list-inside text-[#3B3B1A] space-y-2 ml-4 select-text cursor-text">
                <li>Use the Service for any illegal or fraudulent activity.</li>
                <li>
                  Attempt to hack, reverse-engineer, or disrupt the Service.
                </li>
                <li>Upload viruses or malicious code.</li>
                <li>Share false or misleading information.</li>
              </ul>
            </section>

            <section className="mb-8 select-text">
              <h2 className="text-2xl font-bold text-[#3B3B1A] mb-4 select-text cursor-text">
                4. Disclaimer of Warranties
              </h2>
              <ul className="list-disc list-inside text-[#3B3B1A] space-y-2 ml-4 select-text cursor-text">
                <li>
                  The Service is provided "as is" and "as available."
                </li>
                <li>
                  We make no guarantees regarding accuracy, reliability, or
                  availability.
                </li>
                <li>You use the Service at your own risk.</li>
              </ul>
            </section>

            <section className="mb-8 select-text">
              <h2 className="text-2xl font-bold text-[#3B3B1A] mb-4 select-text cursor-text">
                5. Limitation of Liability
              </h2>
              <p className="text-[#3B3B1A] mb-4 select-text cursor-text">
                To the fullest extent permitted by law, Fin-Valora shall not be
                liable for any indirect, incidental, special, consequential, or
                punitive damages, or any loss of profits or revenues, whether
                incurred directly or indirectly, or any loss of data, use,
                goodwill, or other intangible losses.
              </p>
            </section>

            <section className="mb-8 select-text">
              <h2 className="text-2xl font-bold text-[#3B3B1A] mb-4 select-text cursor-text">
                6. Changes to Terms
              </h2>
              <p className="text-[#3B3B1A] mb-4 select-text cursor-text">
                We reserve the right to modify these Terms at any time. We will
                notify you of any changes by posting the new Terms on this page
                and updating the "Last updated" date. Your continued use of the
                Service after such changes constitutes your acceptance of the
                new Terms.
              </p>
            </section>

            <section className="mb-8 select-text">
              <h2 className="text-2xl font-bold text-[#3B3B1A] mb-4 select-text cursor-text">
                7. Contact Us
              </h2>
              <p className="text-[#3B3B1A] mb-4 select-text cursor-text">
                If you have any questions about these Terms, please contact us
                at:
              </p>
              <p className="text-[#3B3B1A] select-text cursor-text">
                <strong>Email:</strong> support@fin-valora.com
              </p>
            </section>
          </div>
        </div>

        {/* Footer with Checkbox */}
        <div className="mt-8">
          <div className="bg-white rounded-xl shadow-lg p-6 border border-[#3B3B1A]/20">
            <div className="flex items-start space-x-3 mb-4">
              <div className="flex items-center h-6">
                <input
                  id="accept-terms"
                  name="accept-terms"
                  type="checkbox"
                  checked={accepted}
                  onChange={(e) => setAccepted(e.target.checked)}
                  className="w-5 h-5 border-2 border-[#3B3B1A]/25 rounded bg-[#E7EFC7] text-[#8A784E] focus:ring-2 focus:ring-[#8A784E] focus:ring-offset-0 cursor-pointer transition-all"
                />
              </div>
              <div className="flex-1">
                <label
                  htmlFor="accept-terms"
                  className="text-base text-[#3B3B1A] font-medium cursor-pointer select-none"
                >
                  I have read and agree to the Terms and Conditions
                </label>
                <p className="text-sm text-[#3B3B1A]/70 mt-1">
                  By checking this box, you acknowledge that you have read,
                  understood, and agree to be bound by these Terms and
                  Conditions.
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={handleAcceptAndReturn}
                disabled={!accepted}
                className={`inline-flex items-center justify-center px-6 py-3 font-semibold rounded-xl focus:outline-none focus:ring-2 focus:ring-[#8A784E] transition-all duration-200 shadow-lg ${
                  accepted
                    ? "bg-[#796944] text-white hover:bg-[#6E603E] cursor-pointer"
                    : "bg-[#3B3B1A]/20 text-[#3B3B1A]/40 cursor-not-allowed"
                }`}
              >
                <svg
                  className="w-5 h-5 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                Accept and Continue to Sign Up
              </button>

              <Link
                href="/signup"
                className="inline-flex items-center justify-center px-6 py-3 border-2 border-[#3B3B1A] text-[#3B3B1A] font-semibold rounded-xl hover:bg-[#3B3B1A]/5 focus:outline-none focus:ring-2 focus:ring-[#8A784E] transition-all duration-200"
              >
                Back Without Accepting
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
