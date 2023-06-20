import React, {Component} from 'react'
import logo from './logo.svg';
import './App.css';
import axios from 'axios'
import PropTypes from 'prop-types';
import { sortBy} from 'lodash';

const DEFAULT_QUERY = 'redux';
const DEFAULT_HPP = '100';

const PATH_BASE = 'https://hn.algolia.com/api/v1';
const PATH_SEARCH = '/search';
const PARAM_SEARCH = 'query=';
const PARAM_PAGE = 'page='
const PARAM_HPP = 'hitsPerPage='

const url = `${PATH_BASE}${PATH_SEARCH}?${PARAM_SEARCH}${DEFAULT_QUERY}&${PARAM_PAGE}`;


const SORTS = {
  NONE: list=> list,
  TITLE: list => sortBy(list, 'title'),
  AUTHOR: list => sortBy(list, "author"),
  COMMENTS: list => sortBy(list, 'num_comments').reverse(),
  POINTS: list => sortBy(list, 'points').reverse()
}


const isSearched = searchTerm => item =>
  item.title.toLowerCase().includes(searchTerm.toLowerCase());
const withLoading = (Component) => (isLoading, ...rest) => {
    isLoading 
    ? <div> Loading</div>
    : <Component {...rest}/>
    
  }
  
const ButtonWithLoading = withLoading(Button)

class App extends Component {
  constructor(props){
    super(props)
    this.state = {
      results: null,
      searchKey: '',
      searchTerm: DEFAULT_QUERY,
      isLoading: false,
      error: null,
      sortKey: 'NONE'
    }
    // Binding methods to this instance
    this.needsToSearchTopStories = this.needsToSearchTopStories.bind(this);
    this.setSearchTopStories = this.setSearchTopStories.bind(this);
    this.onDismiss = this.onDismiss.bind(this)
    this.onSearchChange = this.onSearchChange.bind(this);
    this.onSearchSubmit = this.onSearchSubmit.bind(this);
    this.fetchSearchTopStories = this.fetchSearchTopStories.bind(this);
    this.onSort = this.onSort.bind(this);
  }
  onSort(sortKey) {
    this.setState({sortKey})
  }

  needsToSearchTopStories(searchTerm) {
    return !this.state.results[searchTerm];
    }
  fetchSearchTopStories(searchTerm, page=0) {
    const _url = `${PATH_BASE}${PATH_SEARCH}?${PARAM_SEARCH}${searchTerm}&${PARAM_PAGE}${page}&${PARAM_HPP}${DEFAULT_HPP}` 
    console.log(_url)
    axios(_url)
    .then(result => this.setSearchTopStories(result.data))
    .catch(error => this.setState({error}))
    ;
  }
  setSearchTopStories(result) {
    const { hits, page } = result;
    const { searchKey, results } = this.state;
    const oldHits = results && results[searchKey]
    ? results[searchKey].hits
    : [];
    const updatedHits = [
    ...oldHits,
    ...hits
    ];
    this.setState({
    results: {
        ...results,
        [searchKey]: { hits: updatedHits, page }
      },
    isLoading: false
    });
  }
  componentDidMount() {
    const { searchTerm } = this.state;
    this.setState({searchKey: searchTerm, isLoading: true})
    
    this.fetchSearchTopStories(searchTerm);
    }
  onSearchSubmit(event) {
    const { searchTerm } = this.state;
    this.setState({searchKey: searchTerm})

    if (this.needsToSearchTopStories(searchTerm)) {
      this.fetchSearchTopStories(searchTerm);
      }
      
    event.preventDefault()
  } 
      
      
  onDismiss(id) {
    const { searchKey, results } = this.state;
    const { hits, page } = results[searchKey];

    const isNotId = item => item.objectID !== id;
    const updatedList = hits.filter(isNotId);
    this.setState({results: {...results, [searchKey]: {hits: updatedList}}});
  }
  onSearchChange(event){
    this.setState({ searchTerm: event.target.value })
  }
    

