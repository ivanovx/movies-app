import React from "react";
import axios from "axios";
import config from "../../config";

import { useElastic } from "../Elastic";

export default function Search() {
    const [count, setCount] = React.useState(0);
    const [fields, setFiels] = React.useState([]);
    const [searchValue, setSearchValue] = React.useState(null);
    const [searchResults, setSearchResults] = React.useState([]);

    const { token } = useElastic();

    React.useEffect(() => {
        axios.get(`${config.ELASTIC_HOST}/movies/_count`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        }).then(res => {
           setCount(res.data.count)
        }).catch(err => {
            console.log(err);
        });
    }, [token]);

    const onChangeField = (e) => {
        const { target: { name, checked } } = e;
    
        if (checked) {
            setFiels(oldFields => [
                ...oldFields,
                name
            ]);
        } else {
            setFiels(oldFields=> oldFields.filter(n => n !== name));
        }
    };

    const onChangeTextInput = (e) => {
        const { value } = e.target;

        setSearchValue(value);
    };

    const onClickSearch = (e) => {
        const query = {
            "query": {
                "multi_match": {
                    "query": searchValue,
                    "type":       "cross_fields",
                    'fields': fields,
                    'operator': 'and'
                }
            },
            "size": 100
        }
        
        axios.post(`${config.ELASTIC_HOST}/movies/_search`, query, {
            headers: {
                "Authorization": `Bearer ${token}`
            }
        }).then(res => {
           console.log(res);
           setSearchResults(res.data.hits.hits);
        }).catch(err => {
            console.log(err);
        });
    };

    React.useEffect(() => {
        console.log(fields);
    }, [fields]);

    React.useEffect(() => {
        console.log(searchValue);
    }, [searchValue]);

    return (
        <div>
            <div className="searchInput">
                <h1>Movies <span className="badge bg-secondary">{count}</span></h1>

                <div className="mb-3">
                    <label htmlFor="searchMovieBox" className="form-label">Search movie</label>
                    <input type="text" className="form-control" id="searchMovieBox" placeholder="Search movie by criteria" onChange={onChangeTextInput} />
                </div>

                <div className="form-check">
                    <input className="form-check-input" type="checkbox" name="title" id="title" onChange={onChangeField} />
                    <label className="form-check-label" htmlFor="title">Title</label>
                </div>

                <div className="form-check">
                    <input className="form-check-input" type="checkbox" name="actors" id="actors" onChange={onChangeField} />
                    <label className="form-check-label" htmlFor="actors">Actors</label>
                </div>

                <div className="form-check">
                    <input className="form-check-input" type="checkbox" name="characters" id="characters" onChange={onChangeField} />
                    <label className="form-check-label" htmlFor="characters">Characters</label>
                </div>

                <button className="btn btn-secondary" onClick={onClickSearch}>Search</button>
            </div>
            <div className="searchResults">
                {searchResults.map(searchResult => {
                    return (
                        <div className="card" key={searchResult._source.title}>
                            <div className="card-body">
                                <h5 className="card-title">{searchResult._source.title}</h5>
                                <p className="card-text">{searchResult._source.overview}</p>
                            </div>
                      </div>                        
                    );
                })}
            </div>
        </div>
    );
}