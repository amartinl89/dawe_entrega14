import React, {Component} from 'react';
import './App.css';
import Moment from 'react-moment';
import 'moment-timezone';
import 'moment/locale/es';
import Button from './Button';
import Search from './Search';
import Table from  './Table';

// Constantes que indican como hacer queries a hackernews
const DEFAULT_QUERY = 'react';
const PATH_BASE = 'https://hn.algolia.com/api/v1';
const PATH_SEARCH = '/search';
const PARAM_SEARCH = 'query=';
const PARAM_PAGE = 'page=';

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            result: null,
            searchTerm: DEFAULT_QUERY
        }
        this.onDismiss = this.onDismiss.bind(this); // binding de la funcion
        this.onSearchChange = this.onSearchChange.bind(this);
        this.setSearchTopStories = this.setSearchTopStories.bind(this);
        this.onSearchSubmit = this.onSearchSubmit.bind(this);
        this.fetchSearchTopStories = this.fetchSearchTopStories.bind(this);
    }

    setSearchTopStories(result) {
        this.setState({result});
    }

    onSearchSubmit(event){
        const {searchTerm} = this.state;
        this.fetchSearchTopStories(searchTerm);
        event.preventDefault();
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

    onSearchChange(event) {
        this.setState({searchTerm:event.target.value});
    }

    onDismiss(id) {
        function isNotId(item) {
            return item.objectID !== id;
        }
        const updatedList = this.state.result.hits.filter(isNotId); // filtramos la lista para quitar un elemento
        this.setState({result:{...this.state.result, hits: updatedList}}); // actualizamos el estado
    }


    render() {
      const {result, searchTerm} = this.state;
      const page = (result && result.page) || 0;
    return(
        <div className="page">
            <div className="interactions">
                <Search value={searchTerm} onSubmit={this.onSearchSubmit} onChange={this.onSearchChange}>Search</Search>
            </div>
            {result && <Table list={result.hits} onDismiss={this.onDismiss} />}
            <div className={"interactions"}>
                <Button onClick={() => this.fetchSearchTopStories(searchTerm, page + 1)}>More</Button>
            </div>
        </div>
    )
  }
}

// const Search = ({value,onSubmit,onChange,children}) =>
//     <form onSubmit={onSubmit}>
//         {children}
//         <input type="text" value={value} onChange={onChange}/>
//         <button type="submit">{children}</button>
//     </form>

// class Table extends Component {
//     render() {
//         const {list,onDismiss} = this.props;
//         return(
//             <div className="table">
//             {list.map(item => {
//                 return <div key={item.objectID} className="table-row">
//                     <span style={{width: '40%'}}><a href={item.url}>{item.title}</a></span>
//                     <span style={{width: '30%'}}>{item.author}</span>
//                     <span style={{width: '20%'}}>hace <Moment fromNow ago locale="es">{item.created_at}</Moment></span>
//                     <span style={{width: '10%'}}>
//                         <Button className="button-inline" onClick={() => onDismiss(item.objectID)}>Dismiss</Button>
//                     </span>
//                 </div>

//             })}
//             </div>
//         )
//     }
// }

// class Button extends Component {
//     render() {
//         const {onClick,className='',children} = this.props;
//         return <button className={className} onClick={onClick}>{children}</button>;
//     }
// }
export default App;