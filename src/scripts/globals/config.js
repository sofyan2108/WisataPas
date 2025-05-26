const CONFIG = {
    LOKA_API: {
        CLIENT_ID: process.env.LOKA_CLIENT_ID || 'dummy_client_id_for_development',
        CLIENT_SECRET: process.env.LOKA_CLIENT_SECRET || 'dummy_secret_key_for_development',
        ENVIRONMENT: process.env.API_ENVIRONMENT || 'staging'
    }
};

export default CONFIG; 