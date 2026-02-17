import { useState } from "react";
import { Component } from 'react';
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
import './App.css'

function App() {
  const[count , setCount] = useState(0)
  function decreseHandler(){
    if(count<=0) return
    setCount(count-1)
    
  }
  function increseHandler(){
    setCount(count+1)
  }
  function resetHandler(){
    setCount(0)
  }
  return (
    <div className="container">
      <div className="heading">Increment & Decrement</div>
      <div className="incdec" >
        <button className="dec" onClick={decreseHandler} >-</button>
        <div className="count">{count}</div>
        <button className="inc" onClick={increseHandler}>+</button>
      </div>
      <button className="reset" onClick={resetHandler}>Reset</button>
    </div>
  );
}

export default App;
