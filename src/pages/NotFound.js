import { Link } from 'react-router-dom';

export default function NotFound(){
    return <div><h1>404 Page not found</h1>
        <br/>
        <Link to="/"><h3>Back to Homepage</h3></Link>
    </div>;
}