import React from "react";
import axios from "axios";
import config from "../../config";

export default function Search() {
    const [count, setCount] = React.useState(0);
    const [token, setToken] = React.useState(window.localStorage.getItem("token"));

    React.useEffect(() => {
        axios.get(`${config.ELASTIC_HOST}/movies/_count`, {
            headers: {
                "Authorization": `Bearer ${token}`
            }
        }).then(res => {
           setCount(res.data.count)
        }).catch(err => {
            console.log(err);
        });
    }, [])

    const onClickSearch = (e) => {
        const query = {
            "query": {
                "match": {
                    "title": "Last Jedi"
                }
            }
        }
        
        axios.post(`${config.ELASTIC_HOST}/movies/_search`, query, {
            headers: {
                "Authorization": `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        }).then(res => {
           console.log(res);
        }).catch(err => {
            console.log(err);
        });
    };

    return (
        <div className="search">
            <h1>All movies {count}</h1>
            <button onClick={onClickSearch}>Search</button>
        </div>
    );
}