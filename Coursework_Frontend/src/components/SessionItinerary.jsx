import Talk from "./Talk.jsx";


const SessionItinerary = ({talks, session}) => {
    return (
        <div>
            {session ? (<h2>Session {session}</h2>) : <h2>All Sessions</h2>}
            <br/>
            {talks.map((talk) => {
                return (
                    <Talk key={talk.id} talk={talk ? talk : null} />
                )
            })}
        </div>
    );
};

export default SessionItinerary;
