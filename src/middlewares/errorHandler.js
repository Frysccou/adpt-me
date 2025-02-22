const errorHandler = (err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send({ status: 'error', message: 'Internal server error' });
};

export default errorHandler