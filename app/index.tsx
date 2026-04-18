import 'react-native-reanimated';
import { Provider } from 'react-redux';
import AppNavigation from "./navigation";
import store from "./redux/store";

export default function App() {
  return (
    <Provider store={store}>
      <AppNavigation />
    </Provider>
  );
}
