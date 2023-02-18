import React from "react";
import axios from "axios";

import { ELASTIC_HOST } from "../../config";
import { useElastic } from "../Elastic";

import { Accordion, AccordionDetails, AccordionSummary, Button, Checkbox, FormControlLabel, FormGroup, TextField, Typography } from "@mui/material";

import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

type Props = {
    indexName: string;
    availableFields: string[];
}

export default function Search({ indexName, availableFields }: Props) {
    const [count, setCount] = React.useState<number>(0);
    const [fields, setFiels] = React.useState<string[]>([]);
    const [searchValue, setSearchValue] = React.useState<string | null>(null);
    const [searchResults, setSearchResults] = React.useState<any[]>([]);

    const { token } = useElastic();

    const API_PATH = `${ELASTIC_HOST}/${indexName}`;

    React.useEffect(() => {
        const abortController = new AbortController();

        axios.get(`${API_PATH}/_count`, {
            signal: abortController.signal,
            headers: {
                'Authorization': `Bearer ${token}`
            }
        }).then((res: any) => {
            setCount(res.data.count)
        }).catch((err: any) => {
            console.log(err);
        });

        return () => abortController.abort();
    }, [token]);

    const onChangeField = (e: any) => {
        const { target: { name, checked } } = e;

        if (checked) {
            setFiels(oldFields => [
                ...oldFields,
                name
            ]);
        } else {
            setFiels(oldFields => oldFields.filter(n => n !== name));
        }
    };

    const onChangeTextInput = (e: any) => {
        const { value } = e.target;

        setSearchValue(value);
    };

    const onClickSearch = (e: any) => {
        const query = {
            "query": {
                "multi_match": {
                    "query": searchValue,
                    "type": "cross_fields",
                    'fields': fields,
                    'operator': 'and'
                }
            }
        }

        axios.post(`${API_PATH}/_search`, query, {
            headers: {
                "Authorization": `Bearer ${token}`
            }
        }).then((res: any) => {
            console.log(res);
            setSearchResults(res.data.hits.hits);
        }).catch((err: any) => {
            console.log(err);
        });
    };

    return (
        <div>
            <div className="searchInput">
                <TextField fullWidth label="Search movie" variant="outlined" margin="normal" onChange={onChangeTextInput} />

                {availableFields.map(fieldName => <FormControlLabel key={fieldName} label={fieldName} control={<Checkbox name={fieldName} onChange={onChangeField} />} />)}

                <Button variant="contained" onClick={onClickSearch}>Search</Button>
            </div>
            <div className="searchResults">
                {searchResults.map(searchResult => {
                    return (
                        <Accordion key={searchResult._source.title}>
                            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                                <Typography variant="h6">{searchResult._source.title}</Typography>
                            </AccordionSummary>
                            <AccordionDetails>
                                <Typography>{searchResult._source.overview}</Typography>
                                <hr />
                                <p> <strong>Actors: </strong> {searchResult._source.actors && searchResult._source.actors.map((actor: string) => <span key={actor}>{actor}, </span>)} </p>
                                <p> <strong>Characters: </strong> {searchResult._source.characters && searchResult._source.characters.map((actor: string) => <span key={actor}>{actor}, </span>)} </p>
                            </AccordionDetails>
                        </Accordion>
                    );
                })}
            </div>
        </div>
    );
}