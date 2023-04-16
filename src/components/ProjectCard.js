import React, { useEffect, useState, useContext } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity
} from 'react-native';
import { Feather } from '@expo/vector-icons'; 
import UserContext from '../context/UserContext';
import { createEntries } from '../hooks/createEntries';

const SECOND = 1000;
const MINUTE = SECOND * 60;
const HOUR = MINUTE * 60;

const isThisRunningRightNow = (time_entry) => { 
  if(time_entry.start != null && time_entry.stop == null) {
    return true 
  } 
  return false
}

const ProjectCard = ({ time_entry}) => {
  const userContext = useContext(UserContext);
  const { setTimeEntry, workSpaceId, timeEntries, refreshState} = userContext;
  const [createTimeEntries, stopTimeEntries] = createEntries()

  // Set the initial start time.  
  const [startTime, setStartTime] = useState(()=>{
    if(isThisRunningRightNow(time_entry)){
      return new Date(time_entry.start)
    } 
    return null
  }) 
  const [currentTime, setCurrentTime] = useState(null);

  // useEffect that runs every second to update the timer.
  useEffect(() => {
    const interval = setInterval(() => setCurrentTime(new Date()), 1000)
    return () => clearInterval(interval)
  })

  // useEffect that runs only when time_entry gets updated. 
  useEffect(() => {
    if(isThisRunningRightNow(time_entry)){
      setStartTime(new Date(time_entry.start))
    }
  }, [time_entry])

  const handlePlayPress = async () => {
    if (!isThisRunningRightNow(time_entry)) {
      console.log("Creating TimeEntries", time_entry.project_name, time_entry.id)
      let created_time_entry_id = await createTimeEntries(workSpaceId, time_entry)
      
      let updated_entry = Object.assign({}, time_entry);
      updated_entry.start = new Date().toISOString()
      updated_entry.stop = null
      console.log("Entry returned after API call, ", created_time_entry_id)
      updated_entry.id = created_time_entry_id
      
      setTimeEntry(time_entry.id, updated_entry)
    } else {
      console.log("Stopping the time entry for", time_entry.project_name, time_entry.id)
      
      let updated_entry = Object.assign({}, time_entry);
      updated_entry.stop = new Date().toISOString()
      setTimeEntry(time_entry.id, updated_entry)
      
      stopTimeEntries(workSpaceId, time_entry) 
    }
  }
  
  const displayTimeDiff = (startTime, endTime) => { 
    let diff = endTime - startTime; 
    if(diff <= 0) {
      return ""
    }
    let hours = Math.floor(diff / HOUR) % 24
    let minutes = Math.floor(diff / MINUTE) % 60
    let seconds = Math.floor(diff / SECOND) % 60
    if(hours == 0 && minutes == 0){
      return `${seconds}`
    } else if (hours == 0) { 
      return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`
    } 
    return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`
  }

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <View style={styles.details}>
          <Text style={styles.project_name}>{time_entry.project_name}</Text>
          {time_entry.description != "" && <Text style={styles.description}>{time_entry.description}</Text>}
        </View>
        <View style={styles.showtime}>
          {isThisRunningRightNow(time_entry) && <Text style={styles.showTimeElapsed}>{displayTimeDiff(startTime, currentTime)}</Text>}
          {isThisRunningRightNow(time_entry) && <Text style={styles.showStartTime}>{`${startTime.getHours()}:${startTime.getMinutes()}`}</Text>}
        </View>
        <View style={styles.play}> 
          <TouchableOpacity onPress={handlePlayPress}>
            <Feather name={isThisRunningRightNow(time_entry) ? 'pause': 'play'} size={39} color="black" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  ); 
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#D0EBE5',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 5,
    padding: 16,
    margin: 3,
    height: 90,
    display: 'flex',
    flexDirection: 'row'
  },
  container: {
    marginBottom: 2
  },
  project_name: { 
    fontSize: 18,
    fontWeight: 'bold',
    color:'#111827', 
  },
  details: { 
    flexDirection: 'column', 
    justifyContent: 'space-around',
    flex: 6
  },
  description: { 
    fontSize: 14,
    color: '#666',
  }, 
  play: {
    flex:1,
    flexDirection: 'column', 
    justifyContent: 'space-around',
    right:0,
  }, 
  showtime: {
    flex:2,
    marginTop: 10, 
    marginRight: 15,
    textAlign: 'right'
  }, 
  showStartTime: {
    textAlign: 'right',
    fontSize: 12,
    color: '#666',
  }, 
  showTimeElapsed: { 
    fontSize: 18,
    textAlign: 'right',
    fontWeight: 'bold',
  }
});

export default ProjectCard;
