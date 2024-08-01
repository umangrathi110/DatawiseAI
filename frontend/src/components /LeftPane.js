"use client"
import React, { useState } from 'react';
import './LeftPane.css';

const LeftPane = ({query, setQuery, compute}) => {
    const search = async () =>{
      await compute(query);
    };
    return (
      <div className="leftPane">
          <div>
            <textarea 
            className='input-field' 
            value={query} 
            placeholder='Enter your Query...' 
            onChange={(e)=>setQuery(e.target.value)}
            rows={22}  
            />
          </div>
         
          <button className='btn' onClick={search} >Compute</button>
      </div>
    );
};

export default LeftPane;
