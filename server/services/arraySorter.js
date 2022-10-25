function sortWith(array, condition) {
  try {
    switch (condition) {
      case "latest":
        array.sort((a, b) => {
          return new Date(b.publishDate) - new Date(a.publishDate);
        });
        break;
      case "best":
        array.sort((a, b) => {
          if (b.statistics.likes - b.statistics.dislikes > a.statistics.likes - a.statistics.dislikes) {
            return 1;
          }
          return -1;
        });
        break;
      case "hot":
        array.sort((a, b) => {
          //pubulished til now --minutes
          const aCreateTime = (Date.now() - new Date(a.publishDate)) / 1000 / 60;
          //pubulished til now --minutes
          const bCreateTime = (Date.now() - new Date(b.publishDate)) / 1000 / 60;
          const aHot = Math.round(a.statistics.likes / aCreateTime);
          const bHot = Math.round(b.statistics.likes / bCreateTime);
          if (aHot > bHot) {
            return -1;
          }
          return 1;
        });
        break;
      default:
        array.sort((a, b) => {
          return b.statistics.likes - a.statistics.likes;
        });
    }
    return array;
  } catch (error) {
    console.log('sortWith Failed -- aSService');
  }
}
export {sortWith}