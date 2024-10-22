import {Link} from "react-router-dom";

function NotFoundPage() {
    return (
        <>
            <div>404 NOT FOUND</div>
            <Link to="/rooms">Home</Link>
        </>
    )
}

export default NotFoundPage;