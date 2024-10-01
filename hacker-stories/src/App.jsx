import { useState , useEffect } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'


function List(props) {

  function Item(props) {
    const e = props.item;
    return (
      <li>
        <span>
          <a href={e.url}>{e.title}</a>
        </span>
        <span>{e.author}</span>
        <span>{e.num_comments}</span>
        <span>{e.points}</span>
      </li>
    );
  }

  return (
    <ul>
      {/* comments */}
      {
        props.stories.map(e => (<Item key={e.objectID} item={e}/>))
      }
    </ul>
  );
}

function Search ({searchTerm, onSearch}) {
  //const {searchTerm, onSearch} = props   
  return (
    <>
      <label htmlFor='search'>Search:</label>
      <input type='text' id='search' value={searchTerm} onChange={onSearch}/>
      <p>
        Searching for <strong>{searchTerm}</strong>
      </p>

    </> /* react fragment */
  );
}


function App() {
  

  const list = [
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

  const [searchTerm, setSearchTerm] = useStorageState('search', 'React');

  function onSearch(e) {
    //console.log('onSearch', e.target.value);
    setSearchTerm(e.target.value);
  }

  const searchedStories = list.filter( e => e.title.includes(searchTerm));

  return (
    <>
      <div>
        <h1>Hacker Stories</h1>
        <Search onSearch={onSearch} searchTerm={searchTerm}/>
        <hr/>
        <List stories={searchedStories}/>
      </div>
    </>
  );
}

export default App;