'use client'
import React, { useEffect, useState } from 'react';
import './RightPane.css';

const RightPane = ({ history, loading }) => {
  const [displayTexts, setDisplayTexts] = useState([]);

  useEffect(() => {
    if (history.length > 0 && !loading) {
      const latestResponse = history[history.length - 1].result;
      let index = 0;
      const interval = setInterval(() => {
        setDisplayTexts(prevTexts => {
          const newTexts = [...prevTexts];
          newTexts[history.length - 1] = (newTexts[history.length - 1] || "") + latestResponse[index];
          return newTexts;
        });
        index++;
        if (index + 1 === latestResponse.length) clearInterval(interval);
      }, 10);
      return () => clearInterval(interval);
    }
  }, [history, loading]);

  return (
    <div className="rightPane">
      <h2 className='heading'>Quantum Insights</h2>
      <div className="result">
        {loading ? (
          <div className="loader">
            <div className="spinner"></div>
          </div>
        ) : history.length === 0 ? (
          <div>AI response will materialize here...</div>
        ) : (
          history.map((item, index) => (
            <div key={index} className='query-response'>
              <div className='query'>{item.query}</div>
              <div className='answer'>{displayTexts[index]}</div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default RightPane;
