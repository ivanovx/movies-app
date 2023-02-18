import { Container } from "@mui/system";

import ElasticProvider from "./components/Elastic";
import Search from './components/Search';

export default function App() {
    const indexName = 'movies';
    const availableFields = [
        'title',
        'actors',
        'characters',
        'genres',
    ];

    return (
        <Container maxWidth="md">
            <ElasticProvider>
                <Search indexName={indexName} availableFields={availableFields} />
            </ElasticProvider>
        </Container>
    );
}
