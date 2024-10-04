import { useState , useEffect, useRef, useReducer, useCallback } from 'react'

function Item(props) {
    const e = props.item;
    const onRemoveItem = props.onRemoveItem;
  
    return (
      <li className='item'>
        <span style={{width: '40%'}}>
          <a href={e.url}>{e.title}</a>
        </span>
        <span style={{width: '20%'}}>{e.author}</span>
        <span style={{width: '10%'}}>{e.num_comments}</span>
        <span style={{width: '10%'}}>{e.points}</span>
        <span style={{width: '10%'}}>
          <button type='button' onClick={() => onRemoveItem(e)} className='button button_small'>
            dismiss
          </button>
        </span>
      </li>
    );
  }
  
  function List(props) {
    return (
      <ul>
        {/* comments */}
        {
          props.stories.map(e => (<Item key={e.objectID} item={e} onRemoveItem={props.onRemoveItem}/>))
        }
      </ul>
    );
  }

  export {List, Item};