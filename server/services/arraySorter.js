import { postPopularity } from "./postServices.js";

function sortWith(array, condition) {
  try {
    switch (condition) {
      case "new":
        array.sort((a, b) => {
          return new Date(b.publishDate) - new Date(a.publishDate);
        });
        break;
      case "top":
        array.sort((a, b) => {
          if (b.statistics.likes - b.statistics.dislikes > a.statistics.likes - a.statistics.dislikes) {
            return 1;
          }
          return -1;
        });
        break;
      case "hot":
        array.sort((a, b) => {
          //pubulished till now --seconds
          const aCreateTime = (Date.now() - new Date(a.publishDate)) / 1000 / 60;
          //pubulished till now --seconds
          const bCreateTime = (Date.now() - new Date(b.publishDate)) / 1000 / 60;
          const aHot = Math.round(postPopularity(a) / aCreateTime);
          const bHot = Math.round(postPopularity(b) / bCreateTime);
          return bHot - aHot;
        });
        break;
      case "dislikes":
        array.sort((a, b) => {
          return b.statistics.dislikes - a.statistics.dislikes;
        });
        break;
      default:
        array.sort((a, b) => {
          return b.statistics.likes - a.statistics.likes;
        });
        break;
    }
    return array;
  } catch (error) {
    console.log("sortWith Failed -- aSService");
  }
}
export { sortWith };
