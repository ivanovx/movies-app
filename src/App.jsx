import ElasticProvider from "./components/Elastic";
import Search from './components/Search';

export default function App() {
    const indexName = 'movies';
    const availableFields = [
        'title',
        'actors',
        'characters'
    ];

    return (
        <div className="container">
            <ElasticProvider>
                <Search indexName={indexName} availableFields={availableFields} />
            </ElasticProvider>
        </div>
    );
}