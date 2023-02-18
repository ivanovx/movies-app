import React from "react";
import axios from "axios";

import config from "../../config";
import { useElastic } from "../Elastic";

type Props = {
    indexName: string;
    availableFields: string[];
}

export default function Search({ indexName, availableFields } : Props) {
    const [count, setCount] = React.useState<number>(0);
    const [fields, setFiels] = React.useState<string[]>([]);
    const [searchValue, setSearchValue] = React.useState<string | null>(null);
    const [searchResults, setSearchResults] = React.useState<any[]>([]);

    const { token } = useElastic();

    const API_PATH=`${config.ELASTIC_HOST}/${indexName}`;

    React.useEffect(() => {
        axios.get(`${API_PATH}/_count`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        }).then((res: any) => {
           setCount(res.data.count)
        }).catch((err: any) => {
            console.log(err);
        });
    }, [token]);

    const onChangeField = (e: any) => {
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

    const onChangeTextInput = (e: any) => {
        const { value } = e.target;
        
        setSearchValue(value);

       
            const query = {
                "query": {
                    "match": {
                        "title": value
                    }
                },
                  "suggest" : {
                    "title-suggestion" : {
                      "text" : value,
                      "term" : {
                        "field" : "title"
                      }
                    }
                  }
            }
            
            axios.post(`${API_PATH}/_search`, query, {
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            }).then((res: any) => {
               console.log(res);
            }).catch((err: any) => {
                console.log(err);
            });

    };

    const onClickSearch = (e: any) => {
        const query = {
            "query": {
                "multi_match": {
                    "query": searchValue,
                    "type":  "cross_fields",
                    'fields': fields,
                    'operator': 'and'
                }
            },
            "size": 100
        }
        
        axios.post(`${API_PATH}/_search`, query, {
            headers: {
                "Authorization": `Bearer ${token}`
            }
        }).then((res:any) => {
           console.log(res);
           setSearchResults(res.data.hits.hits);
        }).catch((err:any) => {
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

                {availableFields.map(fieldName => (
                    <div className="form-check" key={fieldName}>
                        <input className="form-check-input" type="checkbox" name={fieldName} id={fieldName} onChange={onChangeField} />
                        <label className="form-check-label" htmlFor={fieldName}>{fieldName}</label>
                    </div>
                ))}

                <button className="btn btn-secondary" onClick={onClickSearch}>Search</button>
            </div>
            <div className="searchResults">
                {searchResults.map(searchResult => {
                    return (
                        <>
                        <div className="card" key={searchResult._source.title}>
                            <div className="card-body">
                                <h5 className="card-title">
                                    {searchResult._source.title} {" "}
                                    <span className="badge bg-secondary">{searchResult._score}</span>
                                </h5>
                                <p>
                                    {searchResult._source.genres && searchResult._source.genres.map(genre => <span className="badge bg-secondary" key={genre}>{genre}</span>)} 
                                </p>
                                {searchResult._source.overview && <p className="card-text">{searchResult._source.overview}</p>}
                                {searchResult._source.description && <p className="card-text">{searchResult._source.description}</p>}
                                <hr />
                                <p> <strong>Actors: </strong> {searchResult._source.actors && searchResult._source.actors.map(actor => <span key={actor}>{actor}, </span>)} </p>
                                <p> <strong>Characters: </strong> {searchResult._source.characters && searchResult._source.characters.map(actor => <span key={actor}>{actor}, </span>)} </p>
                            </div>
                      </div>
                      <br />
                      </>                       
                    );
                })}
            </div>
        </div>
    );
}