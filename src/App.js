import ElasticProvider from "./components/Elastic";
import Search from './components/Search';

export default function App() {
    return (
        <div className="container">
            <ElasticProvider>
                <Search />
            </ElasticProvider>
        </div>
    );
}