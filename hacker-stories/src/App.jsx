import { useState , useEffect, useRef, useReducer, useCallback } from 'react'
import axios from 'axios'
import './App.css'
import {List} from './List'
import {InputWithLabel} from './InputWithLabel'
import {SearchForm} from './SearchForm'

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
      <div className='container'>
        <h1 className='headline-primary'>Hacker Stories</h1>
        <SearchForm searchTerm={searchTerm} onSearch={onSearch} onSubmit={onSearchSubmit}></SearchForm>
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
export {storyReducer};