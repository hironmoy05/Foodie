import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useState } from "react";
import { Image, StyleSheet, Text, TextInput, TouchableOpacity, View, } from "react-native";
import { heightPercentageToDP as hp, widthPercentageToDP as wp, } from "react-native-responsive-screen";

interface Recipe {
  title: string;
  image: string;
  description: string;
}

export default function RecipesFormScreen({ route, navigation }: { route: any; navigation: any }) {
  const { recipeToEdit, recipeIndex, onrecipeEdited, onrecipeAdded } = route.params || {};
  console.log("RecipesFormScreen route.params:", route.params);
  const [title, setTitle] = useState(recipeToEdit ? recipeToEdit.title : "");
  const [image, setImage] = useState(recipeToEdit ? recipeToEdit.image : "");
  const [description, setDescription] = useState(
    recipeToEdit ? recipeToEdit.description : ""
  );

  const saverecipe = async () => {
    console.log("Saving recipe:", { title, image, description });
    try {
      // 1. Initialize a new recipe object
      const newrecipe = {
        title,
        image,
        description,
      };

      // 2. Retrieve existing recipes from AsyncStorage
      let recipes: Recipe[] = [];
      if (AsyncStorage) {
        const existingRecipesJSON = await AsyncStorage.getItem("customrecipes");
        recipes = existingRecipesJSON ? JSON.parse(existingRecipesJSON) : [];
      }

      // 3. Update or add recipe
      if (recipeToEdit && recipeIndex !== undefined) {
        // Editing an existing recipe
        recipes[recipeIndex] = newrecipe;
        // 4. Call callback to notify parent component
        if (onrecipeEdited) {
          console.log("Calling onrecipeEdited callback");
          onrecipeEdited(recipeIndex, newrecipe);
        }
      } else {
        // Adding a new recipe
        recipes.push(newrecipe);
        console.log("Added new recipe to array:", recipes);
        // Call callback to notify parent component
        if (onrecipeAdded) {
          console.log("Calling onrecipeAdded callback with:", newrecipe);
          onrecipeAdded(newrecipe);
        } else {
          console.log("onrecipeAdded callback not provided");
        }
      }

      // 5. Save updated array back to AsyncStorage
      if (AsyncStorage) {
        try {
          await AsyncStorage.setItem("customrecipes", JSON.stringify(recipes));
          console.log("Saved recipes to AsyncStorage:", recipes);
        } catch (storageError) {
          console.error("Failed to save to AsyncStorage:", storageError);
        }
      }

      // 6. Navigate back to previous screen
      console.log("Navigating back to previous screen");
      navigation.goBack();
    } catch (error) {
      console.error("Error saving recipe:", error);
      // Still navigate back even if storage fails
      navigation.goBack();
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        placeholder="Title"
        value={title}
        onChangeText={setTitle}
        style={styles.input}
      />
      <TextInput
        placeholder="Image URL"
        value={image}
        onChangeText={setImage}
        style={styles.input}
      />
      {image ? (
        <Image source={{ uri: image }} style={styles.image} />
      ) : (
        <Text style={styles.imagePlaceholder}>Upload Image URL</Text>
      )}
      <TextInput
        placeholder="Description"
        value={description}
        onChangeText={setDescription}
        multiline={true}
        numberOfLines={4}
        style={[styles.input, { height: hp(20), textAlignVertical: "top" }]}
      />
      <TouchableOpacity onPress={saverecipe} style={styles.saveButton}>
        <Text style={styles.saveButtonText}>Save recipe</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: wp(4),
  },
  input: {
    marginTop: hp(4),
    borderWidth: 1,
    borderColor: "#ddd",
    padding: wp(.5),
    marginVertical: hp(1),
  },
  image: {
    width: 300,
    height:200,
    margin: wp(2),
  },
  imagePlaceholder: {
    height: hp(20),
    justifyContent: "center",
    alignItems: "center",
    marginVertical: hp(1),
    borderWidth: 1,
    borderColor: "#ddd",
    textAlign: "center",
    padding: wp(2),
  },
  saveButton: {
    backgroundColor: "#4F75FF",
    padding: wp(.5),
    alignItems: "center",
    borderRadius: 5,
    marginTop: hp(2),
  },
  saveButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});
