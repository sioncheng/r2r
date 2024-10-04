import { useState , useEffect, useRef, useReducer, useCallback } from 'react'
import axios from 'axios'
import './App.css'


function List(props) {

  function Item(props) {
    const e = props.item;
    const onRemoveItem = props.onRemoveItem;

    return (
      <li>
        <span>
          <a href={e.url}>{e.title}</a>
        </span>
        <span>{e.author}</span>
        <span>{e.num_comments}</span>
        <span>{e.points}</span>
        <span>
          <button type='button' onClick={() => onRemoveItem(e)}>dismiss</button>
        </span>
      </li>
    );
  }

  return (
    <ul>
      {/* comments */}
      {
        props.stories.map(e => (<Item key={e.objectID} item={e} onRemoveItem={props.onRemoveItem}/>))
      }
    </ul>
  );
}

function InputWithLabel ({id, label, value, onInputChange, isFocused, children}) {
  const inputRef = useRef();
  useEffect(() => {
    if (isFocused && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isFocused]);

  return (
    <>
      <label htmlFor={id}>{children}</label>
      &nbsp;
      <input type='text' id={id} value={value} onChange={onInputChange} ref={inputRef}/>
    </>
  );
}

function SearchForm({onSubmit, searchTerm, onSearch}) {
  return (
    <form onSubmit={onSubmit}>
        <InputWithLabel id='search' 
          value={searchTerm} 
          onInputChange={onSearch}
          isFocused={true}>
          Search:
        </InputWithLabel>
        &nbsp;&nbsp;
        <button type='submit' disabled={!searchTerm}>Submit</button>
    </form>
  );
}


function App() {
  

  const initStories = [
    {
      title: 'React',
      url: 'https://reactjs.rog',
      author: 'Jordan Walke',
      num_comments: 3,
      points: 4,
      objectID: 0
    },
    {
      title: 'Redux',
      url: 'https://redux.js.rog',
      author: 'Dan Abramov, Andrew Clark',
      num_comments: 2,
      points: 5,
      objectID: 1
    }
  ];

  const [STORY_ACTION_LDG, STORY_ACTION_SET, STORY_ACTION_DEL, STORY_ACTION_ERR] = ['LDG', 'SET', 'DEL', 'ERR'];

  const storyReducer = (state, action) => {
    switch (action.type) {
      case STORY_ACTION_LDG:
        return {...state, isLoading: true}
      case STORY_ACTION_SET:
        return {...state, isLoading: false, data: action.payload}
      case STORY_ACTION_DEL:
        const newData = state.data.filter((s) => s.objectID != action.payload.objectID);
        return {...state, data: newData}; 
        case STORY_ACTION_ERR:
          return {...state, isLoading: false, isError: true}
      default:
        throw new Error("unknow [" + action.type + "] for dispatch stories");
    }
  };


  const [searchTerm, setSearchTerm] = useStorageState('search', 'React');
  const [url, setUrl] = useState('')
  const [story, storyDispatcher] = useReducer(storyReducer, 
    {data:[], isLoading:false, isError: false});

  const fetchStory = useCallback(async () => {
    if (!url) {
      return;
    }
    storyDispatcher({type:STORY_ACTION_LDG, payload:true});
    console.log("searching " + url , new Date());
    try {
      const result = await axios.get(url);
      storyDispatcher({type:STORY_ACTION_SET, payload: result.data.hits});
    } catch (e) {
      console.log("fetchStory failed", e);
      storyDispatcher({type:STORY_ACTION_ERR});
    }
  }, [url]);

  useEffect(() => {
    fetchStory();
  }, [fetchStory]);

  function handleRemoveItem(item) {
    storyDispatcher({type:STORY_ACTION_DEL, payload: item});
  }


  function useStorageState(key, initState) {
    const lv = localStorage.getItem(key);
    const [value, setValue] = useState(null == lv ? initState : lv);

    useEffect(() => { 
      //console.log('setItem', key, value);
      localStorage.setItem(key, value);
      return () => {
        //console.log('cleanup', localStorage.getItem(key));
      }
     } , [value]);

    return [value, setValue];
  }

  function onSearch(e) {
    //console.log('onSearch', e.target.value);
    setSearchTerm(e.target.value);
  }

  function onSearchSubmit(e) {
    e.preventDefault();
    if (!searchTerm) {
      return;
    }
    setUrl('https://hn.algolia.com/api/v1/search?query=' + searchTerm);
  }

  const searchedStories = story.data.filter( e => e.title.includes(searchTerm));

  return (
    <>
      <div>
        <h1>Hacker Stories</h1>
        <SearchForm searchTerm={searchTerm} onSearch={onSearch} onSubmit={onSearchSubmit}></SearchForm>
        <hr/>
        {story.isError && (<p>Something went wrong...</p>)}
        {story.isLoading ?
          (<p>loading...</p>)
          :
          (
            <List stories={searchedStories} onRemoveItem={handleRemoveItem}/>
          )
        }
      </div>
    </>
  );
}

export default App;