import { ADD_DOWNLOAD, FETCH_DOWNLOADS, UPDATE_DOWNLOAD } from "../actions/download";
import * as fileSystem from "expo-file-system";
import { useState } from "react";
import { Download } from "../../models/Download";
const DInitialState = {
  downloadList: [],
};

export default  (state = DInitialState, action: any) => {
  switch (action.type) {
    case ADD_DOWNLOAD:
      const downloadItem = new Download(
        action.downloadId,
        action.download,
        action.movieId,
        action.episodeId,
        false
      );
      const newList = [...state.downloadList, downloadItem];
      return { downloadList: newList };
    case FETCH_DOWNLOADS:
      const resumableDownload = fileSystem.createDownloadResumable(
        "http://d23dyxeqlo5psv.cloudfront.net/big_buck_bunny.mp4",
        fileSystem.documentDirectory + "small.mp4",
        {}
      );
      const list: [] = action.downloadList;
      const dList = list.map(
        (item: any, index) =>
          new Download(
            item.id,
            resumableDownload.savable(),
            // null,
            item.movie ? item.movie.id : null,
            item.episode ? item.episode.id : null,
            // null,
            item.downloaded,
          )
      );
      return { downloadList: dList};
    case UPDATE_DOWNLOAD: 
       const doList: never[] = state.downloadList;
       doList.forEach((element: any) => {
           if(element.downloadId === action.downloadId){
               element.downloaded = true;
           }
       }); 
       return { downloadList: doList};
    default:
      return DInitialState;
  }
};