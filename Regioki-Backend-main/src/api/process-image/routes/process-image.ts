export default {
  routes: [
    {
      method: "POST",
      path: "/process-image",
      handler: "process-image.extractText",
    },
    {
      method: "POST",
      path: "/process-image-new",
      handler: "process-image.newExtractTextFunc",
    },
  ],
};
