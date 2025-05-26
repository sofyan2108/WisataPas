import CONFIG from '../globals/config';

const PRODUCTION_URL = 'https://api.travelokapartnersolution.com/v2';
const STAGING_URL = 'https://api-sandbox.travelokapartnersolution.com/v2';

class LokaApiService {
    constructor(config = {}) {
        this._baseUrl = config.isProduction ? PRODUCTION_URL : STAGING_URL;
        this._clientId = config.clientId || CONFIG.LOKA_API.CLIENT_ID;
        this._clientSecret = config.clientSecret || CONFIG.LOKA_API.CLIENT_SECRET;
        this._accessToken = null;
        this._tokenExpiry = null;
    }

    async _getAccessToken() {
        if (this._accessToken && this._tokenExpiry > Date.now()) {
            return this._accessToken;
        }

        const response = await fetch(`${this._baseUrl}/oauth/accesstoken`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: new URLSearchParams({
                client_id: this._clientId,
                client_secret: this._clientSecret
            })
        });

        const data = await response.json();
        this._accessToken = data.access_token;
        this._tokenExpiry = Date.now() + (data.expires_in * 1000);
        return this._accessToken;
    }

    async _makeAuthenticatedRequest(endpoint, options = {}) {
        const token = await this._getAccessToken();
        const headers = {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
            ...options.headers
        };

        const response = await fetch(`${this._baseUrl}${endpoint}`, {
            ...options,
            headers
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error?.message || 'API request failed');
        }

        return response.json();
    }

    async searchHotels(params = {}) {
        const queryParams = new URLSearchParams({
            countryISO: params.countryISO || 'ID',
            language: params.language || 'id',
            offset: params.offset || 0,
            limit: params.limit || 10,
            isExtended: params.isExtended || false,
            ...(params.hotelIds && { hotelIds: params.hotelIds.join(',') })
        }).toString();

        return this._makeAuthenticatedRequest(`/properties/content/hotel?${queryParams}`);
    }

    async getRates(params = {}) {
        const queryParams = new URLSearchParams({
            propertyIds: params.propertyIds?.join(','),
            checkInDate: params.checkInDate,
            checkOutDate: params.checkOutDate,
            numRooms: params.numRooms || 1,
            numAdults: params.numAdults || 1,
            displayCurrency: params.displayCurrency || 'IDR',
            language: params.language || 'id',
            userNationality: params.userNationality || 'ID',
            ...(params.numChildren && { numChildren: params.numChildren }),
            ...(params.childrenAges && { childrenAges: params.childrenAges.join(',') }),
            isExtended: params.isExtended || false
        }).toString();

        return this._makeAuthenticatedRequest(`/properties/:getRates?${queryParams}`);
    }

    async checkRate(params = {}) {
        return this._makeAuthenticatedRequest('/properties/checkRate', {
            method: 'POST',
            body: JSON.stringify({
                propertyId: params.propertyId,
                roomId: params.roomId,
                checkInDate: params.checkInDate,
                checkOutDate: params.checkOutDate,
                numRooms: params.numRooms || 1,
                numAdults: params.numAdults || 1,
                displayCurrency: params.displayCurrency || 'IDR',
                language: params.language || 'id',
                userNationality: params.userNationality || 'ID',
                rateKey: params.rateKey,
                ...(params.numChildren && { numChildren: params.numChildren }),
                ...(params.childrenAges && { childrenAges: params.childrenAges })
            })
        });
    }

    async createBooking(bookingData) {
        return this._makeAuthenticatedRequest('/bookings/booking/create', {
            method: 'POST',
            body: JSON.stringify(bookingData)
        });
    }

    async getBookings(params = {}) {
        const queryParams = new URLSearchParams({
            ...(params.offset && { offset: params.offset }),
            ...(params.limit && { limit: params.limit }),
            ...(params.checkInDate && { checkInDate: params.checkInDate }),
            ...(params.checkOutDate && { checkOutDate: params.checkOutDate }),
            ...(params.bookingStatus && { bookingStatus: params.bookingStatus }),
            ...(params.bookingIds && { bookingIds: params.bookingIds.join(',') }),
            ...(params.partnerBookingIds && { partnerBookingIds: params.partnerBookingIds.join(',') })
        }).toString();

        return this._makeAuthenticatedRequest(`/bookings?${queryParams}`);
    }

    async getBookingDetail(params = {}) {
        const queryParams = new URLSearchParams({
            ...(params.bookingId && { bookingId: params.bookingId }),
            ...(params.partnerBookingId && { partnerBookingId: params.partnerBookingId })
        }).toString();

        return this._makeAuthenticatedRequest(`/bookings/detail?${queryParams}`);
    }

    async cancelBooking(cancellationData) {
        return this._makeAuthenticatedRequest('/bookings/cancellation/submit', {
            method: 'POST',
            body: JSON.stringify(cancellationData)
        });
    }

    async searchGeo(params = {}) {
        const queryParams = new URLSearchParams({
            ...(params.latitude && { latitude: params.latitude }),
            ...(params.longitude && { longitude: params.longitude }),
            ...(params.limit && { limit: params.limit }),
            ...(params.offset && { offset: params.offset }),
            ...(params.countryCode && { countryCode: params.countryCode }),
            ...(params.language && { language: params.language }),
            ...(params.geoName && { geoName: params.geoName })
        }).toString();

        return this._makeAuthenticatedRequest(`/discovery/getGeo?${queryParams}`);
    }

    async discoverRates(params = {}) {
        return this._makeAuthenticatedRequest('/discovery/getRates', {
            method: 'POST',
            body: JSON.stringify(params)
        });
    }
}

export default LokaApiService; 