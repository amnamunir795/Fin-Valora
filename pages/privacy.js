import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";

export default function Privacy() {
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
            Privacy Policy
          </h1>
          <p className="text-[#3B3B1A]/70">
            Last updated: {new Date().toLocaleDateString()}
          </p>
        </div>

        {/* Content */}
        <div className="bg-white rounded-2xl shadow-lg p-8 border border-[#3B3B1A]/20">
          <div className="prose prose-lg max-w-none">
            <p className="text-[#3B3B1A] mb-6">
              At <strong>Fin-Valora</strong>, we are committed to protecting
              your privacy. This Privacy Policy explains how we collect, use,
              disclose, and safeguard your information when you use our
              financial web application and services.
            </p>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-[#3B3B1A] mb-4">
                1. Information We Collect
              </h2>
              <p className="text-[#3B3B1A] mb-4">
                We collect information that you provide directly to us,
                including:
              </p>
              <ul className="list-disc list-inside text-[#3B3B1A] space-y-2 ml-4">
                <li>
                  Personal information (name, email address, phone number)
                </li>
                <li>Account credentials (username and password)</li>
                <li>
                  Financial information (budget data, transaction records)
                </li>
                <li>
                  Profile information (currency preference, profile picture)
                </li>
                <li>
                  Usage data (how you interact with our Service, IP address,
                  browser type)
                </li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-[#3B3B1A] mb-4">
                2. How We Use Your Information
              </h2>
              <p className="text-[#3B3B1A] mb-4">
                We use the information we collect to:
              </p>
              <ul className="list-disc list-inside text-[#3B3B1A] space-y-2 ml-4">
                <li>Provide, maintain, and improve our Service</li>
                <li>Process your transactions and manage your account</li>
                <li>Send you technical notices and support messages</li>
                <li>
                  Respond to your comments, questions, and customer service
                  requests
                </li>
                <li>
                  Monitor and analyze trends, usage, and activities in
                  connection with our Service
                </li>
                <li>Detect, prevent, and address technical issues and fraud</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-[#3B3B1A] mb-4">
                3. Information Sharing and Disclosure
              </h2>
              <p className="text-[#3B3B1A] mb-4">
                We do not sell, trade, or rent your personal information to
                third parties. We may share your information only in the
                following circumstances:
              </p>
              <ul className="list-disc list-inside text-[#3B3B1A] space-y-2 ml-4">
                <li>With your consent</li>
                <li>
                  To comply with legal obligations or respond to lawful requests
                </li>
                <li>
                  To protect the rights, property, or safety of Fin-Valora, our
                  users, or others
                </li>
                <li>
                  In connection with a merger, acquisition, or sale of assets
                </li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-[#3B3B1A] mb-4">
                4. Data Security
              </h2>
              <p className="text-[#3B3B1A] mb-4">
                We implement appropriate technical and organizational measures
                to protect your personal information against unauthorized
                access, alteration, disclosure, or destruction. However, no
                method of transmission over the Internet or electronic storage
                is 100% secure, and we cannot guarantee absolute security.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-[#3B3B1A] mb-4">
                5. Your Rights
              </h2>
              <p className="text-[#3B3B1A] mb-4">You have the right to:</p>
              <ul className="list-disc list-inside text-[#3B3B1A] space-y-2 ml-4">
                <li>Access and receive a copy of your personal information</li>
                <li>Correct or update your personal information</li>
                <li>Delete your account and personal information</li>
                <li>Object to or restrict certain processing of your data</li>
                <li>Withdraw consent where we rely on it</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-[#3B3B1A] mb-4">
                6. Cookies and Tracking Technologies
              </h2>
              <p className="text-[#3B3B1A] mb-4">
                We use cookies and similar tracking technologies to track
                activity on our Service and hold certain information. You can
                instruct your browser to refuse all cookies or to indicate when
                a cookie is being sent.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-[#3B3B1A] mb-4">
                7. Changes to This Privacy Policy
              </h2>
              <p className="text-[#3B3B1A] mb-4">
                We may update our Privacy Policy from time to time. We will
                notify you of any changes by posting the new Privacy Policy on
                this page and updating the "Last updated" date.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-[#3B3B1A] mb-4">
                8. Contact Us
              </h2>
              <p className="text-[#3B3B1A] mb-4">
                If you have any questions about this Privacy Policy, please
                contact us at:
              </p>
              <p className="text-[#3B3B1A]">
                <strong>Email:</strong> privacy@fin-valora.com
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
                  id="accept-privacy"
                  name="accept-privacy"
                  type="checkbox"
                  checked={accepted}
                  onChange={(e) => setAccepted(e.target.checked)}
                  className="w-5 h-5 border-2 border-[#3B3B1A]/25 rounded bg-[#E7EFC7] text-[#8A784E] focus:ring-2 focus:ring-[#8A784E] focus:ring-offset-0 cursor-pointer transition-all"
                />
              </div>
              <div className="flex-1">
                <label
                  htmlFor="accept-privacy"
                  className="text-base text-[#3B3B1A] font-medium cursor-pointer select-none"
                >
                  I have read and agree to the Privacy Policy
                </label>
                <p className="text-sm text-[#3B3B1A]/70 mt-1">
                  By checking this box, you acknowledge that you have read,
                  understood, and agree to how we collect, use, and protect your
                  personal information.
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
