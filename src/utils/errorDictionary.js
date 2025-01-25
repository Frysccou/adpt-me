const errorDictionary = {
    USER_NOT_FOUND: {
        code: 404,
        message: "User not found"
    },

    PET_NOT_FOUND: {
        code: 404,
        message: "Pet not found"
    },

    PET_ALREADY_ADOPTED: {
        code: 400,
        message: "Pet already adopted"
    },

    INCOMPLETE_VALUES: {
        code: 400,
        message: "Incomplete values"
    },

    USER_ALREADY_EXISTS: {
        code: 400,
        message: "User already exists"
    },

    INCORRECT_PASSWORD: {
        code: 400,
        message: "Incorrect password"
    }
};

export default errorDictionary;