const find = require('lodash/find'); // for finding correct object
const fs = require('fs'); // for writing the output to a new json

const AIRPORTS = require('./airports.json'); // 3684
const FLIGHTS = require('./airlines.json'); // 539382

console.log(FLIGHTS[366730]);

// Airport Code Filtering
const findStateByIata = (iata) => {
    const airport = find(AIRPORTS, {iata: iata});
    let { state } = airport;
    return state;
}

// Dictionary of States-Regions relationships. 
// Note: AK and HI put into West, PR and VI put into Southeast, DC put into Northeast
const REGIONS = [
    {
        name: 'West',
        states: ['WA', 'MT', 'OR', 'ID', 'WY', 'NV', 'UT', 'CO', 'CA', 'AK', 'HI']
    },
    {
        name: 'Southwest',
        states: ['AZ', 'NM', 'OK', 'TX']
    },
    {
        name: 'Midwest',
        states: ['ND', 'MN', 'SD', 'WI', 'NE', 'IA', 'KS', 'MO', 'IL', 'IN', 'MI', 'OH']
    },
    {
        name: 'Southeast',
        states: ['AR', 'TN', 'KY', 'WV', 'VA', 'NC', 'SC', 'FL', 'GA', 'AL', 'MS', 'LA', 'PR', 'VI']
    },
    {
        name: 'Northeast',
        states: ['ME', 'VT', 'NH', 'MA', 'RI', 'CT', 'NY', 'PA', 'NJ', 'MD', 'DE', 'DC']
    }
];

// Region Filtering
const findRegionByState = (stateCode) => {
    let region = find(REGIONS, function(obj) {
        if (obj.states.includes(stateCode)) {
            return true;
        }
    })
    // console.log(region)
    let { name } = region;
    return name;
}

// export new json
const writeJSON = (arr) => {
    let resJSON = JSON.stringify(arr);
    fs.writeFileSync('newData.json', resJSON);
}

// Add new properties to objects
let newData = [];
for (let i = 0; i < FLIGHTS.length; i++){
    console.log(i);
    let newDeets = { ...FLIGHTS[i]}

    newDeets['StateFrom'] = findStateByIata(FLIGHTS[i]['AirportFrom']);
    newDeets['StateTo'] = findStateByIata(FLIGHTS[i]['AirportTo']);

    newDeets['RegionFrom'] = findRegionByState(newDeets['StateFrom']);
    newDeets['RegionTo'] = findRegionByState(newDeets['StateTo']);

    newData.push(newDeets);
}

writeJSON(newData);