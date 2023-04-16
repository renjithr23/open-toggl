import { View, Text, StyleSheet } from 'react-native';
import ProjectList from '../components/ProjectList';
import {UserContextProvider} from '../context/UserContext'

const HomeScreen = () => {
  return (
    <>
      <UserContextProvider> 
        <View>
          <View style={styles.header_view}> 
            <Text style={styles.header_name}> Open Toggl </Text>
          </View>
          <ProjectList/>
        </View>
      </UserContextProvider>
    </>
  );
};


const styles = StyleSheet.create({
  header_view: {
    height: 100,
    fontWeight: 'bold',
    display: 'flex',
    justifyContent: 'center',
    flexDirection: 'row'
  }, 
  header_name: {
    fontSize: 18,
    position: 'absolute',
    bottom: 20,
    margin: 'auto',
    fontWeight: 'bold',
    color:'#111827', 
  }
});

export default HomeScreen;
