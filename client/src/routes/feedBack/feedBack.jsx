import "./feedBack.css"
import React, { useState } from "react";

const FeedBack = () => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:3000/api/feedback", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ rating, comment }),
      });

      if (response.ok) {
        console.log("Feedback submitted successfully!");
        setSuccess(true);
        // Reset form fields
        setRating(0);
        setComment("");
      } else {
        console.log("Error submitting feedback!");
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handleRating = (rating) => {
    setRating(rating);
  };

  return (
    <div className="feedBack-container">
      <h2 className="feedBack-title">Share Your Thoughts!</h2>
      <form onSubmit={handleSubmit} className="feedBack-form">
        <div className="rating-container">
          <label className="rating-label">Rating:</label>
          <div className="rating-buttons">
            {[1, 2, 3, 4, 5].map((rate) => (
              <button
                key={rate}
                type="button"
                onClick={() => handleRating(rate)}
                className={`rating-button ${rating >= rate ? "active" : ""}`}
              >
                &#9733;
              </button>
            ))}
          </div>
        </div>
        <div className="comment-container">
          <label className="comment-label">Comment:</label>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="comment-textarea"
          />
        </div>
        <input type="hidden" name="rating" value={rating} /> {/* Hidden input field */}
        <button type="submit" className="submit-button">Submit</button>
        {success && (
          <div className="success-notification">
            <i className="fas fa-check-circle"></i>
            Feedback submitted successfully!
          </div>
        )}
      </form>
    </div>
  );
};

export default FeedBack;