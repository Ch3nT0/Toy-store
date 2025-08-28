const cartReducer = (state = [], action) => {
    const newState=[...state];
    switch (action.type) {
        case "ADD_TO_CART":
            return [
                ...state,
                {
                    id: action.id,
                    info: action.info, 
                    quality:1
                }
            ]
            case "UPDATE_QUANLITY":
                const itemUpadte=newState.find(item=> item.id===action.id);
                itemUpadte.quality+=action.quanlity;
                return newState;
            case "DELETE_ITEM":
                return newState.filter(item => item.id !== action.id);
            case "DELETE_ALL":
                return [];
        default:
            return state;
    }
}

export default cartReducer;