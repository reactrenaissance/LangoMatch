import axios from "axios";
import { PlacesAutoCompleteResponse } from "./types";

const fetchLocation = async (
  input: string
): Promise<PlacesAutoCompleteResponse> => {
  try {
    const response = await axios.get(
      `https://maps.googleapis.com/maps/api/place/autocomplete/json`,
      {
        params: {
          input: input,
          types: "(cities)",
          key: process.env.EXPO_PUBLIC_MAP_API_KEY,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.log(error);
    throw new Error("Failed to fetch location");
  }
};

export default fetchLocation;