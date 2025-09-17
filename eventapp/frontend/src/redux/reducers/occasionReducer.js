const initialData = {
    occasions: []
};

export const occasionReducer = (state = initialData, action) => {

    switch (action.type) {

        case 'GET_ALL_OCCASIONS': {
            return {
                ...state,
                occasions: action.payload
            }
        }


        default: return state
    }

}