import { api } from "@/convex/_generated/api";
import { useMutation, useQuery } from "convex/react";
import { Moon, Sun, X } from "lucide-react-native";
import React, { useState } from "react";
import {
  Dimensions,
  ImageBackground,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import DraggableFlatList, {
  RenderItemParams,
  ScaleDecorator,
} from "react-native-draggable-flatlist";
import { GestureHandlerRootView } from "react-native-gesture-handler";

type FilterType = "all" | "active" | "completed";

const MAX_CONTENT_WIDTH = 540;
const _isDesktop =
  Platform.OS === "web" && Dimensions.get("window").width > 768;

interface ReorderableTodo {
  _id: any;
  text: string;
  completed: boolean;
  order: number;
}

const TodoScreen = () => {
  const [input, setInput] = useState("");
  const [filter, setFilter] = useState<FilterType>("all");
  const [isDarkMode, setIsDarkMode] = useState(true);
  const todos = (useQuery(api.todos.getTodos) as ReorderableTodo[]) ?? [];
  const addTodo = useMutation(api.todos.addTodo);
  const toggleTodo = useMutation(api.todos.toggleTodo);
  const deleteTodo = useMutation(api.todos.deleteTodo);
  const clearCompleted = useMutation(api.todos.clearCompleted);
  const setTodoOrder = useMutation(api.todos.setOrder);
  const handleAddTodo = async () => {
    if (input.trim()) {
      await addTodo({ text: input });
      setInput("");
    }
  };
  const handleToggleTodo = async (id: any) => {
    await toggleTodo({ id });
  };
  const handleDeleteTodo = async (id: any) => {
    await deleteTodo({ id });
  };
  const handleClearCompleted = async () => {
    await clearCompleted();
  };
  const handleDragEnd = async ({ data }: { data: ReorderableTodo[] }) => {
    const newOrder = data.map((todo, index) => ({
      id: todo._id,
      order: index,
    }));

    try {
      await setTodoOrder({ newOrder });
    } catch (error) {
      console.error("Failed to update todo order:", error);
    }
  };
  const filteredTodos = todos.filter((todo) => {
    if (filter === "active") return !todo.completed;
    if (filter === "completed") return todo.completed;
    return true;
  });
  const itemsLeft = todos.filter((t) => !t.completed).length || 0;
  const bgImage = isDarkMode
    ? require("@/assets/images/Bitmap.jpg")
    : require("@/assets/images/Bitmap-light.jpg");

  const textColor = isDarkMode ? "#ffffff" : "#000000";
  const inputBg = isDarkMode ? "#25273D" : "rgba(255, 255, 255, 0.95)";
  const accentColor = "#8366d9";
  const separatorColor = isDarkMode ? "#393A4B" : "#E4E5F1";
  const checkboxBorderColor = isDarkMode
    ? "rgba(26, 58, 82, 0.5)"
    : "rgba(224, 224, 224, 0.5)";

  const screenBaseColor = isDarkMode ? "#181824" : "#F8F8F8";
  const overlayColor = isDarkMode
    ? "rgba(23, 24, 35, 0.7)"
    : "rgba(255, 255, 255, 0.1)";

  const footerTextColor = isDarkMode ? "#5B5E7E" : "#5B5E7E";
  const filterInactiveColor = isDarkMode ? "#5B5E7E" : "#999";
  const renderItem = ({
    item,
    drag,
    isActive,
    getIndex,
  }: RenderItemParams<ReorderableTodo>) => {
    const index = getIndex();
    const isLast = index === filteredTodos.length - 1;

    return (
      <ScaleDecorator>
        <View key={item._id}>
          <View style={styles.todoItem}>
            <TouchableOpacity
              onLongPress={drag}
              style={[
                styles.checkbox,
                {
                  borderColor: accentColor,
                  backgroundColor: item.completed ? accentColor : "transparent",
                },
              ]}
              onPress={() => handleToggleTodo(item._id)}
            >
              {item.completed && (
                <Text
                  style={{ color: "white", fontSize: 16, fontWeight: "bold" }}
                >
                  {" "}
                  ✓{" "}
                </Text>
              )}
            </TouchableOpacity>

            <Text
              style={[
                styles.todoText,
                {
                  color: item.completed
                    ? isDarkMode
                      ? "#5a6a79"
                      : "#999"
                    : textColor,
                  textDecorationLine: item.completed ? "line-through" : "none",
                },
              ]}
            >
              {item.text}
            </Text>

            <TouchableOpacity
              onPress={() => handleDeleteTodo(item._id)}
              style={styles.deleteBtn}
            >
              <X size={18} color={isDarkMode ? "#5a6a79" : "#ccc"} />
            </TouchableOpacity>
          </View>
          {!isLast && (
            <View
              style={[styles.separator, { backgroundColor: separatorColor }]}
            />
          )}
        </View>
      </ScaleDecorator>
    );
  };

  return (
    <GestureHandlerRootView style={styles.gestureRoot}>
      <View style={[styles.screenBase, { backgroundColor: screenBaseColor }]}>
        <ImageBackground
          source={bgImage}
          style={styles.backgroundImage}
          resizeMode="cover"
        >
          <View
            style={[styles.colorOverlay, { backgroundColor: overlayColor }]}
          />
        </ImageBackground>

        <View style={styles.outerContainerLayer}>
          <View style={styles.header}>
            <Text style={[styles.title, { color: textColor }]}>TODO</Text>
            <TouchableOpacity
              onPress={() => setIsDarkMode(!isDarkMode)}
              style={styles.themeToggle}
            >
              {isDarkMode ? (
                <Sun size={24} color="#ffffff" fill="#ffffff" />
              ) : (
                <Moon size={24} color="#ffffff" fill="#ffffff" />
              )}
            </TouchableOpacity>
          </View>

          <View style={[styles.mainContainer, { backgroundColor: inputBg }]}>
            <View style={styles.inputSection}>
              <View
                style={[
                  styles.inputWrapper,
                  { borderBottomColor: checkboxBorderColor },
                ]}
              >
                <View
                  style={[
                    styles.checkbox,
                    {
                      borderColor: accentColor,
                      backgroundColor: "transparent",
                    },
                  ]}
                />
                <TextInput
                  style={[styles.input, { color: textColor }]}
                  placeholder="Create a new todo..."
                  placeholderTextColor={isDarkMode ? "#7a8a99" : "#999"}
                  value={input}
                  onChangeText={setInput}
                  onSubmitEditing={handleAddTodo}
                />
              </View>
            </View>
          </View>

          <View
            style={[styles.todoListContainer, { backgroundColor: inputBg }]}
          >
            <DraggableFlatList
              data={filteredTodos}
              keyExtractor={(item) => item._id.toString()}
              onDragEnd={handleDragEnd}
              renderItem={renderItem}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{
                flexGrow: 1,
              }}
              activationDistance={10}
            />

            <View
              style={[styles.footer, { borderTopColor: checkboxBorderColor }]}
            >
              <Text style={[styles.itemsLeft, { color: footerTextColor }]}>
                {itemsLeft} items left
              </Text>
              <TouchableOpacity onPress={handleClearCompleted}>
                <Text style={[styles.footerText, { color: footerTextColor }]}>
                  Clear Completed
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={[styles.filterContainer, { backgroundColor: inputBg }]}>
            <View style={styles.filterButtons}>
              {(["all", "active", "completed"] as FilterType[]).map((f) => (
                <TouchableOpacity
                  key={f}
                  onPress={() => setFilter(f)}
                  style={styles.filterBtn}
                >
                  <Text
                    style={[
                      styles.filterText,
                      {
                        color: filter === f ? accentColor : filterInactiveColor,
                        fontWeight: filter === f ? "700" : "400",
                      },
                    ]}
                  >
                    {f.charAt(0).toUpperCase() + f.slice(1)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <Text
            style={[
              styles.dragHint,
              { color: isDarkMode ? "#3a4a59" : "#ddd" },
            ]}
          >
            Drag and drop to reorder list
          </Text>
        </View>
      </View>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  gestureRoot: {
    flex: 1,
  },
  screenBase: {
    flex: 1,
  },
  backgroundImage: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 250,
    zIndex: 1,
  },
  colorOverlay: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 2,
  },
  outerContainerLayer: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 40,
    paddingBottom: 20,
    zIndex: 10,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 40,
    width: "100%",
    maxWidth: MAX_CONTENT_WIDTH,
    alignSelf: "center",
  },
  title: {
    fontSize: 40,
    fontFamily: "Josefin-Bold",
    letterSpacing: 15,
  },
  themeToggle: {
    padding: 8,
  },
  mainContainer: {
    width: "100%",
    maxWidth: MAX_CONTENT_WIDTH,
    alignSelf: "center",
    height: 64,
    borderRadius: 8,
    overflow: "hidden",
    flexDirection: "column",
    marginBottom: 20,
  },
  inputSection: {
    paddingHorizontal: 16,
    paddingLeft: 24,
    paddingVertical: 0,
    paddingBottom: 0,
    flex: 1,
    justifyContent: "center",
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 0,
    gap: 12,
  },
  input: {
    flex: 1,
    fontSize: 18,
    fontFamily: "Josefin-Regular",
    letterSpacing: -0.25,
    height: 64,
  },
  todoListContainer: {
    width: "100%",
    maxWidth: MAX_CONTENT_WIDTH,
    alignSelf: "center",
    flex: 1,
    borderRadius: 8,
    overflow: "hidden",
    flexDirection: "column",
    marginBottom: 16,
  },
  listContainer: {
    flex: 1,
  },
  todoItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 24,
    paddingVertical: 14,
    gap: 12,
    backgroundColor: "transparent",
  },
  separator: {
    height: 1,
    marginHorizontal: 0,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    justifyContent: "center",
    alignItems: "center",
    flexShrink: 0,
  },
  todoText: {
    flex: 1,
    fontSize: 18,
    fontFamily: "Josefin-Regular",
    letterSpacing: -0.25,
  },
  deleteBtn: {
    padding: 6,
    flexShrink: 0,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderTopWidth: 1,
  },
  itemsLeft: {
    fontSize: 14,
    fontFamily: "Josefin-Regular",
    letterSpacing: -0.194,
  },
  footerText: {
    fontSize: 14,
    fontFamily: "Josefin-Regular",
    letterSpacing: -0.194,
  },
  filterContainer: {
    width: "100%",
    maxWidth: MAX_CONTENT_WIDTH,
    alignSelf: "center",
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 16,
  },
  filterButtons: {
    flexDirection: "row",
    gap: 20,
    justifyContent: "center",
  },
  filterBtn: {
    paddingVertical: 4,
  },
  filterText: {
    fontSize: 14,
    fontFamily: "Josefin-Regular",
    letterSpacing: -0.194,
  },
  dragHint: {
    textAlign: "center",
    fontSize: 12,
    fontWeight: "400",
    marginTop: 16,
  },
});

export default TodoScreen;
