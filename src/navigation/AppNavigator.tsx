import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { ThemeProvider, useTheme } from '../theme';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

// Screens
import TasksScreen from '../screens/TasksScreen';
import NotesScreen from '../screens/NotesScreen';
import CalendarScreen from '../screens/CalendarScreen';
import PomodoroScreen from '../screens/PomodoroScreen';
import ProgressScreen from '../screens/ProgressScreen';
import ProfileScreen from '../screens/ProfileScreen';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const TabNavigator = () => {
  const { colors, isDarkMode } = useTheme();
  
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerStyle: {
          backgroundColor: colors.primary,
        },
        headerTintColor: colors.onPrimary,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.onSurfaceVariant,
        tabBarStyle: {
          backgroundColor: colors.surface,
          borderTopColor: colors.outline,
        },
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: string;

          switch (route.name) {
            case 'Tasks':
              iconName = focused ? 'clipboard-check' : 'clipboard-check-outline';
              break;
            case 'Notes':
              iconName = focused ? 'note' : 'note-outline';
              break;
            case 'Calendar':
              iconName = focused ? 'calendar' : 'calendar-outline';
              break;
            case 'Pomodoro':
              iconName = focused ? 'timer' : 'timer-outline';
              break;
            case 'Progress':
              iconName = focused ? 'chart-line' : 'chart-line-variant';
              break;
            case 'Profile':
              iconName = focused ? 'account' : 'account-outline';
              break;
            default:
              iconName = 'help';
              break;
          }

          return <MaterialCommunityIcons name={iconName} size={size} color={color} />;
        },
      })}>
      <Tab.Screen 
        name="Tasks" 
        component={TasksScreen} 
        options={{
          title: 'Görevler',
          tabBarLabel: 'Görevler',
        }}
      />
      <Tab.Screen 
        name="Notes" 
        component={NotesScreen}
        options={{
          title: 'Notlar',
          tabBarLabel: 'Notlar',
        }}
      />
      <Tab.Screen 
        name="Calendar" 
        component={CalendarScreen}
        options={{
          title: 'Takvim',
          tabBarLabel: 'Takvim',
        }}
      />
      <Tab.Screen 
        name="Pomodoro" 
        component={PomodoroScreen}
        options={{
          title: 'Pomodoro',
          tabBarLabel: 'Pomodoro',
        }}
      />
      <Tab.Screen 
        name="Progress" 
        component={ProgressScreen}
        options={{
          title: 'İlerleme',
          tabBarLabel: 'İlerleme',
        }}
      />
      <Tab.Screen 
        name="Profile" 
        component={ProfileScreen}
        options={{
          title: 'Profil',
          tabBarLabel: 'Profil',
        }}
      />
    </Tab.Navigator>
  );
};

const AppNavigator = () => {
  return (
    <ThemeProvider>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Main" component={TabNavigator} />
        </Stack.Navigator>
      </NavigationContainer>
    </ThemeProvider>
  );
};

export default AppNavigator;
