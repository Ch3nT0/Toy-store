import { combineReducers } from "redux";
import cartReducer from "./cart";
import loginReducer from "./loginReducer";

const allReducers = combineReducers({
    cartReducer,login:loginReducer
}); 
export default allReducers;