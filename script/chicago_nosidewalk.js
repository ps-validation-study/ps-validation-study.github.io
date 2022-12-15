// TO MAKE THE MAP APPEAR YOU MUST
	// ADD YOUR ACCESS TOKEN FROM
	// https://account.mapbox.com
	mapboxgl.accessToken = 'pk.eyJ1IjoiY3Jlc2NlbmRvY2h1IiwiYSI6ImNreHcxZGQ4bjRiZ2czMXF3NGZlanUwOHUifQ.1iEERJ4M83PNKmIJ8pH1Qg';
    const map = new mapboxgl.Map({
        container: 'map',
        style: 'mapbox://styles/mapbox/dark-v10',
        center: [-87.77070,41.88406],
        zoom: 9
    });

    map.on('load', () => {
        map.addSource('places', {
            'type': 'geojson',
            'data': "https://raw.githubusercontent.com/ps-validation-study/ps-validation-study.github.io/source/data/chicago_nosidewalk.json"
        });
        // Add a layer showing the places.
        map.addLayer({
            'id': 'places',
            'type': 'circle',
            'source': 'places',
            'paint': {
                'circle-color': [
                    'match',
                    ['get', 'label_type'],
                    'NoSidewalk',
                    '#BE87D8',
                    /* other */ '#ccc'
                    ],
                'circle-radius': 5,
                'circle-stroke-color': '#ffffff',
                'circle-stroke-width': ['case',
                ['==', ['get', 'clustered'], true],
                2,
                0,
                ],
                'circle-opacity': 0.7
            }
        });

        // Create a popup, but don't add it to the map yet.
        const popup = new mapboxgl.Popup({
            closeButton: true,
            closeOnClick: true
        });


        map.on('mouseenter', 'places', (e) => {
            // Change the cursor style as a UI indicator.
            map.getCanvas().style.cursor = 'pointer';

            // Copy coordinates array.
            const coordinates = e.features[0].geometry.coordinates.slice();
            const label_type = e.features[0].properties.label_type;
            const severity = e.features[0].properties.severity;
            const url = e.features[0].properties.img_url;
            const tag = e.features[0].properties.tag_list;
            const img = "<img width = 270px src=" +"'" + url + "'" + "/>"
            const user = e.features[0].properties.username;
            const cluster = e.features[0].properties.cluster_id;
            const clustered = e.features[0].properties.clustered;
  
            

            // Ensure that if the map is zoomed out such that multiple
            // copies of the feature are visible, the popup appears
            // over the copy being pointed to.
            while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
                coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
            }

            // Populate the popup and set its coordinates
            // based on the feature found.
            popup.setLngLat(coordinates).setHTML
            ( "<div>"+"<strong>User:</strong> " + user + "</div>"
            + "<div>"+"<strong>Label Type:</strong> " + label_type + "</div>"
            + "<div>"+"<strong>Severity:</strong> " + severity + "</div>"
            + "<div>"+"<strong>Tags:</strong> " + tag + "</div>"
            + "<div>"+"<strong>Cluster:</strong> " + clustered + "</div>"
            + "<div>"+"<strong>Cluster ID:</strong> " + cluster + "</div>"
            + "<div>"+img+"</div>").addTo(map);
        });

        // Add zoom and rotation controls to the map.
        map.addControl(new mapboxgl.NavigationControl());

        // map.on('mouseleave', 'places', () => {
        //     map.getCanvas().style.cursor = '';
        //     popup.remove();
        // });
    });