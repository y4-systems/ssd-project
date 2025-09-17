const initialData = {
  eventbookings: [],
};

export const eventbookingsReducer = (state = initialData, action) => {
  switch (action.type) {
    case "GET_ALL_BOOKINGS": {
      return {
        ...state,
        eventbookings: action.payload,
      };
    }

    default:
      return state;
  }
};
