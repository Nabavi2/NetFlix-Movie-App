import { createStore, combineReducers, applyMiddleware } from "redux";
import { Provider } from "react-redux";
import thunk from "redux-thunk";
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import useCachedResources from './hooks/useCachedResources';
import useColorScheme from './hooks/useColorScheme';
import Navigation from './navigation';
import authReducer from "./store/reducers/Auth";
import movieReducer from './store/reducers/movie';
import seriesReducer from './store/reducers/series';
import downloadReducer from './store/reducers/download';
import userReducer from './store/reducers/user';

const rootReducer = combineReducers({
  auth: authReducer,
  movies: movieReducer,
  series: seriesReducer,
  download: downloadReducer,
  user: userReducer,
});
const store = createStore(rootReducer, applyMiddleware(thunk));
export default function App() {


  const isLoadingComplete = useCachedResources();
  const colorScheme = useColorScheme();

  if (!isLoadingComplete) {
    return null;
  } else {
    return (
      <Provider store={store}>
        <Navigation colorScheme={colorScheme} />
        <StatusBar />
      </Provider>
    );
  }
}
