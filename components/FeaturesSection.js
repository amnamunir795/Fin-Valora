import { useEffect, useRef } from "react";

export default function FeaturesSection() {
  const featureBoxesRef = useRef([]);
  const titlesRef = useRef([]);
  const percentageTextRef = useRef(null);

  useEffect(() => {
    // Simple animation on scroll
    const featureBoxes = featureBoxesRef.current;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.style.opacity = "1";
            entry.target.style.transform = "translateY(0)";
          }
        });
      },
      { threshold: 0.1 }
    );

    featureBoxes.forEach((box) => {
      if (box) {
        box.style.opacity = "0";
        box.style.transform = "translateY(20px)";
        box.style.transition = "opacity 0.6s ease, transform 0.6s ease";
        observer.observe(box);
      }
    });

    // Typing effect for titles
    const titles = titlesRef.current;
    titles.forEach((title) => {
      if (title) {
        const text = title.getAttribute("data-text");
        title.textContent = "";
        let i = 0;

        function typeWriter() {
          if (i < text.length) {
            title.textContent += text.charAt(i);
            i++;
            setTimeout(typeWriter, 50);
          }
        }

        // Start typing effect when element is in view
        const titleObserver = new IntersectionObserver(
          (entries) => {
            entries.forEach((entry) => {
              if (entry.isIntersecting && title.textContent === "") {
                typeWriter();
                titleObserver.unobserve(entry.target);
              }
            });
          },
          { threshold: 0.5 }
        );

        titleObserver.observe(title);
      }
    });

    // Count up animation for percentage
    const percentageText = percentageTextRef.current;
    if (percentageText) {
      const percentageObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              let count = 0;
              const target = 75;
              const duration = 2000;
              const increment = target / (duration / 16);

              function updateCount() {
                if (count < target) {
                  count += increment;
                  if (count > target) count = target;
                  percentageText.textContent = Math.floor(count) + "%";
                  requestAnimationFrame(updateCount);
                }
              }

              updateCount();
              percentageObserver.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.5 }
      );

      percentageObserver.observe(percentageText);
    }

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <div className="features-section">
      <h2 className="section-title">Features</h2>

      <div className="features-container">
        {/* Feature 1: Money Tracking */}
        <div
          className="feature-box"
          ref={(el) => (featureBoxesRef.current[0] = el)}
        >
          <div className="feature-image-container">
            <img
              src="https://z-cdn-media.chatglm.cn/files/9c7564b2-92b0-4b2a-be50-814724ec94d2_money%20tracking.jpg?auth_key=1792916806-d6b5807adf9e4b6fb0583e8efb367117-0-c422e17ba7b4912670cb500012292273"
              alt="Money Tracking"
              className="feature-image"
            />
            <div className="graph-animation"></div>
            <div className="money-tracking-animation">
              <div className="animated-bar"></div>
              <div className="animated-bar"></div>
              <div className="animated-bar"></div>
              <div className="animated-bar"></div>
              <div className="animated-line"></div>
              <div className="animated-dot"></div>
              <div className="animated-dot"></div>
              <div className="animated-dot"></div>
              <div className="animated-dot"></div>
            </div>
          </div>
          <h3
            className="feature-title"
            data-text="Money Tracking"
            ref={(el) => (titlesRef.current[0] = el)}
          >
            Money Tracking
          </h3>
          <p className="feature-description">
            Track all your financial transactions in one place. Visualize your
            spending patterns with interactive charts and graphs.
          </p>
        </div>

        {/* Feature 2: Income & Expense Management */}
        <div
          className="feature-box"
          ref={(el) => (featureBoxesRef.current[1] = el)}
        >
          <div className="feature-image-container">
            <img
              src="https://z-cdn-media.chatglm.cn/files/0f677587-cdf5-4605-84c2-09c95f7429e6_income%20and%20expanse%20management.jpg?auth_key=1792917142-3e589ddffa9c424a92f744af744dedfd-0-647a206faccc98b5d27ee27c2f12de2a"
              alt="Income & Expense Management"
              className="feature-image"
            />
            <div className="graph-animation"></div>
            <div className="income-expense-animation">
              <div className="coin">$</div>
              <div className="coin">$</div>
              <div className="coin">$</div>
              <div className="coin">$</div>
              <div className="coin">$</div>
              <div className="progress-bar">
                <div className="progress-fill"></div>
              </div>
              <div className="percentage-text" ref={percentageTextRef}>
                75%
              </div>
            </div>
          </div>
          <h3
            className="feature-title"
            data-text="Income & Expense Management"
            ref={(el) => (titlesRef.current[1] = el)}
          >
            Income & Expense Management
          </h3>
          <p className="feature-description">
            Efficiently manage your income sources and expenses. Set budgets and
            get alerts when you&apos;re close to exceeding them.
          </p>
        </div>

        {/* Feature 3: AI Chatbot */}
        <div
          className="feature-box"
          ref={(el) => (featureBoxesRef.current[2] = el)}
        >
          <div className="feature-image-container">
            <img
              src="https://z-cdn-media.chatglm.cn/files/689c8387-9733-45fd-ab42-3b7f115d9f32_ai%20chatbot.jpg?auth_key=1792917316-14fe471e6fc540ff85a76aa9bf8e7e6f-0-7321612d4115ba3781340bc96c5b7221"
              alt="AI Chatbot"
              className="feature-image"
            />
            <div className="graph-animation"></div>
            <div className="chat-animation">
              <div className="chat-bubble left">
                Hello! How can I help you today?
              </div>
              <div className="chat-bubble right">I need financial advice</div>
              <div className="chat-bubble left">
                I&apos;d be happy to help with that!
              </div>
              <div className="typing-indicator">
                <div className="typing-dot"></div>
                <div className="typing-dot"></div>
                <div className="typing-dot"></div>
              </div>
            </div>
          </div>
          <h3
            className="feature-title"
            data-text="AI Chatbot"
            ref={(el) => (titlesRef.current[2] = el)}
          >
            AI Chatbot
          </h3>
          <p className="feature-description">
            Get personalized financial advice and insights from our AI-powered
            assistant. Available 24/7 to answer your questions.
          </p>
        </div>

        {/* Feature 4: OCR Integration */}
        <div
          className="feature-box"
          ref={(el) => (featureBoxesRef.current[3] = el)}
        >
          <div className="feature-image-container">
            <img
              src="https://z-cdn-media.chatglm.cn/files/a2e1f99c-6b6e-4fda-a92f-faeb6cfeb729_OCR%20integration.jpg?auth_key=1792917432-947a0662f545400f9209342fd0aabc94-0-4fc005d676a35a38ad182a0e2540256c"
              alt="OCR Integration"
              className="feature-image"
            />
            <div className="graph-animation"></div>
            <div className="ocr-animation">
              <div className="scanner-line"></div>
              <div className="highlight-box"></div>
              <div className="highlight-box"></div>
              <div className="highlight-box"></div>
              <div className="extracted-text">Date: 15/03/2023</div>
              <div className="extracted-text">Amount: $1,323.00</div>
              <div className="extracted-text">Total: $7.90</div>
            </div>
          </div>
          <h3
            className="feature-title"
            data-text="OCR Integration"
            ref={(el) => (titlesRef.current[3] = el)}
          >
            OCR Integration
          </h3>
          <p className="feature-description">
            Scan and digitize your receipts, invoices, and financial documents.
            Automatically extract and categorize transaction data.
          </p>
        </div>
      </div>
    </div>
  );
}
