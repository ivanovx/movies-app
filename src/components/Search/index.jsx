import React from "react";
import axios from "axios";
import config from "../../config";

export default function Search() {
    const [count, setCount] = React.useState(0);
    const [fields, setFiels] = React.useState([]);
    const [searchValue, setSearchValue] = React.useState(null);
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
    }, []);

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
                "match": {
                    "title": searchValue
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


    React.useEffect(() => {
        console.log(fields);
    }, [fields]);

    React.useEffect(() => {
        console.log(searchValue);
    }, [searchValue]);

    return (
        <div className="search">
            <h1>All movies {count}</h1>
            
            <input type="text" onChange={onChangeTextInput} />

            <div>
                <input type="checkbox" name="title" onChange={onChangeField} />
                <input type="checkbox" name="actors" onChange={onChangeField} />
                <input type="checkbox" name="overview" onChange={onChangeField} />
            </div>

            <button onClick={onClickSearch}>Search</button>
        </div>
    );
}