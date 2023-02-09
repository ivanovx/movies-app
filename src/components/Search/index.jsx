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
        const sampleQuery = {
            "query": {
                "match": {
                    "title": "Jedi"
                }
            }
        };

        axios.get(`${config.ELASTIC_HOST}/movies/_search`, {
            data: JSON.stringify(sampleQuery),
            headers: {
                "Authorization": `Bearer ${token}`
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