import {describe, it, expect} from 'vitest'
import App from './App';
import { storyReducer } from './App';
import {List, Item} from './List'
import {InputWithLabel} from './InputWithLabel'
import {SearchForm} from './SearchForm'


describe('something truthy and falsy', () => {
  it('true to be true', () => expect(true).toBe(true));
  it('false to be false', () => expect(false).toBe(false));
});
import { formToJSON } from 'axios';

const s1 = {
  title: 'React',
  url: 'https://reactjs.org/',
  author: 'Jordan Walke',
  num_comments: 3,
  points: 4,
  objectID: 0,
};
const s2 = {
  title: 'Redux',
  url: 'https://redux.js.org/',
  author: 'Dan Abramov, Andrew Clark',
  num_comments: 2,
  points: 5,
  objectID: 1,
};
const stories = [s1, s2];
describe('storyReducer', () => {
  it('remove story from all stories', () => {
    const action = {type:'DEL', payload:{objectID:0}};
    const state = {
      isLoading: false,
      data: stories,
      isError: false,
    };

    const newState = storyReducer(state, action);
    const expectedState = {
      isLoading: false,
      data: [s2],
      isError: false,
    };

    expect(newState).toStrictEqual(expectedState);
  });
});