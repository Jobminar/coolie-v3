import React, { useState, useEffect } from "react";
import axios from "axios";
import "./FAQ.css";

const FAQ = ({ serviceId }) => {
  const [faqs, setFaqs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [openIndex, setOpenIndex] = useState(null);

  useEffect(() => {
    const fetchFAQs = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          "https://api.coolieno1.in/v1.0/users/faq",
        );
        const filteredFaqs = response.data.filter(
          (faq) => faq.serviceId?._id === serviceId,
        );
        setFaqs(filteredFaqs);
      } catch (error) {
        console.error("Error fetching FAQs:", error);
        setError("Failed to load FAQs");
      } finally {
        setLoading(false);
      }
    };

    if (serviceId) {
      fetchFAQs();
    }
  }, [serviceId]);

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  if (loading) return <p>Loading FAQs...</p>;
  if (error) return <p>{error}</p>;
  if (faqs.length === 0) return <p>No FAQs available for this service.</p>;

  return (
    <div id="faq-container">
      <h2 id="faq-title">Frequently Asked Questions</h2>
      {faqs.map((faq, index) => (
        <div
          key={faq._id}
          className={`faq-item ${openIndex === index ? "expanded" : ""}`}
        >
          <div className="faq-header" onClick={() => toggleFAQ(index)}>
            <div className="toggle-column">
              <button className="faq-toggle-button">
                {openIndex === index ? "-" : "+"}
              </button>
            </div>
            <div className="content-column">
              <h4>{faq.question}</h4>
              {openIndex === index && (
                <div
                  className="faq-answer"
                  dangerouslySetInnerHTML={{ __html: faq.answer }}
                />
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default FAQ;
