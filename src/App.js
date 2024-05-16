import React, {Component} from 'react';
import './App.css';
const DEFAULT_QUERY = 'react'
const PATH_BASE = 'https://hn.algolia.com/api/v1'
const PATH_SEARCH = '/search'
const PARAM_SEARCH = 'query='
const PARAM_PAGE = 'page=';


// function isSearched(searchTerm) {
//   return function(item) {
//     return item.title.toLowerCase().includes(searchTerm.toLowerCase()); // filtramos por titulo
//   }
// } 
const Search = ({value,onChange,children,onSubmit}) =>
<form onSubmit={onSubmit}>
   {children}
   <input type="text" value={value} onChange={onChange}/>
   <button type="button" onClick={onSubmit}>{children}</button>
</form>





      
class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      result: null,
      searchTerm: DEFAULT_QUERY
    }
    
    this.onDismiss = this.onDismiss.bind(this);
    this.onSearchChange = this.onSearchChange.bind(this);
    this.setSearchTopStories = this.setSearchTopStories.bind(this);
    this.onSearchSubmit = this.onSearchSubmit.bind(this);
    this.fetchSearchTopStories = this.fetchSearchTopStories.bind(this);

  }

  onDismiss(id) {
    function isNotId(item) {
      return item.objectID !== id;
    }
    const updatedList = this.state.result.hits.filter(isNotId);
    this.setState({ result: { ...this.state.result, hits: updatedList } });
  }

  onSearchChange(event) {
    console.log(event.target.value);
    this.setState({ searchTerm: event.target.value });
  }

  onSearchSubmit(event){
    const {searchTerm} = this.state;
    console.log(searchTerm);
    this.fetchSearchTopStories(searchTerm);
    console.log(searchTerm);
    event.preventDefault();
 }
 

  setSearchTopStories(result) {
    this.setState({ result });
  }
  fetchSearchTopStories(searchTerm, page=0) {
    fetch(`${PATH_BASE}${PATH_SEARCH}?${PARAM_SEARCH}${searchTerm}&${PARAM_PAGE}${page}`)
         .then(response => response.json())
         .then(result => this.setSearchTopStories(result))
         .catch(error => error);
  }
  
 
 componentDidMount() {
    const {searchTerm} = this.state;
    this.fetchSearchTopStories(searchTerm);
 }
 

  render() {
    const { result, searchTerm } = this.state; // Definir 'result' en el alcance del método render()
    const page = (result && result.page) || 0;
    return (
      <div className="page">
        <form>
          {/* Pasar 'searchTerm' como prop */}
          <div className='interactions'> 
          <Search value={searchTerm} onChange={this.onSearchChange} onSubmit={this.onSearchSubmit}>Search</Search>
          </div>
        </form>
        {/* Pasar 'result.hits' como prop */}
        {result && <Table result={result.hits}  onDismiss={this.onDismiss} />}
        <div className={"interactions"}>
          <Button onClick={() => this.fetchSearchTopStories(searchTerm, page + 1)}>More</Button>
        </div>

      </div>
    )
  }
}

class Table extends Component {
  render() {
      const {result,onDismiss} = this.props;
      console.log(result);
      return(
          <div>
          {result.map(item => {
              return <div key={item.objectID}>
                  <span style={{width: '40%'}}><a href={item.url}>{item.title}</a></span>
                  <span style={{width: '30%'}}>{item.author}</span>
                  <span style={{width: '10%'}}>{item.num_comments}</span>
                  <span style={{width: '10%'}}>{item.points}</span>
                  <span style={{width: '10%'}}>
                    <Button className="button-inline" onClick={() => onDismiss(item.objectID)}>Dismiss</Button>
                  </span>

              </div>

          })}
          </div>
      )
  }
}

class Button extends Component {
  render() {
    const {onClick,className='',children} = this.props
      return <button className={className} onClick={onClick}>{children}</button>;
  }
}


 


export default App;
