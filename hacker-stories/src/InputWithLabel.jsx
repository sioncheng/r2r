import { useState , useEffect, useRef, useReducer, useCallback } from 'react'

function InputWithLabel ({id, label, value, onInputChange, isFocused, children}) {
    const inputRef = useRef();
    useEffect(() => {
      if (isFocused && inputRef.current) {
        inputRef.current.focus();
      }
    }, [isFocused]);
  
    return (
      <>
        <label htmlFor={id} className='label'>{children}</label>
        &nbsp;
        <input type='text' id={id} value={value} onChange={onInputChange} ref={inputRef} className='input'/>
      </>
    );
}

export {InputWithLabel};