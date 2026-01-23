import axios from 'axios';

export interface NominatimResponse {
    place_id: number;
    licence: string;
    osm_type: string;
    osm_id: number;
    lat: string;
    lon: string;
    class: string;
    type: string;
    place_rank: number;
    importance: number;
    addresstype: string;
    name: string;
    display_name: string;
    boundingbox: string[];
}

export class OsmService {
    private static readonly NOMINATIM_URL = 'https://nominatim.openstreetmap.org/search';

    /**
     * Search for a location using an address or query string.
     * @param query The address or location query (e.g., "Srirampuram")
     * @returns List of matching results from Nominatim
     */
    static async searchAddress(query: string): Promise<NominatimResponse[]> {
        try {
            if (!query) {
                throw new Error('Query string is required');
            }

            console.log(`OSM Searching for: ${query}`);

            const response = await axios.get<NominatimResponse[]>(this.NOMINATIM_URL, {
                params: {
                    q: query,
                    format: 'json',
                    limit: 1, // We prioritize the top result
                },
                headers: {
                    'User-Agent': 'SkipTracingApp/1.0', // Nominatim requires a User-Agent
                },
            });

            return response.data;
        } catch (error) {
            console.error('Error fetching data from OpenStreetMap:', error);
            throw new Error('Failed to fetch location data from OpenStreetMap');
        }
    }
}
