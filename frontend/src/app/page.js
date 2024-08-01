"use client"
import React, { useState } from 'react';
import "./style.css";
import LeftPane from '@/components /LeftPane';
import RightPane from '@/components /RightPane';

const Home = () => {
  const [query, setQuery] = useState("");
  const [history, setHistory] = useState([]); 
  const [loading, setLoading] = useState(false);

  const handlecompute = async (query) => {
    setLoading(true); 
    try{
      const response = await fetch('http://localhost:5000/search', {
        method: 'POST',
        headers : {
          'Content-Type' : 'application/json'
        },
        body : JSON.stringify({query})
      });
      const data = await response.json();
      setHistory(prevHistory => [...prevHistory, {query, result:data.response}]); 
    }
    catch(error){
      console.error("Error in fetching the data from API : ", error);
      setHistory(prevHistory => [...prevHistory, { query, result: "An error occurred while fetching the data from API" }]);
    }
    finally{
      setLoading(false);
    }
  }
  return (
      <div className="panes">
        <LeftPane query={query} setQuery={setQuery} compute={handlecompute} />
        <RightPane history ={history} loading= {loading}/>
      </div>
  );
};

export default Home;
