import PlaceBadge from './PlaceBadge.jsx';

function MainPage({places}) {

    const indoor_places_badges = Object.entries(places.indoor).map(([place_name, place_info]) => 
            <PlaceBadge key={place_name} place_name={place_name}/>
        );
    const outdoor_places_badges = Object.entries(places.outdoor).map(([place_name, place_info]) => 
            <PlaceBadge key={place_name} place_name={place_name}/>
        );

    return (
        <div className="row" id="places-buttons">
            <div className="col d-flex align-items-end flex-column gap-1">
                <h2>Indoor</h2>
                {indoor_places_badges}
                <button className="btn btn-outline-primary">Add place</button>
            </div>
            <div className="col d-flex align-items-start flex-column border-start gap-1">
                <div className="row">
                    <h2>Outdoor</h2>
                </div>
                {outdoor_places_badges}
                <button className="btn btn-outline-primary">Add place</button>
            </div>
        </div>
    )
}

export default MainPage