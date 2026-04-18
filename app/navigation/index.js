import { NavigationContainer, NavigationIndependentTree } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import * as React from "react";
import CustomRecipesScreen from "../screens/CustomRecipesScreen";
import FavoriteScreen from "../screens/FavoriteScreen";
import HomeScreen from "../screens/HomeScreen";
import MyRecipeScreen from "../screens/MyRecipeScreen";
import RecipeDetailScreen from "../screens/RecipeDetailScreen";
import RecipesFormScreen from "../screens/RecipesFormScreen";
import WelcomeScreen from "../screens/WelcomeScreen";

const Stack = createNativeStackNavigator();

function AppNavigation() {
  return (
    <NavigationIndependentTree>
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Welcome"
        screenOptions={{ headerShown: false }}
      >
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Welcome" component={WelcomeScreen} />
        <Stack.Screen name="RecipeDetail" component={RecipeDetailScreen} />
        <Stack.Screen name="MyFood" component={MyRecipeScreen} />
        <Stack.Screen name="CustomRecipesScreen" component={CustomRecipesScreen} />
        <Stack.Screen name="RecipesFormScreen" component={RecipesFormScreen} />
        <Stack.Screen name="FavoriteScreen" component={FavoriteScreen} />
      </Stack.Navigator>
    </NavigationContainer>
    </NavigationIndependentTree>
  );
}

export default AppNavigation;
