import { useNavigation } from "@react-navigation/native";
import React from "react";
import { FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { heightPercentageToDP as hp, widthPercentageToDP as wp, } from "react-native-responsive-screen";
import { Category, Food } from "../screens/HomeScreen";

export default function Recipe({ categories, foods }: { categories: Category[]; foods: Food[] }) {
  const navigation = useNavigation();

  const renderItem = ({ item, index }: { item: Food; index: number }) => (
    <ArticleCard item={item} index={index} navigation={navigation} />
  );

  return (
    <View style={styles().container}>
      <FlatList
        style={styles().list}
        data={foods}
        renderItem={renderItem}
        keyExtractor={(item) => item.recipeId}
        showsVerticalScrollIndicator={false}
        nestedScrollEnabled={true}
        contentContainerStyle={styles().listContent}
        columnWrapperStyle={styles().row}
        numColumns={2}
        testID="recipesDisplay"
      />
    </View>
  );
}

const ArticleCard = ({ item, index, navigation }: { item: Food; index: number; navigation: any }) => {
  // Create staggered pattern: small(0), large(1), large(2), small(3), small(4), large(5)...
  const isLarge = index % 4 === 1 || index % 4 === 2;
  
  return (
    <View style={styles().cardContainer} testID="articleDisplay">
      <TouchableOpacity onPress={() => navigation.navigate("RecipeDetail",  item)}>
        <Image source={{ uri: item.recipeImage }} style={styles(isLarge).articleImage} />
        <Text style={styles().articleText}>{item.recipeName}</Text>
        <Text style={styles().articleDescription}>{item.cookingDescription}</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = (isLarge: boolean = false) =>  StyleSheet.create({
  container: {
    marginHorizontal: wp(4), // mx-4 equivalent
    marginTop: hp(2),
    marginBottom: hp(30),
  },
  title: {
    fontSize: hp(3),
    fontWeight: "600", // font-semibold
    color: "#52525B", // text-neutral-600
    marginBottom: hp(1.5),
  },
  loading: {
    marginTop: hp(20),
  },
  list: {
    flexGrow: 0,
  },
  listContent: {
    paddingBottom: hp(2),
  },
  cardContainer: {
    justifyContent: "center",
    marginBottom: hp(2),
    flex: 1,
    minWidth: wp(42),
    marginHorizontal: wp(1),
  },
  articleImage: {
    width: "100%",
    aspectRatio: isLarge ? 16 / 12 : 16 / 9,
    borderRadius: 20,
    backgroundColor: "rgba(0, 0, 0, 0.05)",
  },
  articleText: {
    fontSize: hp(1.5),
    fontWeight: "600", // font-semibold
    color: "#52525B", // text-neutral-600
    marginLeft: wp(2),
    marginTop: hp(0.5),
  },
  articleDescription: {
    fontSize: hp(1.2),
    color: "#6B7280", // gray-500
    marginLeft: wp(2),
    marginTop: hp(0.5),
  },
  row: {
    justifyContent: "space-between", // Align columns evenly
  },
});
