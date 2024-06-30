import fetchLocation from "@backend/location";
import {
  Center,
  Input,
  Pressable,
  ScrollView,
  Spinner,
  Text,
  VStack,
} from "@gluestack-ui/themed-native-base";
import React, { useEffect } from "react";
import { Modal } from "react-native";
import { useQuery } from "react-query";

type SelectLocationProps = {
  onSelectLocation: (location: string) => void;
  isOpen: boolean;
  onClose: () => void;
};

export default function SelectLocation({
  isOpen,
  onClose,
  onSelectLocation,
}: SelectLocationProps) {
  const [search, setSearch] = React.useState("");
  const [debouncedSearch, setDebouncedSearch] = React.useState("");

  const { data, error, isFetching, isLoading } = useQuery(
    ["location", debouncedSearch],
    () => fetchLocation(debouncedSearch),
    {
      enabled: !!debouncedSearch,
    }
  );

  useEffect(() => {
    if (!isOpen) {
      setSearch("");
    }
  }, [isOpen]);

  React.useEffect(() => {
    const timeoutId = setTimeout(() => {
      setDebouncedSearch(search);
    }, 500);

    return () => {
      clearTimeout(timeoutId);
    };
  }, [search]);

  return (
    <Modal animationType="slide" visible={isOpen} onRequestClose={onClose}>
      <VStack gap={2} p={4}>
        <Text fontSize="sm">Search for a location</Text>
        <Input
          onChangeText={(text) => setSearch(text)}
          value={search}
          placeholder="Search for a location"
          autoFocus
          type="text"
          searchIcon
        />
      </VStack>

      <ScrollView px={4} contentContainerStyle={{ flexGrow: 1 }}>
        {isFetching || isLoading ? (
          <Center p="4">
            <Spinner size={"lg"} color="blue.500" />
          </Center>
        ) : (
          <>
            {data?.predictions.map((prediction) => (
              <Pressable
                key={prediction.place_id}
                px={2}
                py={3}
                borderBottomWidth={1}
                borderBottomColor="#e9e9e9"
                onPress={() => {
                  onSelectLocation?.(prediction.description);
                  onClose?.();
                }}
              >
                <Text>{prediction.description}</Text>
              </Pressable>
            ))}
            {error && (
              <Text textAlign="center" color="red.500" py={4}>
                Error fetching location
              </Text>
            )}

            {data?.predictions.length === 0 && (
              <Text textAlign="center" color="gray.500" py={4}>
                No results found
              </Text>
            )}

            {debouncedSearch.length === 0 && (
              <Text textAlign="center" color="gray.500" py={4}>
                Start typing to search for a location
              </Text>
            )}
          </>
        )}
      </ScrollView>
    </Modal>
  );
}
