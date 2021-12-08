import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  FlatList,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { Text, View } from "../components/Themed";
import movie from "../data/movie";
import { ScrollView } from "react-native";
import {
  AntDesign,
  Feather,
  FontAwesome,
  Ionicons,
  MaterialIcons,
} from "@expo/vector-icons";
import { Picker } from "@react-native-picker/picker";
import * as FileSystem from "expo-file-system";
import { addDownload } from "../store/actions/download";
import * as movieActions from "../store/actions/movie";
import * as seriesActions from "../store/actions/series";
import series from "../store/reducers/series";
import { useDispatch, useSelector } from "react-redux";
import { useNavigation } from "@react-navigation/core";
import VideoPlayBack from "../components/VideoPlayBack";
import EpisodeItems from "../components/EpisodeItems";
import Episode from "./../models/Episde";

function MovieDetailScreen(props: any) {
  const dispatch = useDispatch();

  const navigation = useNavigation();

  let movieId = props.route.params.movieId;
  let episodeId = props.route.params.episodeId;
  const episodes: [] = useSelector((state) => state.series.availableEpisode);
  const season: [] = useSelector((state) => state.series.availableSeason);
  const movieById: [] = useSelector((state) => state.movies.availableMovieById);
  const movie: [] = useSelector((state) => state.movies.availableMovies);

  const series: [] = useSelector((state) => state.series.availableSeries);

  console.log("MMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMM ", movieById);

  let selecedMovieById = movieId
    ? movie.find((item: any) => item.id === movieId)
    : null;

  let selectedEpisodOb = episodeId
    ? episodes.find((item: any) => item.id === episodeId)
    : null;
  let selectedSeason = episodeId
    ? season.find((item: any) => item.id === selectedEpisodOb.season_id.id)
    : null;
  let selectedSeries1 = episodeId
    ? series.find((item: any) => item.id === selectedSeason.series_id.id)
    : null;

  let selectSeasonPicker = episodeId
    ? season.filter((item: any) => item.series_id.id === selectedSeries1.id)
    : null;

  let selectedSeries = [];
  selectedSeries.push(selectedSeries1);

  let selectedEpisodeA = [];
  selectedEpisodeA.push(selectedEpisodOb);

  const seasons = episodeId
    ? selectSeasonPicker.map((seasonN: any) => seasonN.name)
    : null;
  const firstSeasone = selectedSeason;
  const [currentSeasone, setCurrentSeasone] = useState(firstSeasone);
  const [currentEpisode, setCurrentEpisode] = useState(selectedEpisodOb);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const filteredEpies = episodeId
    ? episodes.filter((item: Episode) => {
        return item.season_id.id === currentSeasone.id;
      })
    : null;

  //creating downloadResumable.
  const resumableDownload = useRef(
    FileSystem.createDownloadResumable(
      "http://d23dyxeqlo5psv.cloudfront.net/big_buck_bunny.mp4",
      FileSystem.documentDirectory + "big_buck_bunny.mp4",
      {}
    )
  );

  const episodeAndSeasonHandler = useCallback(async () => {
    try {
      setError(null);
      setIsLoading(true);
      {
        movieId ? await dispatch(movieActions.fetchMovieById(movieId)) : null;
      }
      await dispatch(seriesActions.fetchSeries());
      await dispatch(seriesActions.fetchEpisode());
      await dispatch(seriesActions.fetchSeason());
      setIsLoading(false);
    } catch (err: any) {
      setError(err.message);
      setIsLoading(false);
      console.log(err.message);
    }
  }, [dispatch]);
  useEffect(() => {
    episodeAndSeasonHandler();
  }, [dispatch, episodeAndSeasonHandler]);
  return (
    <View style={{ flex: 1, backgroundColor: "#000", paddingTop: 20 }}>
      <View>
        <VideoPlayBack episode={movieId ? selecedMovieById : currentEpisode} />
      </View>

      <ScrollView>
        <View style={{ backgroundColor: "#000" }}>
          <FlatList
            key={movieId ? movieId : episodeId}
            data={movieId ? movieById : selectedSeries}
            renderItem={({ item }) => {
              return (
                <View style={{ backgroundColor: "#000" }}>
                  <Text style={{ fontSize: 30, margin: 10, color: "#FFF" }}>
                    {item.title}
                  </Text>

                  <View
                    style={{
                      flexDirection: "row-reverse",
                      marginLeft: 10,
                      backgroundColor: "#000",
                    }}
                  >
                    <Text style={{ color: "#61a832", marginHorizontal: 7 }}>
                      98% match
                    </Text>
                    <Text
                      style={{
                        fontSize: 18,
                        marginHorizontal: 10,
                        color: "#FFF",
                      }}
                    >
                      {item.name}
                    </Text>
                    <View style={styles.numContainer}>
                      <Text style={{ color: "black" }}>12+</Text>
                    </View>
                    <Text style={styles.text1}>{item.title}</Text>
                    <Text style={styles.text2}>{item.id}</Text>
                    <MaterialIcons name="hd" size={24} color="white" />
                  </View>
                  <TouchableOpacity
                    onPress={() => {
                      return <Text>lsdjflsd</Text>;
                    }}
                    style={styles.playIcon}
                  >
                    <Ionicons name="play-sharp" size={24} color="black" />
                    <Text style={{ color: "black", marginLeft: 5 }}>Play</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.downloadIcon}
                    onPress={async () => {
                      await dispatch(
                        addDownload(
                          resumableDownload.current.savable(),
                          movieId ? movieById[0].id : null,
                          selectedEpisodOb,
                          false
                        )
                      );
                    }}
                  >
                    <AntDesign name="download" size={24} color="black" />
                    <Text style={{ color: "#FFF", marginLeft: 5 }}>
                      DownLoad
                    </Text>
                  </TouchableOpacity>

                  <Text
                    style={{ margin: 15, alignItems: "center", color: "#FFF" }}
                  >
                    {" "}
                    {item.plot}{" "}
                  </Text>
                  <Text style={{ marginHorizontal: 10, color: "#4e5450" }}>
                    {" "}
                    Cast: {item.cast}{" "}
                  </Text>
                  <Text style={{ marginHorizontal: 10, color: "#4e5450" }}>
                    {" "}
                    Creator: {item.creator_name}{" "}
                  </Text>
                  <View
                    style={{
                      backgroundColor: "#FFF",
                      width: "80%",
                      height: 1,
                      marginLeft: 13,
                      marginTop: 5,
                    }}
                  ></View>
                  <View
                    style={{
                      flexDirection: "row",
                      marginHorizontal: 30,
                      marginTop: 10,
                      backgroundColor: "#000",
                    }}
                  >
                    <View
                      style={{
                        alignItems: "center",
                        marginHorizontal: 20,
                        backgroundColor: "#000",
                      }}
                    >
                      <MaterialIcons name="add" size={26} color="#FFF" />
                      <Text style={{ color: "#FFF" }}>My List</Text>
                    </View>
                    <View
                      style={{
                        alignItems: "center",
                        marginHorizontal: 20,
                        backgroundColor: "#000",
                      }}
                    >
                      <Feather name="thumbs-up" size={26} color="#FFF" />
                      <Text style={{ color: "#FFF" }}>Rate</Text>
                    </View>
                    <View
                      style={{
                        alignItems: "center",
                        marginHorizontal: 20,
                        backgroundColor: "#000",
                      }}
                    >
                      <FontAwesome name="send-o" size={26} color="#FFF" />
                      <Text style={{ color: "#FFF" }}>Rate</Text>
                    </View>
                  </View>
                  <View
                    style={{
                      backgroundColor: "red",
                      width: 80,
                      height: 2,
                      marginLeft: 40,
                      marginTop: 5,
                    }}
                  ></View>

                  <View
                    style={{
                      marginTop: 10,
                      marginBottom: 20,
                      flexDirection: "row",
                      backgroundColor: "#000",
                    }}
                  >
                    {episodeId ? (
                      <Text style={{ marginHorizontal: 14, color: "#8e96a3" }}>
                        {" "}
                        EPISODES{" "}
                      </Text>
                    ) : (
                      <Text style={{ marginHorizontal: 14, color: "#8e96a3" }}>
                        {" "}
                        MOVIE{" "}
                      </Text>
                    )}
                    <Text style={{ color: "#8e96a3" }}>MORE LIKE THIS</Text>
                  </View>
                  {episodeId ? (
                    <Picker
                      style={{
                        width: 220,
                        color: "#FFF",
                        backgroundColor: "#FFF",
                      }}
                      selectedValue={currentSeasone.name}
                      onValueChange={(itemValue, itemIndex) =>
                        setCurrentSeasone(selectSeasonPicker[itemIndex])
                      }
                      dropdownIconColor="#FFF"
                    >
                      {seasons.map((seasonName: any) => (
                        <Picker.Item label={seasonName} value={seasonName} />
                      ))}
                    </Picker>
                  ) : null}
                </View>
              );
            }}
          />
        </View>
        <View>
          {episodeId && episodes ? (
            <FlatList
              data={filteredEpies}
              renderItem={({ item }) => {
                return (
                  <EpisodeItems
                    episode={item}
                    onPress={() => {
                      setCurrentEpisode(item);
                    }}
                  />
                );
              }}
            />
          ) : null}
        </View>
      </ScrollView>
    </View>
  );
}
// }
const styles = StyleSheet.create({
  image: {
    width: "100%",
    aspectRatio: 16 / 9,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginTop: 10,
    marginHorizontal: 15,
  },
  numContainer: {
    backgroundColor: "yellow",
    width: 40,
    height: 30,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 5,
    marginRight: 20,
  },
  text1: {
    fontSize: 18,
    marginRight: 2,
    color: "#FFF",
  },
  text2: {
    fontSize: 18,
    marginLeft: 2,
    marginRight: 10,
    color: "#FFF",
  },
  playIcon: {
    alignSelf: "center",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    width: "92%",
    height: 36,
    backgroundColor: "white",
    marginTop: 10,
    borderRadius: 5,
  },
  downloadIcon: {
    alignSelf: "center",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    width: "92%",
    height: 36,
    backgroundColor: "#4e5450",
    marginTop: 10,
    borderRadius: 5,
  },
  video: {
    aspectRatio: 16 / 9,
    width: "100%",
  },
});
export default MovieDetailScreen;
