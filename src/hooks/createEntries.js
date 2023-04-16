import { useState } from 'react';
import toggl from '../api/toggl';

// The additional state variables currentRunningId is not required. 
// It is a relic from a previous version of this component and has 
// been kept for doc purposes. 
const createEntries = () => {
  const [currentRunningId, setCurrentRunningId] = useState('-1');
  const [errorMessage, setErrorMessage] = useState('');

  const createTimeEntries = async (workspace_id, time_entry) => {
    console.log('Inside createTimeEntries for', time_entry.project_name, time_entry.id);
    try {
        const data = {
            "created_with": "open-toggl",
            "description": time_entry.description,
            "start": new Date().toISOString(),
            "duration": -1 * Math.floor(Date.now() / 1000),
            "project_id": Number(time_entry.project_id),
            "workspace_id": Number(workspace_id)
        }
        console.log("Sending request to create time_entry for ", time_entry.description)

        const response = await toggl.post(`/workspaces/${workspace_id}/time_entries`, data);
        return response.data.id
    } catch (err) {
        console.log("Catching error", err)
        setErrorMessage('Something went wrong');
    }
  };

  const stopTimeEntries = async (workspace_id, time_entry) => {
    console.log('Stopping time_entry - ', time_entry.project_name, time_entry.id);
    try {
        console.log("Sending stop request for time_entry, ", time_entry.id)
 
        const response = await toggl.patch(`/workspaces/${workspace_id}/time_entries/${time_entry.id}/stop`, {});
        setCurrentRunningId('-1');
    } catch (err) {
        console.log("Catching error", err)
      setErrorMessage('Something went wrong');
    }
  };

  return [createTimeEntries, stopTimeEntries, currentRunningId, errorMessage];
};


export {createEntries}
