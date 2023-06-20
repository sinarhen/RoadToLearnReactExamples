
import React from 'react';
import ReactDOM from 'react-dom';
import App, {Search, Button, Table} from './App';
import renderer from 'react-test-renderer';
import Enzyme, {shallow} from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

Enzyme.configure({adapter: new Adapter()})


describe('App', () => {
  it('renders without crashing', () => {
    const div = document.createElement('div');
    ReactDOM.render(<App />, div);
    ReactDOM.unmountComponentAtNode(div);
    });

  test('has a valid snapshot', () => {
    const component = renderer.create(
      <App/>
    );
    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
    })
  })

describe('Search', () => {
  it('renders without crashing', () => {
    const div = document.createElement('div');
    ReactDOM.render(<Search>Search</Search>, div);
    ReactDOM.unmountComponentAtNode(div);
  });
  test('has a valid snapshot', () => {
    const component = renderer.create(
      <Search>Search</Search>
    );
    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
  });
describe('Table', () => {
    const props = {
      list: [
        { title: '1', author: '1', num_comments: 1, points: 2, objectID: 'y' },
        { title: '2', author: '2', num_comments: 1, points: 2, objectID: 'z' },
      ],
    };

    it('renders without crashing', () => {
      const div = document.createElement('div');
      ReactDOM.render(<Table { ...props } />, div);
    });
    test('has a valid snapshot', () => {
      const component = renderer.create(
      <Table { ...props } />
    );
    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
    });
    
    it('shows two items in list', () => {
      const element = shallow(
      <Table { ...props } />
      );
      expect(element.find('.table-row').length).toBe(2);
    });
      
    });
describe('Button', () => {
  const props = [
    {onClick: (event)=>{event.submit()}, className:'button-inline', children: "submit"},
    {onClick: (event)=>{event.preventDefault()}, className:'button-inline', children: "Not submit"}
  ]
  it('renders without crashing', () => {
    const button = document.createElement('button');
    ReactDOM.render(<Button {...props}/>)
  })

  test('has a valid snapshot', ()=>{
    const component = renderer.create(
      <Button {...props}/>
    )
    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  })

  it('shows two buttons on page', ()=>{
    const element = shallow(
      <Button {...props}/>);
      expect(element.find('.button-inline').length).toBe(3);    
  })
  


})    
