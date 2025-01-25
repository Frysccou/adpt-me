import errorDictionary from '../utils/errorDictionary.js';

const customErrorHandler = (err, req, res, next) => {
    const error = errorDictionary[err.message];
    if (error) {
        res.status(error.code).send({ status: 'error', message: error.message });
    } else {
        res.status(500).send({ status: 'error', message: 'Internal server error' });
    }
};

export default customErrorHandler;