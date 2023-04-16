import React, { useContext, useEffect } from 'react';
import {
  View,
  StyleSheet,
  FlatList
} from 'react-native';
import ProjectCard from './ProjectCard';
import UserContext from '../context/UserContext';
import toggl from '../api/toggl';

// Define priorities for each project for ordering. 
const PROJECT_PRIORITY = { 
  "Tinkering" : 1, 
  "PayPal": 2,
  "Walking": 3, 
  "Random Exploration": 4
}

const ProjectList = () => {
  const userContext = useContext(UserContext);
  const { setTimeEntries, timeEntries, workSpaceId } = userContext;
  let enriched_time_entries = null

  useEffect(() => { 
    const fetchData = async () => {
      let time_entries = await getTimeEntries()
      let projects = await getProjects(workSpaceId)
      enriched_time_entries = addProjectNameToTimeEntries(projects, time_entries)
      enriched_time_entries = orderTimeEntriesBasedOnPriority(enriched_time_entries)
      enriched_time_entries = filterUniqueEntries(enriched_time_entries)
      setTimeEntries(enriched_time_entries)
    }
    fetchData()
  }, []);

  return (
    <View style={styles.container}>
      <View>
        <FlatList
          data={timeEntries}
          renderItem={ ({item}) => {
            return (
              <ProjectCard 
              time_entry={item} 
              />
            )
          }}
          keyExtractor={time_entry => time_entry.id} />
       </View> 
    </View>
  );
};

const orderTimeEntriesBasedOnPriority = (time_entries) => {
  time_entries.sort((first, second) => {
    if(PROJECT_PRIORITY[first.project_name] && PROJECT_PRIORITY[second.project_name]) {
      return PROJECT_PRIORITY[first.project_name] - PROJECT_PRIORITY[second.project_name]
    } else if (PROJECT_PRIORITY[first.project_name]) { 
      return -1;
    } else if (PROJECT_PRIORITY[first.project_name]) { 
      return 1;
    }
  })
  return time_entries;
}

const filterUniqueEntries = (time_entries) => {
  let already_encountered = new Set();

  return time_entries.filter((time_entry) => {
    if(!already_encountered.has(time_entry.project_name + time_entry.description)) { 
      already_encountered.add(time_entry.project_name + time_entry.description)
      return true;
    }
    return false;
  })
}

const getTimeEntries = async () => {
  try {
    // TODO: Use start date and end date to get only the time Entries for the past few days. 
    // https://developers.track.toggl.com/docs/api/time_entries
    const response = await toggl.get('/me/time_entries', {});
    return response.data
  } catch (err) {
    console.log("Error thrown when trying to fetch latest time entries - ", err)
  }
  return null
};

const getProjects = async (workspace_id) => {
  try {
    const response = await toggl.get(`/workspaces/${workspace_id}/projects`, {});
    return response.data
  } catch (err) {
    console.log("Error thrown when trying to fetch projects - ", err)
  }
};

const addProjectNameToTimeEntries = (projects, time_entries) => { 
  return time_entries.filter(
    time_entry => projects.find(project => project.id === time_entry.project_id)
  ).map((time_entry) => {
    return {...time_entry, "project_name": projects.find(project => project.id === time_entry.project_id).name}
  })
}

const styles = StyleSheet.create({
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 15,
    marginBottom: 5
  },
  container: {
    marginBottom: 10
  }
});

export default ProjectList;