  render() {
    const {searchTerm, results, searchKey, error, sortKey} = this.state;
    const page = (results && results[searchKey]&& results[searchKey].page) || 0
    const list = (
      results && 
      results[searchKey] &&
      results[searchKey].hits
    ) || [];
    
    if (this.state.isLoading){
      return (<p>Is loading</p>)
    }
    
    if (error) {return <p>Something went wrong</p>}
    if (!results) { return null; }
    return (
        <div className='page'>
          <div className='interactions'>
            <Search 
            value={searchTerm}
            onChange={this.onSearchChange}
            onSubmit={this.onSearchSubmit}
            >
              Search
            </Search>
            </div>    
             { error
              ? 
              <div className="interactions">
                <p>Something went wrong.</p>
              </div>
              : <Table
              list={list}
              sortKey={sortKey}
              onSort={this.onSort}
              onDismiss={this.onDismiss}
              />
              }

            <div className='interactions'>
              <ButtonWithLoading 
                isLoading={this.state.isLoading}
                onClick={() => this.fetchSearchTopStories(searchKey, page + 1)}
              >
                More
              </ButtonWithLoading>
            </div>
        </div>
      )
    }
  };



function Table(props){
  const {list, sortKey, onSort, onDismiss} = props;
  const largeColumn = {
    width: '40%',
    };
  const midColumn = {
    width: '30%',
    };
  const smallColumn = {
    width: '10%',
    };
  return (
    <div className='table'>
      <div className="table-header">
        <span style={{ width: '40%' }}>
          <Sort
            sortKey={'TITLE'}
            onSort={onSort}
          >
            Title
          </Sort>
      
        </span>
        <span style={{ width: '30%' }}>
          <Sort
            sortKey={'AUTHOR'}
            onSort={onSort}
          >
          Author
          </Sort>
        </span>
        <span style={{ width: '10%' }}>
          <Sort
            sortKey={'COMMENTS'}
            onSort={onSort}
          >
          Comments
          </Sort>
        </span>
        <span style={{ width: '10%' }}>
          <Sort
          sortKey={'POINTS'}
          onSort={onSort}
          >
              Points
          </Sort>
        </span>
        <span style={{ width: '10%' }}>
          Archive
        </span>
      </div>

      
      {SORTS[sortKey](list).map(item =>  
        <div key={item.objectID} className='table-row'>
        <span style={largeColumn}>
          <a href={item.url}>{item.title}</a>
        </span>
        <span style={midColumn}>
          {item.author}
        </span>
        <span style={smallColumn}>
          {item.num_comments}
        </span>
        <span style={smallColumn}>
          {item.points}
        </span>
        <span style={smallColumn}>
          <Button className='button-inline' onClick={() => onDismiss(item.objectID)}>
            Dismiss
          </Button>
          </span>
      </div>
      )}
    </div>
  )
}

const Sort = ({ sortKey, onSort, children }) =>
  <Button 
    onClick={() => onSort(sortKey)}
    className="button-inline"
  >
    {children}
  </Button>

const Search = ({ value, onChange, onSubmit, children }) =>
<form onSubmit={onSubmit}>
  <input
    type="text"
    value={value}
    onChange={onChange}
  />
  <button type='submit'>
    {children}
  </button>
</form>



function Button(props) {
  const {onClick, className='', children} = props
  return(
    <button onClick={onClick} className={className}>
      {children}
    </button>
  )}


  
Button.propTypes = {
  onClick: PropTypes.func.isRequired,
  className: PropTypes.string,
  children: PropTypes.node.isRequired,
}
Button.defaultProps = {
  className: '',
  };
  

Search.propTypes={
    value: PropTypes.string,
    onChange: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired,
    children: PropTypes.node
  }
Table.propTypes = {
  list: PropTypes.arrayOf(
    PropTypes.shape({
    objectID: PropTypes.string.isRequired,
    author: PropTypes.string,
    url: PropTypes.string,
    num_comments: PropTypes.number,
    points: PropTypes.number,
  })
  ).isRequired,
  onDismiss: PropTypes.func.isRequired,
  };

export default App;
export {
Button,
Search,
Table,
};