import { useState , useEffect, useRef, useReducer, useCallback } from 'react'
import {InputWithLabel} from './InputWithLabel'

function SearchForm({onSubmit, searchTerm, onSearch}) {
    return (
      <form onSubmit={onSubmit} className='search-form'>
          <InputWithLabel id='search' 
            value={searchTerm} 
            onInputChange={onSearch}
            isFocused={true}>
            Search:
          </InputWithLabel>
          &nbsp;&nbsp;
          <button type='submit' disabled={!searchTerm} className='button button_large'>Submit</button>
      </form>
    );
}

export {SearchForm};