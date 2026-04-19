import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import React, { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from "react-native-responsive-screen";

// Global recipes state for this session
let globalRecipes: Recipe[] = [];

interface Recipe {
  title: string;
  image: string;
  description: string;
}

export default function MyRecipeScreen() {
  const navigation = useNavigation();
  const [recipes, setrecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  
    const fetchrecipes = useCallback(async () => {
      try {
        if (AsyncStorage) {
          const storedRecipes = await AsyncStorage.getItem("customrecipes");
          console.log("Fetched recipes from AsyncStorage:", storedRecipes);
          if (storedRecipes) {
            const parsed = JSON.parse(storedRecipes);
            console.log("Parsed recipes:", parsed);
            globalRecipes = parsed; // Update global state
            setrecipes(parsed);
          } else {
            console.log("No recipes found in AsyncStorage, using global state");
            setrecipes(globalRecipes);
          }
        } else {
          console.log("AsyncStorage not available, using global state");
          setrecipes(globalRecipes);
        }
      } catch (error) {
        console.error("Error fetching recipes:", error);
        // Fallback: use global state
        setrecipes(globalRecipes);
      } finally {
        setLoading(false);
      }
    }, []);

    useEffect(() => {
      fetchrecipes();
    }, [fetchrecipes]);

    useFocusEffect(
      useCallback(() => {
        console.log("MyRecipeScreen focused, refetching recipes");
        fetchrecipes();
      }, [fetchrecipes])
    );

    console.log("MyRecipeScreen rendering with recipes count:", recipes.length);
  
    const handleAddrecipe = () => {
      console.log("Navigating to RecipesFormScreen");
      // @ts-ignore
      navigation.navigate("RecipesFormScreen", {
        onrecipeAdded: (newRecipe: Recipe) => {
          console.log("onrecipeAdded callback called with:", newRecipe);
          globalRecipes = [...globalRecipes, newRecipe]; // Update global state
          setrecipes(prevRecipes => {
            const updated = [...prevRecipes, newRecipe];
            console.log("Updated recipes state:", updated);
            return updated;
          });
        }
      });
    };
  
    const handlerecipeClick = (recipe: Recipe) => {
      // @ts-ignore
      navigation.navigate("CustomRecipesScreen", { recipe });
    };
    const deleterecipe = async (index: number) => {
      try {
        const updatedRecipes = recipes.filter((_, i) => i !== index);
        globalRecipes = updatedRecipes; // Update global state
        setrecipes(updatedRecipes);
        if (AsyncStorage) {
          await AsyncStorage.setItem("customrecipes", JSON.stringify(updatedRecipes));
        }
      } catch (error) {
        console.error("Error deleting recipe:", error);
        // Still update local state even if storage fails
        const updatedRecipes = recipes.filter((_, i) => i !== index);
        globalRecipes = updatedRecipes;
        setrecipes(updatedRecipes);
      }
    };
  
    const editrecipe = (recipe: Recipe, index: number) => {
      // @ts-ignore
      navigation.navigate("RecipesFormScreen", {
        recipeToEdit: recipe,
        recipeIndex: index,
        onrecipeEdited: (updatedIndex: number, updatedRecipe: Recipe) => {
          const updatedRecipes = [...recipes];
          updatedRecipes[updatedIndex] = updatedRecipe;
          setrecipes(updatedRecipes);
        }
      });
    };
  
    return (
      <View style={styles.container}>
        {/* Back Button */}
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Text style={styles.backButtonText}>{"Back"}</Text>
        </TouchableOpacity>
  
        <TouchableOpacity onPress={handleAddrecipe} style={styles.addButton}>
          <Text style={styles.addButtonText}>Add New recipe</Text>
        </TouchableOpacity>
  
        {loading ? (
          <ActivityIndicator size="large" color="#f59e0b" />
        ) : (
          <ScrollView contentContainerStyle={styles.scrollContainer}>
            {recipes.length === 0 ? (
              <Text style={styles.norecipesText}>
                No recipes added yet. Tap Add New recipe to open the form.
              </Text>
            ) : (
              recipes.map((recipe, index) => (
                <View key={index} style={styles.recipeCard} testID="recipeCard">
                  <TouchableOpacity testID="handlerecipeBtn" onPress={() => handlerecipeClick(recipe)}>
                    {recipe.image && (
                      <Image source={{ uri: recipe.image }} style={styles.recipeImage} />
                    )}
                    <Text style={styles.recipeTitle}>{recipe.title}</Text>
                    <Text style={styles.recipeDescription} testID="recipeDescp">
                      {recipe.description}
                    </Text>
                  </TouchableOpacity>
  
                  {/* Edit and Delete Buttons */}
                  <View style={styles.actionButtonsContainer} testID="editDeleteButtons">
                    <TouchableOpacity
                      onPress={() => editrecipe(recipe, index)}
                      style={styles.editButton}
                    >
                      <Text style={styles.editButtonText}>Edit</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => deleterecipe(index)}
                      style={styles.deleteButton}
                    >
                      <Text style={styles.deleteButtonText}>Delete</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ))
            )}
          </ScrollView>
        )}
      </View>
    );
  }
  
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: wp(4),
      backgroundColor: "#F9FAFB",
    },
    backButton: {
      marginBottom: hp(1.5),
    },
    backButtonText: {
      fontSize: hp(2.2),
      color: "#4F75FF",
    },
    addButton: {
      backgroundColor: "#4F75FF",
      paddingVertical: hp(1.2),
      paddingHorizontal: wp(4),
      alignItems: "center",
      borderRadius: 10,
      alignSelf: "center",
      marginBottom: hp(2),
    },
    addButtonText: {
      color: "#fff",
      fontWeight: "600",
      fontSize: hp(2.2),
    },
    scrollContainer: {
      paddingBottom: hp(2),
      width: "100%",
      flexDirection: "row",
      flexWrap: "wrap",
      justifyContent: "center",
    },
    norecipesText: {
      textAlign: "center",
      fontSize: hp(2),
      color: "#6B7280",
      marginTop: hp(5),
    },
    recipeCard: {
      width: 400, // Make recipe card width more compact
      height: 300, // Adjust the height of the card to fit content
      backgroundColor: "#fff",
      padding: wp(3),
      borderRadius: 8,
      marginBottom: hp(2),
      shadowColor: "#000",
      shadowOpacity: 0.1,
      shadowRadius: 4,
      shadowOffset: { width: 0, height: 2 },
      elevation: 3, // for Android shadow
    },
    recipeImage: {
      width: 300, // Set width for recipe image
      height: 150, // Adjust height of the image
      borderRadius: 8,
      marginBottom: hp(1),
    },
    recipeTitle: {
      fontSize: hp(2),
      fontWeight: "600",
      color: "#111827",
      marginBottom: hp(0.5),
    },
    recipeDescription: {
      fontSize: hp(1.8),
      color: "#6B7280",
      marginBottom: hp(1.5),
    },
    actionButtonsContainer: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginTop: hp(1),
    },
    editButton: {
      backgroundColor: "#34D399",
      padding: wp(.5),
      borderRadius: 5,
      width: 100, // Adjust width of buttons to be more compact
      alignItems: "center",
    },
    editButtonText: {
      color: "#fff",
      fontWeight: "600",
      fontSize: hp(1.8),
    },
    deleteButton: {
      backgroundColor: "#EF4444",
      padding: wp(.5),
      borderRadius: 5,
      width: 100, // Adjust width of buttons to be more compact
      alignItems: "center",
    },
    deleteButtonText: {
      color: "#fff",
      fontWeight: "600",
      fontSize: hp(1.8),
    },
  });
  