// UserContext.js
import { createContext, useReducer } from 'react';

// Define the initial state
let GLOBAL_STATE = {
    workSpaceId: "<<WORKSPACE_ID>>",
    timeEntries: []
};

// Define the reducer
const globalReducer = (state, action) => {
    switch (action.type) {
      case "SET_WORKSPACE_ID":
        return {
          ...state,
          workSpaceId: action.workSpaceId
        };
      case "SET_TIME_ENTRIES": 
        return {
          ...state, 
          timeEntries: action.timeEntries
        }
      case "UPDATE_TIME_ENTRY": 
        const updatedTimeEntries = state.timeEntries.map(timeEntry => {
          if (timeEntry.id === action.timeEntryId) {
            console.log("Time entry inside context ", timeEntry.start)
            return {
              ...action.updatedTimeEntry
            };
          }
          return timeEntry;
        });
        return {
          ...state,
          timeEntries: updatedTimeEntries
        };
      default:
        return state;
    }
};
const UserContext = createContext();

export const UserContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(globalReducer, GLOBAL_STATE);
  const value = {
    ...state,
    setWorkspaceId: (workSpaceId) => {
      dispatch({ type: "SET_WORKSPACE_ID", workSpaceId });
    },
    setTimeEntries: (timeEntries) => {
      dispatch({ type: "SET_TIME_ENTRIES", timeEntries });
    },
    setTimeEntry: (timeEntryId, updatedTimeEntry) => {
      dispatch({ type: "UPDATE_TIME_ENTRY", timeEntryId, updatedTimeEntry });
    }
  };

  // Provide the state and functions to children components
  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
};


export default UserContext;